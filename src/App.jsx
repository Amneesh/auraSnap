// src/App.jsx
import React, { useState } from 'react';
import UploadForm from './component/mediaUpload';
import Gallery from './component/mediaGallery';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // triggers gallery re-fetch
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Upload Image</h2>
      <UploadForm onUploadSuccess={handleUploadSuccess} />

      <h2>Gallery</h2>
      <Gallery refreshKey={refreshKey} />
    </div>
  );
}

export default App;
