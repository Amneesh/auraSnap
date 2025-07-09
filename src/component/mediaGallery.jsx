import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get('https://aura-snap-backend.vercel.app/api/media');
        const files = res.data;

        const mediaWithUrls = await Promise.all(
          files.map(async (file) => {
            const signedRes = await axios.get(`https://aura-snap-backend.vercel.app${file.signedUrl}`);
            return {
              key: file.key,
              title: file.title,
              url: signedRes.data.signedUrl,
            };
          })
        );

        setMedia(mediaWithUrls);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [refreshKey]);

  const deleteMedia = async (key) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`https://aura-snap-backend.vercel.app/api/delete?key=${encodeURIComponent(key)}`);
      setMedia((prev) => prev.filter((item) => item.key !== key));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete image.');
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 30 }}>
      {media.map((item) => (
        <div key={item.key} style={{ position: 'relative' }}>
          <button
            onClick={() => deleteMedia(item.key)}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: 'rgba(255,0,0,0.8)',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              cursor: 'pointer',
              zIndex: 1,
              borderRadius: '4px',
            }}
          >
            ×
          </button>
          <img
            src={item.url}
            alt={item.title}
            style={{ width: 200, height: 'auto', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
