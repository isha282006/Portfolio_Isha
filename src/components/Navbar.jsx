import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar scroll height transition state
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll progress indicator
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section
      const sections = ['home', 'about', 'skills', 'projects', 'leetcode', 'certifications', 'contact'];
      let currentSection = 'home';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.clientHeight;
          if (window.scrollY >= top && window.scrollY < top + height) {
            currentSection = sectionId;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    setIsMobileActive(false);
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetEl.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div id="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Sticky Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="logo" onClick={(e) => handleLinkClick(e, 'home')}>
            ISHA.
          </a>

          {/* Mobile Navigation Toggle */}
          <button 
            className={`nav-toggle ${isMobileActive ? 'active' : ''}`} 
            onClick={() => setIsMobileActive(!isMobileActive)}
            aria-label="Toggle Navigation Menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <nav className={`navbar ${isMobileActive ? 'active' : ''}`}>
            {['home', 'about', 'skills', 'projects', 'leetcode', 'certifications', 'contact'].map((sec) => (
              <a
                key={sec}
                href={`#${sec}`}
                className={`nav-link ${activeSection === sec ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, sec)}
              >
                {sec === 'leetcode' ? 'LEETCODE' : sec.toUpperCase()}
              </a>
            ))}
            <a href="assets/resume.pdf" className="nav-resume-btn" download>
              <i className="fa-solid fa-download"></i> DOWNLOAD RESUME
            </a>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
