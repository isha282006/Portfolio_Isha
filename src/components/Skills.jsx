import React, { useRef } from 'react';

const Skills = () => {
  const cardsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleMouseMove = (e, index) => {
    const card = cardsRef[index].current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const skillData = [
    {
      title: "Languages",
      icon: "fa-solid fa-terminal",
      skills: [
        { name: "C", badge: "Advanced" },
        { name: "C++", badge: "Advanced" },
        { name: "Python", badge: "Intermediate" }
      ]
    },
    {
      title: "Web Technologies",
      icon: "fa-solid fa-globe",
      skills: [
        { name: "HTML", badge: "Expert" },
        { name: "CSS", badge: "Expert" },
        { name: "JavaScript", badge: "Intermediate" }
      ]
    },
    {
      title: "Tools & Backend",
      icon: "fa-solid fa-cubes",
      skills: [
        { name: "Git", badge: "Version Control" },
        { name: "Firebase", badge: "Backend" },
        { name: "VS Code", badge: "IDE" }
      ]
    },
    {
      title: "Design & Creative",
      icon: "fa-solid fa-pen-nib",
      skills: [
        { name: "Figma", badge: "UI/UX Design" },
        { name: "Canva", badge: "Graphic Design" }
      ]
    }
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="container section-container">
        <div className="section-header-center">
          <span className="section-tag">SKILLS & TOOLS</span>
          <h2 className="section-title">My Creative Toolkit</h2>
          <p className="section-subtitle">A collection of languages, frameworks, design tools, and software that I utilize to bring ideas to life.</p>
        </div>
        
        <div className="skills-grid reveal-fade">
          {skillData.map((cat, idx) => (
            <div 
              key={idx}
              ref={cardsRef[idx]}
              className="skills-category-card glass-card"
              onMouseMove={(e) => handleMouseMove(e, idx)}
            >
              <div className="card-glow-element"></div>
              <h3 className="skills-cat-title">
                <i className={cat.icon}></i> {cat.title}
              </h3>
              <div className="skills-list">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-item-wrapper">
                    <div className="skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-badge">{skill.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
