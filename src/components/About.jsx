import React, { useState, useEffect, useRef } from 'react';

const About = () => {
  const [projectCount, setProjectCount] = useState(0);
  const cardsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [hasAnimated, setHasAnimated] = useState(false);

  // Card Mouse spotlight tracker
  const handleMouseMove = (e, index) => {
    const card = cardsRef[index].current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Stat count-up timer when visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let count = 0;
          const target = 4;
          const duration = 2000;
          const stepTime = Math.max(Math.floor(duration / target), 30);
          
          const timer = setInterval(() => {
            count += 1;
            setProjectCount(count);
            if (count >= target) {
              setProjectCount(target);
              clearInterval(timer);
            }
          }, stepTime);
        }
      });
    }, { threshold: 0.5 });

    const currentStats = cardsRef[2].current;
    if (currentStats) {
      observer.observe(currentStats);
    }

    return () => {
      if (currentStats) {
        observer.unobserve(currentStats);
      }
    };
  }, [hasAnimated]);

  const scrollToContact = (e) => {
    e.preventDefault();
    const targetEl = document.getElementById('contact');
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
    <section id="about" className="about-section">
      <div className="container section-container">
        <div className="about-grid">
          
          {/* About Info (Left) */}
          <div className="about-info reveal-left">
            <span className="section-tag">ABOUT ME</span>
            <h2 className="section-title">Get to know me</h2>
            <p className="about-text">
              I'm a Computer Science Engineering undergraduate student at Chandigarh University (2024 – 2028). I love coding, designing, and building real-world projects that make a difference.
            </p>
            <p className="about-text-sub">
              Driven by curiosity, I specialize in combining clean, structured backend logic with gorgeous, premium front-end layouts. I seek out challenging opportunities to grow my engineering capabilities.
            </p>
            <a href="#contact" className="cta-button secondary-cta inline-cta" onClick={scrollToContact}>
              READ MORE ABOUT ME <i className="fa-regular fa-user"></i>
            </a>
          </div>

          {/* About Cards Grid (Right) */}
          <div className="about-cards-grid reveal-right">
            
            {/* Card 1: Education */}
            <div 
              ref={cardsRef[0]} 
              className="about-card glass-card"
              onMouseMove={(e) => handleMouseMove(e, 0)}
            >
              <div className="card-glow-element"></div>
              <div className="about-card-icon-wrapper">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="about-card-tag">EDUCATION</span>
              <h3 className="about-card-title">Chandigarh University</h3>
              <p className="about-card-detail">B.E. CSE</p>
              <p className="about-card-sub">2024 – 2028 (Expected)</p>
            </div>

            {/* Card 2: Focus Area */}
            <div 
              ref={cardsRef[1]} 
              className="about-card glass-card"
              onMouseMove={(e) => handleMouseMove(e, 1)}
            >
              <div className="card-glow-element"></div>
              <div className="about-card-icon-wrapper">
                <i className="fa-solid fa-code"></i>
              </div>
              <span className="about-card-tag">FOCUS AREA</span>
              <h3 className="about-card-title">Web Development</h3>
              <p className="about-card-detail">ML | IoT | DSA</p>
              <p className="about-card-sub">Core Technologies</p>
            </div>

            {/* Card 3: Projects */}
            <div 
              ref={cardsRef[2]} 
              className="about-card glass-card"
              onMouseMove={(e) => handleMouseMove(e, 2)}
            >
              <div className="card-glow-element"></div>
              <div className="about-card-icon-wrapper">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <span className="about-card-tag">PROJECTS</span>
              <h3 className="about-card-title">
                <span className="counter">{projectCount}</span>+ Major Projects
              </h3>
              <p className="about-card-detail">Completed</p>
              <p className="about-card-sub">IoT, ML & Web apps</p>
            </div>

            {/* Card 4: Interests */}
            <div 
              ref={cardsRef[3]} 
              className="about-card glass-card"
              onMouseMove={(e) => handleMouseMove(e, 3)}
            >
              <div className="card-glow-element"></div>
              <div className="about-card-icon-wrapper">
                <i className="fa-solid fa-heart"></i>
              </div>
              <span className="about-card-tag">INTERESTS</span>
              <h3 className="about-card-title">Coding & Chess</h3>
              <p className="about-card-detail">Drawing, Learning</p>
              <p className="about-card-sub">Creative Activities</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
