import PropTypes from 'prop-types';

/**
 * Rotated rail that reclaims the left gutter. The rail carries the section's
 * own label; `index` is passed only where the content is genuinely ordered
 * (season timeline, sponsor tiers) so the number encodes sequence rather
 * than decorating one.
 */
const SectionIndex = ({ label, index }) => (
  // Gated on the `rail` breakpoint (1440px), not a stock one: the cutoff is
  // set by the container width plus two rail gutters, not by device class.
  // See the screens block in tailwind.config.js.
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -left-14 top-0 hidden h-full w-14 select-none rail:block"
  >
    <div className="sticky top-32 flex flex-col items-center gap-4">
      {index ? (
        <span className="label-mono text-sm text-sf-orange-1/70">{index}</span>
      ) : null}
      <span className="h-12 w-px bg-gradient-to-b from-sf-orange-1/45 to-transparent" />
      <span className="writing-vertical label-mono rotate-180 whitespace-nowrap text-white/50">
        {label}
      </span>
    </div>
  </div>
);

SectionIndex.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.string,
};

export default SectionIndex;
