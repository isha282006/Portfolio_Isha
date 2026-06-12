import React from 'react';

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="copyright">© 2026 Isha Vishnoi. All Rights Reserved.</p>
        <a href="#home" className="back-to-top" aria-label="Scroll back to top" onClick={scrollToTop}>
          <i className="fa-solid fa-chevron-up"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
