import PropTypes from 'prop-types';

const sizeClasses = {
  body: 'text-base leading-relaxed',
  caption: 'text-sm leading-relaxed',
  label: 'text-sm font-semibold uppercase tracking-[0.18rem]',
  title: 'text-2xl font-semibold sm:text-3xl',
  hero: 'text-4xl font-extrabold leading-tight sm:text-5xl',
};

const AdminEditableField = ({
  className = '',
  multiline = false,
  onChange,
  placeholder = '',
  size = 'body',
  value,
}) => {
  const sharedClassName = `w-full rounded-2xl border border-dashed border-transparent bg-transparent px-3 py-2 text-sf-text outline-none transition placeholder:text-sf-muted/50 hover:border-sf-orange-1/35 focus:border-sf-orange-1 focus:bg-black/10 ${sizeClasses[size]} ${className}`;

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck="false"
        rows={4}
        className={`${sharedClassName} resize-y`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      spellCheck="false"
      className={sharedClassName}
    />
  );
};

AdminEditableField.propTypes = {
  className: PropTypes.string,
  multiline: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['body', 'caption', 'label', 'title', 'hero']),
  value: PropTypes.string.isRequired,
};

export default AdminEditableField;
