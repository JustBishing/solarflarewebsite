import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminEditableField from '../components/admin/AdminEditableField.jsx';
import AdminEditableUrlField from '../components/admin/AdminEditableUrlField.jsx';
import AdminEditorSection from '../components/admin/AdminEditorSection.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import { defaultSiteContent } from '../lib/siteContent.js';
import {
  auth,
  isFirebaseConfigured,
  missingFirebaseEnvKeys,
  saveSiteContent,
  signInWithGoogle,
  signOutAdmin,
} from '../lib/firebase.js';

const MotionDiv = motion.div;

const parseAuthorizedEmails = () =>
  (import.meta.env.VITE_ADMIN_AUTHORIZED_EMAILS || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const authorizedEmails = parseAuthorizedEmails();

const createTeamMember = () => ({
  name: 'New teammate',
  role: 'Role',
  bio: 'Add a short bio here.',
  photo: 'https://placehold.co/320x320/EA5020/FFFFFF?text=Member',
});

const createSponsor = () => ({
  name: 'New sponsor',
  contribution: 'Support details',
  website: 'https://example.com',
  logo: 'https://placehold.co/200x100/F89221/FFFFFF?text=Sponsor',
});

const createAchievement = () => ({
  date: 'Season update',
  event: 'New highlight',
  summary: 'Describe what happened.',
});

const createTier = () => ({
  title: 'New tier',
  amount: '$0',
  benefits: ['Add benefit'],
});

const createLink = (label = 'New link', href = 'https://example.com') => ({
  label,
  href,
});

const isAuthorizedEmail = (email) => {
  if (!email) {
    return false;
  }

  const normalizedEmail = email.toLowerCase();

  return authorizedEmails.some((entry) => {
    if (entry === normalizedEmail) {
      return true;
    }

    if (entry.startsWith('@')) {
      return normalizedEmail.endsWith(entry);
    }

    return false;
  });
};

const cloneValue = (value) => JSON.parse(JSON.stringify(value));

const updateIn = (value, path, nextValue) => {
  if (path.length === 0) {
    return nextValue;
  }

  const [key, ...rest] = path;

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      index === key ? updateIn(item, rest, nextValue) : item,
    );
  }

  return {
    ...value,
    [key]: updateIn(value[key], rest, nextValue),
  };
};

const removeFrom = (value, path, indexToRemove) => {
  if (path.length === 0) {
    return value.filter((_, index) => index !== indexToRemove);
  }

  const [key, ...rest] = path;

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      index === key ? removeFrom(item, rest, indexToRemove) : item,
    );
  }

  return {
    ...value,
    [key]: removeFrom(value[key], rest, indexToRemove),
  };
};

const insertInto = (value, path, nextItem) => {
  if (path.length === 0) {
    return [...value, nextItem];
  }

  const [key, ...rest] = path;

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      index === key ? insertInto(item, rest, nextItem) : item,
    );
  }

  return {
    ...value,
    [key]: insertInto(value[key], rest, nextItem),
  };
};

const ActionButton = ({ children, onClick, tone = 'secondary' }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      tone === 'primary'
        ? 'rounded-xl bg-sf-orange-1 px-4 py-2 text-sm font-semibold text-sf-bg transition hover:bg-sf-orange-2'
        : 'rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1'
    }
  >
    {children}
  </button>
);

