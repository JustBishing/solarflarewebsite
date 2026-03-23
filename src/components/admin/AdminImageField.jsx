import PropTypes from 'prop-types';
import { useState } from 'react';

const sizeClasses = {
  default: 'max-h-40',
  large: 'max-h-64',
};

const AdminImageField = ({
  label,
  onChange,
  onUploadError,
  onUploadStatusChange,
  onUploadSuccess,
  size = 'default',
  uploadFolder = 'general',
  uploadImage,
  value,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const [file] = event.target.files || [];

    if (!file) {
      return;
    }

    if (!uploadImage) {
      onUploadError?.('Image uploads are not configured.');
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    onUploadStatusChange?.(true);

    try {
      const uploadedUrl = await uploadImage(file, uploadFolder);
      onChange(uploadedUrl);
      onUploadSuccess?.('Image uploaded successfully.');
    } catch (error) {
      onUploadError?.(error.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
      onUploadStatusChange?.(false);
      event.target.value = '';
    }
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
      <label className="inline-flex cursor-pointer rounded-xl border border-sf-border px-4 py-2 text-sm font-semibold text-sf-text transition hover:border-sf-orange-1 hover:text-sf-orange-1">
        {isUploading ? 'Uploading...' : 'Upload image'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </label>
    </div>
  );
};

AdminImageField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUploadError: PropTypes.func,
  onUploadStatusChange: PropTypes.func,
  onUploadSuccess: PropTypes.func,
  size: PropTypes.oneOf(['default', 'large']),
  uploadFolder: PropTypes.string,
  uploadImage: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default AdminImageField;
