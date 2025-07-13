import React, { useState } from 'react';

import UploadForm from '../components/MediaUpload';
import Gallery from '../components/MediaGallery';
import Header from '../components/Header';
export default function Dashboard() {




  const [refreshKey, setRefreshKey] = useState(0);
  
    const handleUploadSuccess = () => {
      setRefreshKey(prev => prev + 1); // triggers gallery re-fetch
    };

  return (
    <div >
     <Header/>
     
       <div style={{ padding: 30 }}>
      <h2>Upload Image</h2>
      <UploadForm onUploadSuccess={handleUploadSuccess} />

      <h2>Gallery</h2>
      <Gallery refreshKey={refreshKey} />
    </div>
    </div>
  );
}
