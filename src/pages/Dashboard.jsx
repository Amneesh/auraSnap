import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/MediaUpload';
import Gallery from '../components/MediaGallery';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const storedCode = localStorage.getItem('code');
    if (!storedCode) {
      navigate('/login'); // 🔁 Redirect to login page
    } else {
      setCode(storedCode);
    }
  }, [navigate]);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1); // triggers gallery re-fetch
  };

  if (!code) {
    return <div style={{ padding: 30 }}>Loading user data...</div>;
  }

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
