import PropTypes from 'prop-types';

/**
 * Infinite horizontal ticker. The track holds two identical copies of the
 * item list and translates by exactly -50%, so the loop point is seamless.
 * Paused entirely under prefers-reduced-motion (see index.css).
 */
const Marquee = ({ items, className = '' }) => {
  const sequence = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`marquee-mask relative flex overflow-hidden border-y border-white/[0.07] bg-white/[0.015] py-4 ${className}`}
    >
      <div className="animate-marquee-track flex shrink-0 items-center gap-8 pr-8">
        {sequence.map((item, index) => (
          <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-8">
            <span className="label-mono whitespace-nowrap text-sf-muted/80">
              {item}
            </span>
            <span
              className="inline-block h-1 w-1 shrink-0 rotate-45 bg-sf-orange-1/70"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

Marquee.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
};

export default Marquee;
