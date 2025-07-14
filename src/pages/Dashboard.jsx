import React, { useState } from 'react';
import UploadForm from '../components/MediaUpload';
import Gallery from '../components/MediaGallery';
import Header from '../components/Header';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
const [code, setCode] = useState(localStorage.getItem('code'));
  // If code is not available yet, show a loading message
  if (!code) {
    return <div style={{ padding: 30 }}>Loading user data...</div>;
  }

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // triggers gallery re-fetch
  };

  return (
    <div>
      <Header />
      <div style={{ padding: 30 }}>
        <h2>Upload Image</h2>
        <UploadForm onUploadSuccess={handleUploadSuccess} code={code} />

       
        <Gallery refreshKey={refreshKey} code={code} />
      </div>
    </div>
  );
}
