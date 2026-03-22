import PropTypes from 'prop-types';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that image file.'));
    reader.readAsDataURL(file);
  });

const AdminImageField = ({ label, onChange, value }) => {
  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
    event.target.value = '';
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-[0.18rem] text-sf-muted">
        {label}
      </span>
      <div className="overflow-hidden rounded-xl border border-sf-border bg-black/20 p-4">
        <img
          src={value}
          alt={label}
          className="max-h-40 w-full object-contain"
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck="false"
        className="w-full rounded-xl border border-sf-border bg-black/20 px-3 py-2 text-sm text-sf-text outline-none transition focus:border-sf-orange-1"
      />
      <label className="inline-flex cursor-pointer rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1">
        Upload image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

AdminImageField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default AdminImageField;
