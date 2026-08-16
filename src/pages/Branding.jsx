import { motion } from 'framer-motion';
import Section from '../components/Section.jsx';
import {
  fadeInUp,
  resolveVariant,
  staggerChildren,
  useShouldReduceMotion,
} from '../lib/motion.js';

const MotionDiv = motion.div;

const palette = [
  {
    name: 'Flare Red',
    token: 'sf-red',
    hex: '#DC2626',
    rgb: '220, 38, 38',
    usage: 'Deep accent, urgency, brand edge',
  },
  {
    name: 'Flare Orange',
    token: 'sf-orange-1',
    hex: '#ff914d',
    rgb: '255, 145, 77',
    usage: 'Primary accent — buttons, dividers, active states',
  },
  {
    name: 'Solar Peach',
    token: 'sf-orange-2',
    hex: '#ffb27a',
    rgb: '255, 178, 122',
    usage: 'Highlights, gradient end, glow',
  },
  {
    name: 'Ember',
    token: 'sf-ember',
    hex: '#ff6a2a',
    rgb: '255, 106, 42',
    usage: 'Data emphasis — headline stat numerals',
  },
  {
    name: 'Ignition Black',
    token: 'sf-bg',
    hex: '#0c0c10',
    rgb: '12, 12, 16',
    usage: 'Base background',
  },
  {
    name: 'Ember Band',
    token: 'sf-band',
    hex: '#141010',
    rgb: '20, 16, 16',
    usage: 'Warm band behind angled sections',
  },
  {
    name: 'Carbon',
    token: 'sf-surface',
    hex: '#17171c',
    rgb: '23, 23, 28',
    usage: 'Card / panel surface',
  },
  {
    name: 'Pure White',
    token: 'sf-text',
    hex: '#FFFFFF',
    rgb: '255, 255, 255',
    usage: 'Primary text',
  },
];

const fonts = [
  {
    family: 'Archivo',
    role: 'Display — headings, wordmark, stat numerals',
    sample: 'Solar Flare Robotics',
    className: 'heading-display font-extrabold',
    weights: '600 · 700 · 800 · 900',
  },
  {
    family: 'Rajdhani',
    role: 'Body — paragraphs, UI, buttons',
    sample: 'Building robots. Fueling the next generation of innovators.',
    className: 'font-sans',
    weights: '400 · 500 · 600 · 700',
  },
  {
    family: 'JetBrains Mono',
    role: 'Data — ranks, dates, eyebrows, navigation labels',
    sample: '#10 HIGHEST SCORE IN THE WORLD',
    className: 'label-mono !text-base !tracking-[0.18em]',
    weights: '400 · 500 · 700',
  },
];

const Branding = () => {
  const shouldReduceMotion = useShouldReduceMotion();
  const listVariants = resolveVariant(staggerChildren, shouldReduceMotion);
  const itemVariants = resolveVariant(fadeInUp, shouldReduceMotion);

  return (
    <>
      <Section
        eyebrow="Brand system"
        title="Solar Flare Identity"
        description="The colors, typography, and visual language that keep every surface of Solar Flare Robotics consistent."
      >
        <MotionDiv variants={itemVariants} className="text-sf-muted">
          <p>
            Four families of ink: <span className="font-semibold text-sf-text">red</span>,{' '}
            <span className="font-semibold text-sf-orange-1">orange</span>,{' '}
            <span className="font-semibold text-sf-text">white</span>, and{' '}
            <span className="font-semibold text-sf-text">black</span> — the heat of a flare
            against pure black.
          </p>
        </MotionDiv>
      </Section>

      <Section title="Color Palette" description="Every accent on the site maps to one of these tokens.">
        <MotionDiv
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={listVariants}
        >
          {palette.map((color) => (
            <motion.article
              key={color.token}
              className="glass-card group flex h-full flex-col overflow-hidden"
              variants={itemVariants}
            >
              <div
                className="relative h-32 w-full"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h3 className="heading-display text-xl font-semibold text-sf-text">
                  {color.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-[0.22rem] text-sf-orange-2">
                  {color.token}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-sf-muted">
                  <span>{color.hex}</span>
                  <span>rgb({color.rgb})</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-sf-muted">{color.usage}</p>
              </div>
            </motion.article>
          ))}
        </MotionDiv>
      </Section>

      <Section title="Typography" description="A two-family system: a geometric display face paired with a technical sans for body.">
        <MotionDiv className="grid gap-6 md:grid-cols-2" variants={listVariants}>
          {fonts.map((font) => (
            <motion.article
              key={font.family}
              className="glass-card flex h-full flex-col p-8"
              variants={itemVariants}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22rem] text-sf-orange-2">
                {font.role}
              </p>
              <h3 className={`${font.className} mt-3 text-3xl font-bold text-sf-text sm:text-4xl`}>
                {font.family}
              </h3>
              <p className={`${font.className} mt-4 text-xl text-sf-muted`}>{font.sample}</p>
              <p className="mt-auto pt-6 font-mono text-xs text-sf-muted">Weights: {font.weights}</p>
            </motion.article>
          ))}
        </MotionDiv>
      </Section>

      <Section title="Gradients & Glow" description="Our signature: a red-to-amber gradient backed by ambient aura.">
        <MotionDiv className="grid gap-6 md:grid-cols-2" variants={listVariants}>
          <motion.div
            className="glass-card overflow-hidden"
            variants={itemVariants}
          >
            <div
              className="h-40 w-full"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #ffb27a 0%, #ff914d 55%, #DC2626 100%)',
              }}
              aria-hidden="true"
            />
            <div className="p-6">
              <h3 className="heading-display text-xl font-semibold text-sf-text">
                Flare Gradient
              </h3>
              <p className="mt-2 font-mono text-xs text-sf-muted">
                linear-gradient(135deg, #ffb27a → #ff914d → #DC2626)
              </p>
              <p className="mt-3 text-sm text-sf-muted">
                Used on primary buttons, hero headline, active nav underline.
              </p>
            </div>
          </motion.div>
          <motion.div className="glass-card overflow-hidden" variants={itemVariants}>
            <div
              className="relative h-40 w-full overflow-hidden bg-black"
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sf-orange-1/60 blur-3xl" />
              <div className="absolute left-[30%] top-[60%] h-32 w-32 rounded-full bg-red-600/50 blur-3xl" />
            </div>
            <div className="p-6">
              <h3 className="heading-display text-xl font-semibold text-sf-text">
                Ambient Aura
              </h3>
              <p className="mt-2 font-mono text-xs text-sf-muted">
                blur-3xl orbs @ 20–40% opacity · drift 14–22s
              </p>
              <p className="mt-3 text-sm text-sf-muted">
                A global layer behind every page — the reason the site feels alive.
              </p>
            </div>
          </motion.div>
        </MotionDiv>
      </Section>
    </>
  );
};

export default Branding;
