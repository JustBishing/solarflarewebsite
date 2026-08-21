import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminEditableField from '../components/admin/AdminEditableField.jsx';
import AdminImageField from '../components/admin/AdminImageField.jsx';
import AdminEditableUrlField from '../components/admin/AdminEditableUrlField.jsx';
import AdminEditorSection from '../components/admin/AdminEditorSection.jsx';
import { useSiteContent } from '../context/useSiteContent.js';
import { defaultSiteContent } from '../lib/siteContent.js';
import { isFirebaseConfigured } from '../lib/firebase.js';
import {
  auth,
  onAuthStateChanged,
  saveSiteContent,
  signInWithGoogle,
  signOutAdmin,
  subscribeSiteContent,
} from '../lib/firebaseAuth.js';

const MotionDiv = motion.div;

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

const createRecordStat = () => ({
  value: '#1',
  label: 'New result',
  caption: '',
  accent: false,
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

const ActionButton = ({ children, onClick, tone = 'secondary', disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sf-border disabled:hover:text-sf-text ${
      tone === 'primary'
        ? 'rounded-xl bg-sf-orange-1 px-4 py-2 text-sm font-semibold text-sf-bg transition hover:bg-sf-orange-2'
        : 'rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1'
    }`}
  >
    {children}
  </button>
);

/**
 * Build-time SHA-256 hashes of the admin allowlist (see vite.config.js), so the
 * addresses themselves never ship to the client. This gates the admin *UI*
 * only — the Firestore security rules are what actually authorize a write.
 *
 * The old check also honoured bare "@domain" entries, which handed the editor
 * to every Google account on the domain. Exact addresses only now.
 */
const ADMIN_EMAIL_HASHES = __ADMIN_EMAIL_HASHES__;

const sha256Hex = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

const SAVE_SCOPES = {
  home: {
    label: 'Save homepage',
    pick: (c) => ({ hero: c.hero, home: c.home, sponsors: c.sponsors }),
  },
  team: { label: 'Save team page', pick: (c) => ({ team: c.team }) },
  pastSeasons: { label: 'Save past seasons', pick: (c) => ({ pastSeasons: c.pastSeasons }) },
  sponsorships: { label: 'Save sponsorships', pick: (c) => ({ sponsorships: c.sponsorships }) },
  footer: {
    label: 'Save footer',
    // No theme here: the palette is locked in code, so Admin must not write
    // a colours blob it cannot edit.
    pick: (c) => ({ branding: c.branding, footer: c.footer }),
  },
};

const Admin = () => {
  const { loadError, siteContent } = useSiteContent();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [draftContent, setDraftContent] = useState(cloneValue(defaultSiteContent));
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const [canEdit, setCanEdit] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [hasRemoteUpdate, setHasRemoteUpdate] = useState(false);
  const scope = SAVE_SCOPES[activePage] || SAVE_SCOPES.home;

  // Top-level sections with unsaved edits. A ref, not state: the snapshot
  // effect below has to read the current value without re-subscribing.
  const touchedRef = useRef(new Set());

  /**
   * Latest content as it exists in Firestore.
   *
   * Public pages read the document once over REST and never subscribe, which
   * is why they no longer ship the SDK. The editor is the one place that does
   * need a live view — it is how it notices someone else saving mid-edit — so
   * it keeps its own subscription here.
   */
  const [remoteContent, setRemoteContent] = useState(siteContent);

  useEffect(() => { setRemoteContent(siteContent); }, [siteContent]);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;
    return subscribeSiteContent(setRemoteContent, (err) => setError(err.message));
  }, []);

  const markTouched = (path) => {
    touchedRef.current.add(path[0]);
    setIsDirty(true);
    setStatus('');
    setError('');
  };

  const discardDraft = () => {
    touchedRef.current = new Set();
    setIsDirty(false);
    setHasRemoteUpdate(false);
    setDraftContent(cloneValue(remoteContent));
    setStatus('');
    setError('');
  };

  /**
   * Firestore pushes a snapshot on every write, including other editors'.
   * This used to replace the whole draft, so two people editing at once
   * silently overwrote each other and there was no sign it had happened.
   *
   * Sections with unsaved edits are now kept; everything else refreshes, so
   * an unrelated save on another page still lands.
   */
  useEffect(() => {
    const touched = touchedRef.current;

    if (touched.size === 0) {
      setDraftContent(cloneValue(remoteContent));
      return;
    }

    setHasRemoteUpdate(true);
    setDraftContent((draft) => {
      const next = cloneValue(remoteContent);
      touched.forEach((key) => { next[key] = draft[key]; });
      return next;
    });
  }, [remoteContent]);

  // Closing the tab mid-edit should cost a confirmation, not the work.
  useEffect(() => {
    if (!isDirty) return undefined;

    const warn = (event) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthReady(true);
      return undefined;
    }
    return onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true); });
  }, []);

  // Hash comparison is async (Web Crypto), so authorization lands a tick after
  // the user does. Default closed until it resolves.
  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();

    if (!email || ADMIN_EMAIL_HASHES.length === 0) {
      setCanEdit(false);
      return undefined;
    }

    let active = true;
    sha256Hex(email).then((hash) => {
      if (active) setCanEdit(ADMIN_EMAIL_HASHES.includes(hash));
    });

    return () => { active = false; };
  }, [user]);

  const setField = (path, value) => {
    setDraftContent((c) => updateIn(c, path, value));
    markTouched(path);
  };

  const addItem = (path, item) => {
    setDraftContent((c) => insertInto(c, path, item));
    markTouched(path);
  };

  const removeItem = (path, index) => {
    setDraftContent((c) => removeFrom(c, path, index));
    markTouched(path);
  };

  // Season results are sized by their position: first is the headline figure,
  // the next two sit beside it, the rest drop to a footnote row. Reordering is
  // therefore an editorial control, not a convenience.
  const moveItem = (path, index, offset) => {
    setDraftContent((c) => {
      const list = path.reduce((value, key) => value?.[key], c);
      const target = index + offset;
      if (!Array.isArray(list) || target < 0 || target >= list.length) {
        return c;
      }
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return updateIn(c, path, next);
    });
    markTouched(path);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');
    setError('');
    try {
      const saved = scope.pick(draftContent);
      await saveSiteContent(saved);
      // Only the sections this scope actually wrote are clean again; edits
      // parked on another page stay protected from the incoming snapshot.
      Object.keys(saved).forEach((key) => touchedRef.current.delete(key));
      setIsDirty(touchedRef.current.size > 0);
      setHasRemoteUpdate(false);
      setStatus('Saved! The live site will update automatically.');
    } catch (err) {
      setError(err?.message || 'Save failed.');
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
                key={`hero-stat-${index}`}
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

      {/* Photography. Both blocks degrade to nothing if an image path is
          blanked, so an editor can remove a photo without leaving a broken
          frame on the homepage. */}
      <AdminEditorSection
        title="Homepage photo band"
        description="The full-width competition photo under the marquee."
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminImageField
            label="Image path"
            size="large"
            value={draftContent.home.showcase.image}
            onChange={(value) => setField(['home', 'showcase', 'image'], value)}
          />
          <AdminEditableField
            value={draftContent.home.showcase.imageAlt}
            onChange={(value) => setField(['home', 'showcase', 'imageAlt'], value)}
            multiline
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.home.showcase.caption}
            onChange={(value) => setField(['home', 'showcase', 'caption'], value)}
            multiline
            className="text-sf-muted"
          />
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.home.robot.title}
        description={draftContent.home.robot.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.home.robot.eyebrow}
            onChange={(value) => setField(['home', 'robot', 'eyebrow'], value)}
            className="label-mono text-sf-orange-2"
          />
          <AdminEditableField
            value={draftContent.home.robot.title}
            onChange={(value) => setField(['home', 'robot', 'title'], value)}
            className="text-2xl font-semibold"
          />
          <AdminEditableField
            value={draftContent.home.robot.titleAccent}
            onChange={(value) => setField(['home', 'robot', 'titleAccent'], value)}
            className="text-2xl font-semibold text-sf-orange-2"
          />
          <AdminEditableField
            value={draftContent.home.robot.description}
            onChange={(value) => setField(['home', 'robot', 'description'], value)}
            multiline
            className="text-sf-muted"
          />
          <AdminImageField
            label="Robot photo"
            size="large"
            value={draftContent.home.robot.image}
            onChange={(value) => setField(['home', 'robot', 'image'], value)}
          />
          <AdminEditableField
            value={draftContent.home.robot.imageAlt}
            onChange={(value) => setField(['home', 'robot', 'imageAlt'], value)}
            multiline
            className="text-sf-muted"
          />
          <AdminEditableField
            value={draftContent.home.robot.caption}
            onChange={(value) => setField(['home', 'robot', 'caption'], value)}
            multiline
            className="text-sf-muted"
          />
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.home.record.title}
        description={draftContent.home.record.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.home.record.eyebrow}
            onChange={(value) => setField(['home', 'record', 'eyebrow'], value)}
            size="label"
            className="text-sf-orange-1"
          />
          <AdminEditableField
            value={draftContent.home.record.title}
            onChange={(value) => setField(['home', 'record', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.home.record.titleAccent}
            onChange={(value) =>
              setField(['home', 'record', 'titleAccent'], value)
            }
            size="title"
            className="text-sf-orange-2"
          />
          <AdminEditableField
            value={draftContent.home.record.description}
            onChange={(value) =>
              setField(['home', 'record', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <p className="label-mono text-white/60">
            Order sets the size — 1st is the headline figure, 2nd and 3rd sit
            beside it, the rest drop to a footnote row.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {draftContent.home.record.stats.map((stat, index) => (
              <div
                key={`record-stat-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-5"
              >
                <AdminEditableField
                  value={stat.value}
                  onChange={(value) =>
                    setField(['home', 'record', 'stats', index, 'value'], value)
                  }
                  className="text-3xl font-bold"
                />
                <AdminEditableField
                  value={stat.label}
                  onChange={(value) =>
                    setField(['home', 'record', 'stats', index, 'label'], value)
                  }
                  className="mt-2 text-base"
                />
                <AdminEditableField
                  value={stat.caption}
                  onChange={(value) =>
                    setField(
                      ['home', 'record', 'stats', index, 'caption'],
                      value,
                    )
                  }
                  size="label"
                  className="mt-2 text-sf-muted"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() =>
                      setField(
                        ['home', 'record', 'stats', index, 'accent'],
                        !stat.accent,
                      )
                    }
                  >
                    {stat.accent ? 'Highlighted in ember' : 'Highlight in ember'}
                  </ActionButton>
                  <ActionButton
                    disabled={index === 0}
                    onClick={() => moveItem(['home', 'record', 'stats'], index, -1)}
                  >
                    Move up
                  </ActionButton>
                  <ActionButton
                    disabled={
                      index === draftContent.home.record.stats.length - 1
                    }
                    onClick={() => moveItem(['home', 'record', 'stats'], index, 1)}
                  >
                    Move down
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      removeItem(['home', 'record', 'stats'], index)
                    }
                  >
                    Remove result
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton
            onClick={() =>
              addItem(['home', 'record', 'stats'], createRecordStat())
            }
          >
            Add result
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
                key={`highlight-${index}`}
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
                key={`sponsor-${index}`}
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
                  <AdminImageField
                    label="Logo image"
                    size="large"
                    value={sponsor.logo}
                    onChange={(value) =>
                      setField(['sponsors', index, 'logo'], value)
                    }
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
                key={`member-${index}`}
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
                  <AdminImageField
                    label="Photo image"
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
              key={`team-link-${index}`}
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

      <AdminEditorSection
        title={draftContent.team.apply.title}
        description="Control the recruitment call-to-action and the Google Form link."
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.team.apply.title}
            onChange={(value) => setField(['team', 'apply', 'title'], value)}
            size="title"
          />
          <AdminEditableField
            value={draftContent.team.apply.description}
            onChange={(value) =>
              setField(['team', 'apply', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <div className="rounded-2xl border border-sf-border bg-sf-surface p-4">
            <AdminEditableField
              value={draftContent.team.apply.buttonLabel}
              onChange={(value) =>
                setField(['team', 'apply', 'buttonLabel'], value)
              }
              className="font-semibold"
            />
            <div className="mt-3">
              <AdminEditableUrlField
                label="Application form link"
                value={draftContent.team.apply.buttonLink}
                onChange={(value) =>
                  setField(['team', 'apply', 'buttonLink'], value)
                }
              />
            </div>
          </div>
        </div>
      </AdminEditorSection>
    </div>
  );

  const renderPastSeasonsEditor = () => (
    <div className="space-y-8">
      <AdminEditorSection
        title={draftContent.pastSeasons.intro.title}
        description={draftContent.pastSeasons.intro.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.pastSeasons.intro.title}
            onChange={(value) =>
              setField(['pastSeasons', 'intro', 'title'], value)
            }
            size="title"
          />
          <AdminEditableField
            value={draftContent.pastSeasons.intro.description}
            onChange={(value) =>
              setField(['pastSeasons', 'intro', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          {draftContent.pastSeasons.intro.paragraphs.map((paragraph, index) => (
            <div
              key={`past-season-intro-${index}`}
              className="rounded-2xl border border-sf-border bg-sf-surface p-4"
            >
              <AdminEditableField
                value={paragraph}
                onChange={(value) =>
                  setField(['pastSeasons', 'intro', 'paragraphs', index], value)
                }
                multiline
                className="text-sf-muted"
              />
              <div className="mt-3">
                <ActionButton
                  onClick={() =>
                    removeItem(['pastSeasons', 'intro', 'paragraphs'], index)
                  }
                >
                  Remove paragraph
                </ActionButton>
              </div>
            </div>
          ))}
          <ActionButton
            onClick={() =>
              addItem(['pastSeasons', 'intro', 'paragraphs'], 'New paragraph')
            }
          >
            Add paragraph
          </ActionButton>
        </div>
      </AdminEditorSection>

      <AdminEditorSection
        title={draftContent.pastSeasons.archive.title}
        description={draftContent.pastSeasons.archive.description}
      >
        <div className="space-y-4 rounded-[2rem] border border-sf-border bg-sf-bg p-8">
          <AdminEditableField
            value={draftContent.pastSeasons.archive.title}
            onChange={(value) =>
              setField(['pastSeasons', 'archive', 'title'], value)
            }
            size="title"
          />
          <AdminEditableField
            value={draftContent.pastSeasons.archive.description}
            onChange={(value) =>
              setField(['pastSeasons', 'archive', 'description'], value)
            }
            multiline
            className="text-sf-muted"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {draftContent.pastSeasons.archive.seasons.map((season, index) => (
              <div
                key={`season-${index}`}
                className="rounded-2xl border border-sf-border bg-sf-surface p-5"
              >
                <AdminEditableField
                  value={season.year}
                  onChange={(value) =>
                    setField(['pastSeasons', 'archive', 'seasons', index, 'year'], value)
                  }
                  size="label"
                  className="text-sf-orange-1"
                />
                <AdminEditableField
                  value={season.title}
                  onChange={(value) =>
                    setField(['pastSeasons', 'archive', 'seasons', index, 'title'], value)
                  }
                  className="mt-2 text-xl font-semibold"
                />
                <AdminEditableField
                  value={season.summary}
                  onChange={(value) =>
                    setField(
                      ['pastSeasons', 'archive', 'seasons', index, 'summary'],
                      value,
                    )
                  }
                  multiline
                  className="mt-3 text-sf-muted"
                />
                <div className="mt-4 space-y-3">
                  {season.highlights.map((highlight, highlightIndex) => (
                    <div
                      key={`season-${index}-highlight-${highlightIndex}`}
                      className="rounded-xl border border-sf-border bg-black/10 p-3"
                    >
                      <AdminEditableField
                        value={highlight}
                        onChange={(value) =>
                          setField(
                            [
                              'pastSeasons',
                              'archive',
                              'seasons',
                              index,
                              'highlights',
                              highlightIndex,
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
                              ['pastSeasons', 'archive', 'seasons', index, 'highlights'],
                              highlightIndex,
                            )
                          }
                        >
                          Remove highlight
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ActionButton
                    onClick={() =>
                      addItem(
                        ['pastSeasons', 'archive', 'seasons', index, 'highlights'],
                        'New highlight',
                      )
                    }
                  >
                    Add highlight
                  </ActionButton>
                  <ActionButton
                    onClick={() =>
                      removeItem(['pastSeasons', 'archive', 'seasons'], index)
                    }
                  >
                    Remove season
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <ActionButton
            onClick={() =>
              addItem(['pastSeasons', 'archive', 'seasons'], {
                year: 'New season',
                title: 'Season title',
                summary: 'Season summary',
                highlights: ['New highlight'],
              })
            }
          >
            Add season
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
                key={`tier-${tierIndex}`}
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
                      key={`tier-${tierIndex}-benefit-${benefitIndex}`}
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

  /* The theme colour editor used to sit here. The brand palette is locked in
     src/lib/theme.js, which ignores whatever Firestore holds, so the pickers
     silently discarded every change — and rendered a blue swatch under the
     label "Accent orange" from stale stored values. Palette changes belong in
     theme.js and index.css. */
  const renderFooterEditor = () => (
    <div className="space-y-8">
      <AdminEditorSection
        title="Footer and branding"
        description="These fields affect the shared header and footer across the site."
      >
        <div className="grid gap-6 rounded-[2rem] border border-sf-border bg-sf-bg p-8 lg:grid-cols-2">
        <div className="space-y-4">
          <AdminImageField
            label="Site logo"
            value={draftContent.branding.logoSrc}
            onChange={(value) => setField(['branding', 'logoSrc'], value)}
          />
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
            value={draftContent.branding.teamNumber}
            onChange={(value) => setField(['branding', 'teamNumber'], value)}
            size="label"
            className="text-sf-orange-1"
          />
          <AdminEditableField
            value={draftContent.branding.season}
            onChange={(value) => setField(['branding', 'season'], value)}
            size="label"
            className="text-sf-orange-1"
          />
          <AdminEditableField
            value={draftContent.branding.region}
            onChange={(value) => setField(['branding', 'region'], value)}
            size="label"
            className="text-sf-orange-1"
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
              key={`social-${index}`}
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
    </div>
  );

  const renderActiveEditor = () => {
    if (activePage === 'team') {
      return renderTeamEditor();
    }

    if (activePage === 'pastSeasons') {
      return renderPastSeasonsEditor();
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
              Edit the live website
            </h1>
            <p className="mt-4 text-base text-sf-muted sm:text-lg">
              Sign in, edit content below, and save directly to the live site.
            </p>
          </div>
          {canEdit ? (
            <div className="flex flex-wrap gap-3">
              <ActionButton onClick={() => setDraftContent(cloneValue(siteContent))}>
                Reset to live
              </ActionButton>
              <ActionButton onClick={handleSave} tone="primary">
                {isSaving ? 'Saving...' : scope.label}
              </ActionButton>
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          {!isFirebaseConfigured ? (
            <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Firebase is not configured. Add VITE_FIREBASE_* env vars to enable saving.
            </p>
          ) : !authReady ? (
            <p className="text-sm text-sf-muted">Checking session...</p>
          ) : !user ? (
            <ActionButton onClick={() => signInWithGoogle().catch((e) => setError(e.message))} tone="primary">
              Sign in with Google
            </ActionButton>
          ) : !canEdit ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {user.email} is not on the authorized admin list.
              </p>
              <ActionButton onClick={signOutAdmin}>Sign out</ActionButton>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                Signed in as {user.email}
              </span>
              <ActionButton onClick={signOutAdmin}>Sign out</ActionButton>
              <Link
                to="/"
                className="rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1"
              >
                View public site
              </Link>
            </div>
          )}

          {loadError ? (
            <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Content load error: {loadError}
            </p>
          ) : null}

          {hasRemoteUpdate ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              <span>
                Someone else saved while you were editing. Your unsaved
                sections were kept; the rest has been refreshed.
              </span>
              <ActionButton onClick={discardDraft}>
                Discard my edits and load theirs
              </ActionButton>
            </div>
          ) : null}

          {isDirty && !hasRemoteUpdate ? (
            <p className="rounded-2xl border border-sf-border bg-sf-surface px-4 py-3 text-sm text-sf-muted">
              You have unsaved changes.
            </p>
          ) : null}

          {status ? (
            <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {status}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      {canEdit ? (
        <>
      <div className="mt-8 flex flex-wrap gap-3">
            {[
              ['home', 'Homepage'],
              ['team', 'Team page'],
              ['pastSeasons', 'Past seasons'],
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