const Admin = () => {
  const { loadError, siteContent } = useSiteContent();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(!isFirebaseConfigured);
  const [draftContent, setDraftContent] = useState(cloneValue(defaultSiteContent));
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const isAuthorized = useMemo(
    () => isAuthorizedEmail(user?.email || ''),
    [user],
  );

  useEffect(() => {
    setDraftContent(cloneValue(siteContent));
  }, [siteContent]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthChecked(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  const setField = (path, value) => {
    setDraftContent((current) => updateIn(current, path, value));
    setStatus('');
    setSaveError('');
  };

  const addItem = (path, item) => {
    setDraftContent((current) => insertInto(current, path, item));
    setStatus('');
    setSaveError('');
  };

  const removeItem = (path, index) => {
    setDraftContent((current) => removeFrom(current, path, index));
    setStatus('');
    setSaveError('');
  };

  const handleSignIn = async () => {
    setStatus('');
    setSaveError('');
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setStatus('');
    setSaveError('');

    try {
      await signOutAdmin();
    } catch (error) {
      setSaveError(error.message);
    }
  };

  const handleSave = async () => {
    setStatus('');
    setSaveError('');
    setIsSaving(true);

    try {
      await saveSiteContent(draftContent);
      setStatus('Saved. The public site will update from Firestore.');
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderHomeEditor = () => (
    <div className="space-y-8">
      <AdminEditorSection
        title="Hero"
        description="Click directly into the hero copy and action labels. Link targets are editable underneath."
      >
        <div className="rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.hero.eyebrow}
            onChange={(value) => setField(['hero', 'eyebrow'], value)}
            size="label"
            className="text-sf-muted/80"
          />
          <AdminEditableField
            value={draftContent.hero.title}
            onChange={(value) => setField(['hero', 'title'], value)}
            size="hero"
            className="mt-4"
          />
          <AdminEditableField
            value={draftContent.hero.description}
            onChange={(value) => setField(['hero', 'description'], value)}
            multiline
            className="mt-4 text-sf-muted"
          />
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="min-w-[16rem] rounded-2xl bg-sf-orange-1 px-5 py-4 text-sf-bg">
              <AdminEditableField
                value={draftContent.hero.primaryCtaLabel}
                onChange={(value) =>
                  setField(['hero', 'primaryCtaLabel'], value)
                }
                className="px-0 py-0 font-semibold text-sf-bg"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Primary button link"
                  value={draftContent.hero.primaryCtaLink}
                  onChange={(value) =>
                    setField(['hero', 'primaryCtaLink'], value)
                  }
                />
              </div>
            </div>
            <div className="min-w-[16rem] rounded-2xl border border-sf-border px-5 py-4">
              <AdminEditableField
                value={draftContent.hero.secondaryCtaLabel}
                onChange={(value) =>
                  setField(['hero', 'secondaryCtaLabel'], value)
                }
                className="px-0 py-0 font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Secondary button link"
                  value={draftContent.hero.secondaryCtaLink}
                  onChange={(value) =>
                    setField(['hero', 'secondaryCtaLink'], value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {draftContent.hero.stats.map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface/70 p-4"
              >
                <AdminEditableField
                  value={stat.label}
                  onChange={(value) =>
                    setField(['hero', 'stats', index, 'label'], value)
                  }
                  multiline
                  className="text-sm text-sf-muted"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <select
                    value={stat.accent}
                    onChange={(event) =>
                      setField(
                        ['hero', 'stats', index, 'accent'],
                        event.target.value,
                      )
                    }
                    className="rounded-xl border border-sf-border bg-black/20 px-3 py-2 text-sm text-sf-text outline-none focus:border-sf-orange-1"
                  >
                    <option value="orange">Orange accent</option>
                    <option value="light">Light accent</option>
                  </select>
                  <ActionButton
                    onClick={() => removeItem(['hero', 'stats'], index)}
                  >
                    Remove stat
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ActionButton
              onClick={() =>
                addItem(['hero', 'stats'], {
                  label: 'New stat',
                  accent: 'orange',
                })
              }
            >
              Add stat
            </ActionButton>
          </div>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.home.about.title}
        description={draftContent.home.about.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.home.about.title}
            onChange={(value) => setField(['home', 'about', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.home.about.description}
            onChange={(value) =>
              setField(['home', 'about', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          {draftContent.home.about.paragraphs.map((paragraph, index) => (
            <div
              key={`about-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface/70 p-4"
            >
              <AdminEditableField
                value={paragraph}
                onChange={(value) =>
                  setField(['home', 'about', 'paragraphs', index], value)
                }
                multiline
                className="text-sf-muted"
              />
              <div className="mt-3">
                <ActionButton
                  onClick={() => removeItem(['home', 'about', 'paragraphs'], index)}
                >
                  Remove paragraph
                </ActionButton>
              </div>
            </div>
          ))}
          <ActionButton
            onClick={() =>
              addItem(['home', 'about', 'paragraphs'], 'New paragraph')
            }
          >
            Add paragraph
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.home.highlights.title}
        description={draftContent.home.highlights.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.home.highlights.title}
            onChange={(value) =>
              setField(['home', 'highlights', 'title'], value)
            }
            size="title"
          />
          <AdminEditableField
            value={draftContent.home.highlights.description}
            onChange={(value) =>
              setField(['home', 'highlights', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {draftContent.home.highlights.items.map((item, index) => (
              <div
                key={`${item.event}-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-5"
              >
                <AdminEditableField
                  value={item.date}
                  onChange={(value) =>
                    setField(['home', 'highlights', 'items', index, 'date'], value)
                  }
                  size="label"
                  className="text-sf-orange-1"
                />
                <AdminEditableField
                  value={item.event}
                  onChange={(value) =>
                    setField(['home', 'highlights', 'items', index, 'event'], value)
                  }
                  className="mt-2 text-xl font-semibold"
                />
                <AdminEditableField
                  value={item.summary}
                  onChange={(value) =>
                    setField(
                      ['home', 'highlights', 'items', index, 'summary'],
                      value,
                    )
                  }
                  multiline
                  className="mt-3 text-sf-muted"
                />
                <div className="mt-3">
                  <ActionButton
                    onClick={() =>
                      removeItem(['home', 'highlights', 'items'], index)
                    }
                  >
                    Remove highlight
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton
            onClick={() =>
              addItem(['home', 'highlights', 'items'], createAchievement())
            }
          >
            Add highlight
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.home.sponsors.title}
        description={draftContent.home.sponsors.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.home.sponsors.title}
            onChange={(value) => setField(['home', 'sponsors', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.home.sponsors.description}
            onChange={(value) =>
              setField(['home', 'sponsors', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.home.sponsors.ctaDescription}
            onChange={(value) =>
              setField(['home', 'sponsors', 'ctaDescription'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sf-border bg-sf-surface p-4">
              <AdminEditableField
                value={draftContent.home.sponsors.ctaLabel}
                onChange={(value) =>
                  setField(['home', 'sponsors', 'ctaLabel'], value)
                }
                className="font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Call-to-action link"
                  value={draftContent.home.sponsors.ctaLink}
                  onChange={(value) =>
                    setField(['home', 'sponsors', 'ctaLink'], value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {draftContent.sponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-4"
              >
                <AdminEditableField
                  value={sponsor.name}
                  onChange={(value) =>
                    setField(['sponsors', index, 'name'], value)
                  }
                  className="font-semibold"
                />
                <AdminEditableField
                  value={sponsor.contribution}
                  onChange={(value) =>
                    setField(['sponsors', index, 'contribution'], value)
                  }
                  className="mt-2 text-sf-muted"
                />
                <div className="mt-3 space-y-3">
                  <AdminEditableUrlField
                    label="Sponsor website"
                    value={sponsor.website || ''}
                    onChange={(value) =>
                      setField(['sponsors', index, 'website'], value)
                    }
                  />
                  <AdminEditableUrlField
                    label="Logo image URL"
                    value={sponsor.logo}
                    onChange={(value) =>
                      setField(['sponsors', index, 'logo'], value)
                    }
                  />
                </div>
                <div className="mt-4 overflow-hidden rounded-xl border border-sf-border bg-black/20 p-4">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-14 w-full object-contain"
                  />
                </div>
                <div className="mt-4">
                  <ActionButton onClick={() => removeItem(['sponsors'], index)}>
                    Remove sponsor
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addItem(['sponsors'], createSponsor())}>
            Add sponsor
          </ActionButton>
        </div>
      </AdminEditorSection>
    </div>
  );

  const renderTeamEditor = () => (
    <div className="space-y-8">
      <AdminEditorSection
        title={draftContent.team.intro.title}
        description={draftContent.team.intro.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.team.intro.title}
            onChange={(value) => setField(['team', 'intro', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.team.intro.description}
            onChange={(value) =>
              setField(['team', 'intro', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          {draftContent.team.intro.paragraphs.map((paragraph, index) => (
            <div
              key={`team-paragraph-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface/70 p-4"
            >
              <AdminEditableField
                value={paragraph}
                onChange={(value) =>
                  setField(['team', 'intro', 'paragraphs', index], value)
                }
                multiline
                className="text-sf-muted"
              />
              <div className="mt-3">
                <ActionButton
                  onClick={() => removeItem(['team', 'intro', 'paragraphs'], index)}
                >
                  Remove paragraph
                </ActionButton>
              </div>
            </div>
          ))}
          <ActionButton
            onClick={() =>
              addItem(['team', 'intro', 'paragraphs'], 'New paragraph')
            }
          >
            Add paragraph
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.team.roster.title}
        description="Click into each team card to update names, roles, bios, and image URLs."
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.team.roster.title}
            onChange={(value) => setField(['team', 'roster', 'title'], value)}
            size="title"
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {draftContent.team.roster.members.map((member, index) => (
              <div
                key={`${member.name}-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-4"
              >
                <div className="overflow-hidden rounded-xl border border-sf-border bg-black/20 p-3">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <AdminEditableField
                    value={member.name}
                    onChange={(value) =>
                      setField(['team', 'roster', 'members', index, 'name'], value)
                    }
                    className="font-semibold"
                  />
                  <AdminEditableField
                    value={member.role}
                    onChange={(value) =>
                      setField(['team', 'roster', 'members', index, 'role'], value)
                    }
                    size="label"
                    className="text-sf-orange-1"
                  />
                  <AdminEditableField
                    value={member.bio}
                    onChange={(value) =>
                      setField(['team', 'roster', 'members', index, 'bio'], value)
                    }
                    multiline
                    className="text-sf-muted"
                  />
                  <AdminEditableUrlField
                    label="Photo URL"
                    value={member.photo}
                    onChange={(value) =>
                      setField(['team', 'roster', 'members', index, 'photo'], value)
                    }
                  />
                </div>
                <div className="mt-4">
                  <ActionButton
                    onClick={() => removeItem(['team', 'roster', 'members'], index)}
                  >
                    Remove member
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton
            onClick={() => addItem(['team', 'roster', 'members'], createTeamMember())}
          >
            Add team member
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.team.connect.title}
        description="Edit the follow strip and the contact links that appear on the team page."
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.team.connect.title}
            onChange={(value) => setField(['team', 'connect', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.team.connect.label}
            onChange={(value) => setField(['team', 'connect', 'label'], value)}
            size="label"
            className="text-sf-orange-1"
          />
          {draftContent.team.connect.links.map((link, index) => (
            <div
              key={`${link.label}-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface p-4"
            >
              <AdminEditableField
                value={link.label}
                onChange={(value) =>
                  setField(['team', 'connect', 'links', index, 'label'], value)
                }
                className="font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Link target"
                  value={link.href}
                  onChange={(value) =>
                    setField(['team', 'connect', 'links', index, 'href'], value)
                  }
                />
              </div>
              <div className="mt-4">
                <ActionButton
                  onClick={() => removeItem(['team', 'connect', 'links'], index)}
                >
                  Remove link
                </ActionButton>
              </div>
            </div>
          ))}
          <ActionButton
            onClick={() => addItem(['team', 'connect', 'links'], createLink())}
          >
            Add link
          </ActionButton>
        </div>
      </AdminEditorSection>
    </div>
  );

  const renderSponsorshipsEditor = () => (
    <div className="space-y-8">
      <AdminEditorSection
        title={draftContent.sponsorships.intro.title}
        description={draftContent.sponsorships.intro.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.sponsorships.intro.title}
            onChange={(value) =>
              setField(['sponsorships', 'intro', 'title'], value)
            }
            size="title"
          />
          <AdminEditableField
            value={draftContent.sponsorships.intro.description}
            onChange={(value) =>
              setField(['sponsorships', 'intro', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          {draftContent.sponsorships.intro.paragraphs.map((paragraph, index) => (
            <div
              key={`sponsorship-intro-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface p-4"
            >
              <AdminEditableField
                value={paragraph}
                onChange={(value) =>
                  setField(['sponsorships', 'intro', 'paragraphs', index], value)
                }
                multiline
                className="text-sf-muted"
              />
              <div className="mt-3">
                <ActionButton
                  onClick={() =>
                    removeItem(['sponsorships', 'intro', 'paragraphs'], index)
                  }
                >
                  Remove paragraph
                </ActionButton>
              </div>
            </div>
          ))}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-sf-border bg-sf-surface p-4">
              <AdminEditableField
                value={draftContent.sponsorships.intro.primaryCtaLabel}
                onChange={(value) =>
                  setField(['sponsorships', 'intro', 'primaryCtaLabel'], value)
                }
                className="font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Primary CTA link"
                  value={draftContent.sponsorships.intro.primaryCtaLink}
                  onChange={(value) =>
                    setField(['sponsorships', 'intro', 'primaryCtaLink'], value)
                  }
                />
              </div>
            </div>
            <div className="rounded-2xl border border-sf-border bg-sf-surface p-4">
              <AdminEditableField
                value={draftContent.sponsorships.intro.secondaryCtaLabel}
                onChange={(value) =>
                  setField(['sponsorships', 'intro', 'secondaryCtaLabel'], value)
                }
                className="font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Secondary CTA link"
                  value={draftContent.sponsorships.intro.secondaryCtaLink}
                  onChange={(value) =>
                    setField(
                      ['sponsorships', 'intro', 'secondaryCtaLink'],
                      value,
                    )
                  }
                />
              </div>
            </div>
          </div>
          <ActionButton
            onClick={() =>
              addItem(['sponsorships', 'intro', 'paragraphs'], 'New paragraph')
            }
          >
            Add paragraph
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.sponsorships.tiers.title}
        description="Edit tier cards directly and add or remove benefits as needed."
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.sponsorships.tiers.title}
            onChange={(value) =>
              setField(['sponsorships', 'tiers', 'title'], value)
            }
            size="title"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {draftContent.sponsorships.tiers.items.map((tier, tierIndex) => (
              <div
                key={`${tier.title}-${tierIndex}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-5"
              >
                <AdminEditableField
                  value={tier.amount}
                  onChange={(value) =>
                    setField(
                      ['sponsorships', 'tiers', 'items', tierIndex, 'amount'],
                      value,
                    )
                  }
                  size="label"
                  className="text-sf-orange-1"
                />
                <AdminEditableField
                  value={tier.title}
                  onChange={(value) =>
                    setField(
                      ['sponsorships', 'tiers', 'items', tierIndex, 'title'],
                      value,
                    )
                  }
                  className="mt-2 text-xl font-semibold"
                />
                <div className="mt-4 space-y-3">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <div
                      key={`${benefit}-${benefitIndex}`}
                      className="rounded-xl border border-sf-border bg-black/10 p-3"
                    >
                      <AdminEditableField
                        value={benefit}
                        onChange={(value) =>
                          setField(
                            [
                              'sponsorships',
                              'tiers',
                              'items',
                              tierIndex,
                              'benefits',
                              benefitIndex,
                            ],
                            value,
                          )
                        }
                        multiline
                        className="text-sm text-sf-muted"
                      />
                      <div className="mt-3">
                        <ActionButton
                          onClick={() =>
                            removeItem(
                              [
                                'sponsorships',
                                'tiers',
                                'items',
                                tierIndex,
                                'benefits',
                              ],
                              benefitIndex,
                            )
                          }
                        >
                          Remove benefit
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ActionButton
                    onClick={() =>
                      addItem(
                        ['sponsorships', 'tiers', 'items', tierIndex, 'benefits'],
                        'New benefit',
                      )
                    }
                  >
                    Add benefit
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      removeItem(['sponsorships', 'tiers', 'items'], tierIndex)
                    }
                  >
                    Remove tier
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton
            onClick={() =>
              addItem(['sponsorships', 'tiers', 'items'], createTier())
            }
          >
            Add tier
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.sponsorships.currentSponsors.title}
        description={draftContent.sponsorships.currentSponsors.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.sponsorships.currentSponsors.title}
            onChange={(value) =>
              setField(['sponsorships', 'currentSponsors', 'title'], value)
            }
            size="title"
          />
          <AdminEditableField
            value={draftContent.sponsorships.currentSponsors.description}
            onChange={(value) =>
              setField(['sponsorships', 'currentSponsors', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
        </div>
      </AdminEditorSection>
    </div>
  );

  const renderFooterEditor = () => (
    <AdminEditorSection
      title="Footer and branding"
      description="These fields affect the shared header and footer across the site."
    >
      <div className="grid gap-6 rounded-[2rem] border border-sf-border bg-sf-bg p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <AdminEditableField
            value={draftContent.branding.siteName}
            onChange={(value) => setField(['branding', 'siteName'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.branding.logoAlt}
            onChange={(value) => setField(['branding', 'logoAlt'], value)}
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.footer.description}
            onChange={(value) => setField(['footer', 'description'], value)}
            multiline
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.footer.sponsorNote}
            onChange={(value) => setField(['footer', 'sponsorNote'], value)}
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.footer.email}
            onChange={(value) => setField(['footer', 'email'], value)}
          />
        </div>
        <div className="space-y-4">
          <AdminEditableField
            value={draftContent.footer.contactTitle}
            onChange={(value) => setField(['footer', 'contactTitle'], value)}
            className="font-semibold"
          />
          <AdminEditableField
            value={draftContent.footer.quickLinksTitle}
            onChange={(value) => setField(['footer', 'quickLinksTitle'], value)}
            className="font-semibold"
          />
          <AdminEditableField
            value={draftContent.footer.copyrightPrefix}
            onChange={(value) =>
              setField(['footer', 'copyrightPrefix'], value)
            }
            multiline
            className="text-sf-muted"
          />
          {draftContent.footer.socials.map((social, index) => (
            <div
              key={`${social.label}-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface p-4"
            >
              <AdminEditableField
                value={social.label}
                onChange={(value) =>
                  setField(['footer', 'socials', index, 'label'], value)
                }
                className="font-semibold"
              />
              <div className="mt-3">
                <AdminEditableUrlField
                  label="Social URL"
                  value={social.href}
                  onChange={(value) =>
                    setField(['footer', 'socials', index, 'href'], value)
                  }
                />
              </div>
              <div className="mt-4">
                <ActionButton
                  onClick={() => removeItem(['footer', 'socials'], index)}
                >
                  Remove social
                </ActionButton>
              </div>
            </div>
          ))}
          <ActionButton
            onClick={() => addItem(['footer', 'socials'], createLink('Social'))}
          >
            Add social
          </ActionButton>
        </div>
      </div>
    </AdminEditorSection>
  );

  const renderActiveEditor = () => {
    if (activePage === 'team') {
      return renderTeamEditor();
    }

    if (activePage === 'sponsorships') {
      return renderSponsorshipsEditor();
    }

    if (activePage === 'footer') {
      return renderFooterEditor();
    }

    return renderHomeEditor();
  };

  return (
    <div className="container max-w-7xl py-12">
      <section className="rounded-[2rem] border border-sf-border bg-sf-surface p-6 shadow-[0_28px_48px_-30px_rgba(0,0,0,0.65)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32rem] text-sf-orange-1/85">
              Admin mode
            </p>
            <h1 className="mt-4 text-3xl font-bold text-sf-text sm:text-4xl">
              Edit the live website directly
            </h1>
            <p className="mt-4 text-base text-sf-muted sm:text-lg">
              Click into the content blocks below, change copy, links, cards,
              and images, then save the live Firestore document without editing
              source code.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton onClick={() => setDraftContent(cloneValue(siteContent))}>
              Reset to live
            </ActionButton>
            <ActionButton
              onClick={() => setDraftContent(cloneValue(defaultSiteContent))}
            >
              Load defaults
            </ActionButton>
            <ActionButton onClick={handleSave} tone="primary">
              {isSaving ? 'Saving...' : 'Save live content'}
            </ActionButton>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-sf-border bg-black/10 p-5 text-sm text-sf-muted">
            <div className="space-y-3">
              <p>
                Firebase config:{' '}
                <span className="font-semibold text-sf-text">
                  {isFirebaseConfigured ? 'connected' : 'missing'}
                </span>
              </p>
              <p>
                Authorized accounts:{' '}
                <span className="font-semibold text-sf-text">
                  {authorizedEmails.length
                    ? authorizedEmails.join(', ')
                    : 'none configured'}
                </span>
              </p>
              {authChecked && user ? (
                <p>
                  Signed in as{' '}
                  <span className="font-semibold text-sf-text">{user.email}</span>
                </p>
              ) : null}
              <p>
                Firestore document:{' '}
                <code className="rounded bg-black/20 px-2 py-1 text-xs text-sf-text">
                  siteContent/current
                </code>
              </p>
            </div>

            {loadError ? (
              <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
                Live content fallback active: {loadError}
              </p>
            ) : null}

            {!isFirebaseConfigured ? (
              <p className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-100">
                Add the Firebase env vars before admin mode can sign in or save.
                {missingFirebaseEnvKeys.length ? (
                  <>
                    {' '}Missing:{' '}
                    {missingFirebaseEnvKeys.join(', ')}
                  </>
                ) : null}
              </p>
            ) : null}

            {status ? (
              <p className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-100">
                {status}
              </p>
            ) : null}

            {saveError ? (
              <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
                {saveError}
              </p>
            ) : null}
          </div>

          <div className="rounded-3xl border border-sf-border bg-black/10 p-5">
            {!isFirebaseConfigured ? null : !authChecked ? (
              <p className="text-sm text-sf-muted">Checking session...</p>
            ) : !user ? (
              <ActionButton onClick={handleSignIn} tone="primary">
                {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
              </ActionButton>
            ) : !isAuthorized ? (
              <div className="space-y-4">
                <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  This Google account is authenticated but not on the authorized
                  admin list.
                </p>
                <ActionButton onClick={handleSignOut}>Sign out</ActionButton>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                  Authorized and ready to edit
                </span>
                <ActionButton onClick={handleSignOut}>Sign out</ActionButton>
                <Link
                  to="/"
                  className="rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
                >
                  View public homepage
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {isFirebaseConfigured && user && isAuthorized ? (
        <>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ['home', 'Homepage'],
              ['team', 'Team page'],
              ['sponsorships', 'Sponsorships'],
              ['footer', 'Footer'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActivePage(value)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activePage === value
                    ? 'bg-sf-orange-1 text-sf-bg'
                    : 'border border-sf-border text-sf-text hover:border-sf-orange-1 hover:text-sf-orange-1'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <MotionDiv
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {renderActiveEditor()}
          </MotionDiv>
        </>
      ) : null}
    </div>
  );
};

export default Admin;
