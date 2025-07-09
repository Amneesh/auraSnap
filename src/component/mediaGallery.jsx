import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        // Step 1: Get media list
        const res = await axios.get('https://aura-snap-backend.vercel.app/api/media');
        const files = res.data;

        // Step 2: For each file, fetch the real signed URL
        const mediaWithUrls = await Promise.all(
            files.map(async (file) => {
                const signedRes = await axios.get(`https://aura-snap-backend.vercel.app${file.signedUrl}`);
                console.log('Signed URL:', signedRes.data.signedUrl);  // <-- add this
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

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 30 }}>
      {media.map((item) => (
        <img
          key={item.key}
          src={item.url}
          alt={item.title}
          style={{ width: 200, height: 'auto', objectFit: 'cover' }}
        />
      ))}
    </div>
  );
};

export default Gallery;
