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
  const [code] = useState(localStorage.getItem('code'));

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const processedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        try {
          const webpFile = await convertToWebP(file);
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
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f))
      );

      const formData = new FormData();
      formData.append('file', files[i].file);

      try {
        const response = await axios.post(
          `https://aura-snap-backend.vercel.app/api/upload?bucket=${encodeURIComponent(code)}`,
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

    // ✅ Clean up previews and clear file list
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setFiles([]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(files[index].previewUrl);
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className='upload-page'>
    <form onSubmit={uploadImages} className="upload-form">
      
      <label for="file" class="custum-file-upload">
<div class="icon">
<svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> </g></svg>
</div>
<div class="text">
   <span>Click to upload image</span>
   </div>
   <input
        type="file"
        accept="image/*"
        multiple
        id="file"
        onChange={handleFileChange}
        className="upload-input"
      />
</label>


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
<div className="upload-form-footer">


      <button
        type="submit"
        disabled={
          files.length === 0 || files.every((f) => f.status === 'uploaded')
        }
        className="upload-button"
      >
        Upload {files.some((f) => f.status === 'uploading') ? '(Uploading...)' : ''}
      </button>
      </div>
    </form>
    </div>
  );
};

export default UploadForm;
