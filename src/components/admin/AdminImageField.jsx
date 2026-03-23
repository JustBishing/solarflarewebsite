import PropTypes from 'prop-types';

const sizeClasses = {
  default: 'max-h-40',
  large: 'max-h-64',
};

const AdminImageField = ({ label, onChange, size = 'default', value }) => {
  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18rem] text-sf-muted">
        {label}
      </span>
      <div className="overflow-hidden rounded-xl border border-sf-border bg-black/20 p-4">
        <img
          src={value}
          alt={label}
          className={`${sizeClasses[size]} w-full object-contain`}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck="false"
        className="w-full rounded-xl border border-sf-border bg-black/20 px-3 py-2 text-sm text-sf-text outline-none transition focus:border-sf-orange-1"
      />
    </div>
  );
};

AdminImageField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['default', 'large']),
  value: PropTypes.string.isRequired,
};

export default AdminImageField;
