import React, { useState } from 'react';
import axios from 'axios';

// WebP converter
const convertToWebP = async (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('WebP conversion failed.'));
          const webpFile = new File(
            [blob],
            `${file.name.split('.')[0]}.webp`,
            { type: 'image/webp' }
          );
          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };
    image.onerror = (err) => reject(err);
  });
};

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const processedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        try {
          const webpFile = await convertToWebP(file); // convert to WebP
          return {
            file: webpFile,
            previewUrl: URL.createObjectURL(webpFile),
            status: 'pending',
          };
        } catch (err) {
          console.error(`Failed to convert ${file.name}:`, err);
          return null;
        }
      })
    );

    const validFiles = processedFiles.filter(Boolean);
    setFiles((prev) => [...prev, ...validFiles]);
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
        console.error('Upload error:', error);
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
