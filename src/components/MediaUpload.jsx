import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newFiles = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadImages = async (e) => {
    e.preventDefault();

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'uploaded') continue;

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading' } : f
        )
      );

      const formData = new FormData();
      formData.append('file', files[i].file);

      try {
        const response = await axios.post(
          'https://aura-snap-backend.vercel.app/api/upload',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        if (response.status === 200) {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: 'uploaded' } : f
            )
          );
          onUploadSuccess && onUploadSuccess();
        } else {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: 'error' } : f
            )
          );
        }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'error' } : f
          )
        );
      }
    }
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(files[index].previewUrl);
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <form onSubmit={uploadImages} className="upload-form">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="upload-input"
      />

      <div className="preview-container">
        {files.map(({ previewUrl, status }, index) => (
          <div key={index} className="preview-item">
            <img
              src={previewUrl}
              alt={`preview-${index}`}
              className={`preview-image ${status}`}
            />
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="preview-remove-button"
              title="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={files.length === 0 || files.every(f => f.status === 'uploaded')}
        className="upload-button"
      >
        Upload {files.some(f => f.status === 'uploading') ? '(Uploading...)' : ''}
      </button>
    </form>
  );
};

export default UploadForm;
