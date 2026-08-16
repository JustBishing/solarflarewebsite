import PropTypes from 'prop-types';

/**
 * Oversized watermark type that bleeds toward the viewport edge. Fills the
 * empty half of wide layouts without competing with real content.
 *
 * It clips itself rather than relying on the section to do it: the split
 * layout uses a sticky heading column, and `overflow: hidden` on an
 * ancestor would kill the sticky.
 */
const GhostWordmark = ({ text, side = 'right', className = '' }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 hidden select-none overflow-hidden lg:block ${className}`}
  >
    <span
      className={`heading-hero absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-black uppercase leading-none text-white/[0.022] ${
        side === 'right' ? 'left-[62%]' : 'right-[62%]'
      }`}
      style={{ fontSize: 'clamp(7rem, 15vw, 13rem)' }}
    >
      {text}
    </span>
  </span>
);

GhostWordmark.propTypes = {
  text: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
};

export default GhostWordmark;
