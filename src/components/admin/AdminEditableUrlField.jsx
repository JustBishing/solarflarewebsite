import PropTypes from 'prop-types';

const AdminEditableUrlField = ({ label, onChange, type = 'text', value }) => (
  <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18rem] text-sf-muted">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck="false"
      className="rounded-xl border border-sf-border bg-black/20 px-3 py-2 text-sm font-normal normal-case tracking-normal text-sf-text outline-none transition focus:border-sf-orange-1"
    />
  </label>
);

AdminEditableUrlField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default AdminEditableUrlField;
