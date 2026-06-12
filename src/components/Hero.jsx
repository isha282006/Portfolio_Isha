import React, { useState, useEffect } from 'react';

const Hero = () => {
  const roles = ["Web Developer", "UI/UX Designer", "Problem Solver", "Tech Enthusiast"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timer;

    const handleTyping = () => {
      if (isDeleting) {
        setTypingText(currentRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        setTypingSpeed(50); // fast deletes
      } else {
        setTypingText(currentRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        setTypingSpeed(120); // normal type
      }

      if (!isDeleting && charIndex === currentRole.length) {
        setIsDeleting(true);
        setTypingSpeed(2000); // pause at full word
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setTypingSpeed(500); // pause before typing next word
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, typingSpeed]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
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
    <section id="home" className="hero-section">
      {/* Background visual components */}
      <div className="hero-grid-pattern"></div>
      <div className="hero-glow-ambient"></div>

      <div className="container hero-container">
        {/* Left: Profile Image with Glow Ring */}
        <div className="hero-image-wrapper reveal-fade">
          <div className="glowing-ring-container">
            <div className="glowing-ring"></div>
            <div className="glowing-ring-inner"></div>
            <div className="profile-image-frame">
              <img src="assets/profile.png" alt="Isha Vishnoi Profile Portrait" className="profile-img" />
            </div>
          </div>
        </div>

        {/* Right: Hero Content */}
        <div className="hero-content reveal-fade">
          <div className="greeting-wrapper">
            <span className="greeting-text">Hi, I'm</span>
            <div className="greeting-line"></div>
          </div>
          
          <h1 className="hero-name">
            ISHA VISHNOI
          </h1>
          
          <h2 className="hero-subtitle">COMPUTER SCIENCE ENGINEERING STUDENT</h2>
          
          <div className="hero-roles">
            <span className="typewriter-text">{typingText}</span>
            <span className="typewriter-cursor">|</span>
          </div>
          
          <p className="hero-description">
            Passionate about building innovative and user-friendly digital solutions through code and creativity.
          </p>
          
          <div className="hero-ctas">
            <a href="#projects" className="cta-button primary-cta" onClick={(e) => scrollToSection(e, 'projects')}>
              VIEW PROJECTS <span className="cta-icon-circle"><i className="fa-solid fa-arrow-right"></i></span>
            </a>
            <a href="#contact" className="cta-button secondary-cta" onClick={(e) => scrollToSection(e, 'contact')}>
              CONTACT ME <i className="fa-regular fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Down Mouse Indicator */}
      <div className="scroll-down-wrapper">
        <a href="#about" className="scroll-down-indicator" aria-label="Scroll down to About section" onClick={(e) => scrollToSection(e, 'about')}>
          <div className="mouse-icon">
            <div className="mouse-wheel"></div>
          </div>
          <span className="scroll-down-text">SCROLL DOWN</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
