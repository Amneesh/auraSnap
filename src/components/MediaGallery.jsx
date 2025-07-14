import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = ({ refreshKey}) => {
  const [media, setMedia] = useState([]);
  const [code, setCode] = useState(localStorage.getItem('code'));


  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`https://aura-snap-backend.vercel.app/api/media?bucket=${encodeURIComponent(code)}`);
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
  }, [refreshKey, code]);

  const deleteMedia = async (key) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    

    try {
      await axios.delete(`https://aura-snap-backend.vercel.app/api/delete?key=${encodeURIComponent(key)}&bucket=${encodeURIComponent(code)}`);
      setMedia((prev) => prev.filter((item) => item.key !== key));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete image.');
    }
  };

  return (
<div className='gallery-page'>
<div className="gallery-header">
  <h2>Gallery</h2>
  <h3>Total Images : {media.length}</h3>
</div>

    <div className="gallery-grid" style={{ marginTop: 30 }}>
  
      {media.map((item) => (
        <div key={item.key} className='gallery-grid-container' style={{ position: 'relative' }}>
          <button
            onClick={() => deleteMedia(item.key)}
            className="delete-button"
            aria-label={`Delete ${item.title}`}
            title={`Delete ${item.title}`}
          >
            DELETE 
          </button>
          <img
            src={item.url}
            alt={item.title}
            className="gallery-image"
          />
        </div>
      ))}
    </div>
    </div>
  );
};

export default Gallery;
