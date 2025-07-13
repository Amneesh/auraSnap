import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await axios.post(
        'https://aura-snap-backend.vercel.app/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 200) {
        setFile(null);
        onUploadSuccess();
      } else {
        alert('Upload failed with status: ' + response.status);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={uploadImage} className="upload-form">
      <label htmlFor="file-upload" className="upload-label">
        Select Image
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
        disabled={uploading}
        className="upload-input"
      />
      <button type="submit" disabled={uploading} className="upload-button">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;
