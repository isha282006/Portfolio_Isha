import React from 'react';

const SocialSidebar = () => {
  return (
    <div className="social-sidebar">
      <a href="https://github.com/isha282006" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="GitHub">
        <i className="fa-brands fa-github"></i>
      </a>
      <a href="https://www.linkedin.com/in/isha-vishnoi-a66173350" target="_blank" rel="noopener noreferrer" className="social-icon-link" aria-label="LinkedIn">
        <i className="fa-brands fa-linkedin-in"></i>
      </a>
      <a href="mailto:ishavishnoi28@gmail.com" className="social-icon-link" aria-label="Email">
        <i className="fa-regular fa-envelope"></i>
      </a>
    </div>
  );
};

export default SocialSidebar;
