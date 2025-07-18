import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { Gallery as PhotoSwipeGallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';

const Gallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);
  const [code, setCode] = useState(localStorage.getItem('code'));

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(
          `https://aura-snap-backend.vercel.app/api/media?bucket=${encodeURIComponent(code)}`
        );
        const files = res.data;

        const mediaWithUrls = await Promise.all(
          files.map(async (file) => {
            const signedRes = await axios.get(
              `https://aura-snap-backend.vercel.app${file.signedUrl}`
            );

            const img = new Image();
            img.src = signedRes.data.signedUrl;

            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // fallback if it fails
            });

            return {
              key: file.key,
              title: file.title,
              url: signedRes.data.signedUrl,
              width: img.naturalWidth || 1600,
              height: img.naturalHeight || 1200
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
      await axios.delete(
        `https://aura-snap-backend.vercel.app/api/delete?key=${encodeURIComponent(key)}&bucket=${encodeURIComponent(code)}`
      );
      setMedia((prev) => prev.filter((item) => item.key !== key));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete image.');
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="gallery-page">

      <div className="gallery-header">
        <h1>GALLERY</h1>
        <h2>Total Images : {media.length}</h2>
      </div>

      <PhotoSwipeGallery>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid-column"
        >
          {media.map((item) => (
            <div key={item.key} className="gallery-item" style={{ position: 'relative' }}>
              <button
                onClick={() => deleteMedia(item.key)}
                className="delete-button"
              >
                DELETE
              </button>

              <Item
                original={item.url}
                thumbnail={item.url}
                width={item.width}
                height={item.height}
                title={item.title}
              >
                {({ ref, open }) => (
                  <img
                    ref={ref}
                    onClick={open}
                    src={item.url}
                    alt={item.title}
                    className="gallery-image"
                    style={{ cursor: 'zoom-in' }}
                  />
                )}
              </Item>
            </div>
          ))}
        </Masonry>
      </PhotoSwipeGallery>
    </div>
  );
};

export default Gallery;
