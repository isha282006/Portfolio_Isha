import React, { useState, useEffect } from 'react';

const Loader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Fast increment in the beginning, slows down towards the end
      if (currentProgress < 75) {
        currentProgress += Math.floor(Math.random() * 8) + 2;
      } else if (currentProgress < 99) {
        currentProgress += 1;
      } else {
        currentProgress = 100;
      }

      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onLoadComplete();
          }, 800); // match transition speed
        }, 400); // small delay for completion
      }
    }, 40);

    // Backup if loading takes too long
    const handleLoad = () => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onLoadComplete();
        }, 800);
      }, 300);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, [onLoadComplete]);

  return (
    <div 
      id="loader-wrapper" 
      style={{
        opacity: isFadingOut ? 0 : 1,
        visibility: isFadingOut ? 'hidden' : 'visible'
      }}
    >
      <div className="loader-content">
        <div className="loader-logo">ISHA.</div>
        <div className="loader-bar-bg">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loader-percent">{progress}%</div>
      </div>
    </div>
  );
};

export default Loader;
