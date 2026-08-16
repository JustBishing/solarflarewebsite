import PropTypes from 'prop-types';

/**
 * Rotating circular caption with a static arrow at its centre. The ring
 * spins; the arrow does not, so the mark stays legible.
 */
const ScrollBadge = ({ text = 'SCROLL · TO · EXPLORE · ', className = '' }) => (
  <div
    className={`relative hidden h-28 w-28 items-center justify-center sm:flex ${className}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 100 100" className="animate-badge-spin h-full w-full">
      <defs>
        <path
          id="scroll-badge-ring"
          d="M50 50 m -35 0 a 35 35 0 1 1 70 0 a 35 35 0 1 1 -70 0"
          fill="none"
        />
      </defs>
      <text
        className="fill-white/45"
        style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: '9.5px',
          letterSpacing: '0.34em',
        }}
      >
        <textPath href="#scroll-badge-ring" startOffset="0">
          {text}
        </textPath>
      </text>
    </svg>
    <svg
      className="absolute h-5 w-5 text-sf-orange-2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="4" x2="12" y2="19" />
      <polyline points="6 13 12 19 18 13" />
    </svg>
  </div>
);

ScrollBadge.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};

export default ScrollBadge;
