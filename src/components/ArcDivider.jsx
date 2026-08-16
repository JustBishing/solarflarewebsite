import PropTypes from 'prop-types';

/**
 * Hairline arc sweeping between sections. Replaces the repeated 2px
 * underline that made every heading read identically.
 */
const ArcDivider = ({ flip = false, className = '' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none w-full overflow-hidden ${className}`}
  >
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`h-16 w-full sm:h-24 ${flip ? 'scale-y-[-1]' : ''}`}
      fill="none"
    >
      <path
        d="M0 118C240 118 420 12 720 12C1020 12 1200 118 1440 118"
        stroke="url(#arc-stroke)"
        strokeWidth="1"
      />
      <path
        d="M0 108C240 108 430 34 720 34C1010 34 1200 108 1440 108"
        stroke="url(#arc-stroke)"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      <defs>
        <linearGradient id="arc-stroke" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--sf-orange1))" stopOpacity="0" />
          <stop offset="0.5" stopColor="rgb(var(--sf-orange2))" stopOpacity="0.55" />
          <stop offset="1" stopColor="rgb(var(--sf-orange1))" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

ArcDivider.propTypes = {
  flip: PropTypes.bool,
  className: PropTypes.string,
};

export default ArcDivider;
