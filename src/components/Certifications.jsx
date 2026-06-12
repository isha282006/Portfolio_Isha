import React, { useRef } from 'react';

const Certifications = () => {
  const certList = [
    {
      date: "Professional Certificate",
      title: "Object-Oriented Python: Inheritance and Encapsulation",
      desc: "Validates core competencies in writing extensible OOP structures in Python using code isolation, properties, getters/setters, and class inheritance hierarchies."
    },
    {
      date: "Core programming",
      title: "Python Basic Structures",
      desc: "Covers algorithmic basics including dictionaries, lists, tuple unpacking, and sequence structures within Python applications."
    },
    {
      date: "Fundamental programming",
      title: "Python Basics: Selection and Iteration",
      desc: "Establishes foundation logic structures: loops, decision trees, recursive logic, and code optimization parameters."
    },
    {
      date: "Object Paradigms",
      title: "Python Object Basics",
      desc: "Validates knowledge of class templates, instance namespaces, constructor management, and default object attributes."
    },
    {
      date: "IoT & Embedded Systems",
      title: "IoT Devices Certification",
      desc: "Demonstrates technical mastery in wiring, configuring, and collecting data from smart hardware, sensors, and microcontrollers."
    }
  ];

  const cardsRef = useRef([]);

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="certifications" className="certifications-section">
      <div className="container section-container">
        <div className="section-header-center">
          <span className="section-tag">CREDENTIALS</span>
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">Verified achievements validating proficiency in Python architectures, programming concepts, and IoT systems.</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {certList.map((cert, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={idx} className={`timeline-item ${isLeft ? 'reveal-left' : 'reveal-right'}`}>
                <div className="timeline-dot"></div>
                <div 
                  ref={(el) => (cardsRef.current[idx] = el)}
                  className="timeline-content glass-card"
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                >
                  <div className="card-glow-element"></div>
                  <div className="timeline-date">{cert.date}</div>
                  <h3 className="timeline-title">{cert.title}</h3>
                  <p className="timeline-desc">{cert.desc}</p>
                  <div className="timeline-badge">
                    <i className="fa-solid fa-award"></i> Verified Credential
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
