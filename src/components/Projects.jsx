import React, { useRef } from 'react';

const Projects = () => {
  const projectList = [
    {
      title: "Cycle Rush Rental Bike Website",
      category: "Web Application",
      icon: "fa-solid fa-bicycle",
      desc: "A highly responsive web application designed for campus students and faculty to lease and rent cycles easily. Features smooth interactive maps, custom booking schedules, and account dashboards.",
      tech: ["HTML", "CSS", "JavaScript"],
      source: "https://github.com",
      demo: "#"
    },
    {
      title: "CampusPrepAI",
      category: "Full-Stack AI Platform",
      icon: "fa-solid fa-brain",
      desc: "AI-powered student preparation platform that helps students manage study schedules, track progress, analyze PYQs, generate personalized learning plans, and improve exam readiness through intelligent analytics.",
      tech: ["React", "Node.js", "Express", "MongoDB", "OpenAI API", "Tailwind CSS"],
      source: "https://github.com",
      demo: "#"
    },
    {
      title: "Credit Card Fraud Detection",
      category: "Machine Learning",
      icon: "fa-solid fa-credit-card",
      desc: "An intelligent model developed to analyze credit card transactions and flag fraudulent occurrences. Integrated data visualization, dataset balancing, and accuracy metrics.",
      tech: ["Python", "Machine Learning", "Pandas"],
      source: "https://github.com",
      demo: "#"
    },
    {
      title: "Automatic Door Opener",
      category: "IoT Project",
      icon: "fa-solid fa-door-open",
      desc: "An IoT-based home automation hardware project utilizing motion sensors. Automatically opens doors when users approach and logs activity reports to a local server.",
      tech: ["IoT Devices", "Sensors", "C++ / Arduino"],
      source: "https://github.com",
      demo: "#"
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
    <section id="projects" className="projects-section">
      <div className="container section-container">
        <div className="section-header-center">
          <span className="section-tag">MY PORTFOLIO</span>
          <h2 className="section-title">Selected Projects</h2>
          <p className="section-subtitle">Showcasing a collection of applications ranging from web platforms, mobile designs, to machine learning models and IoT hardware automation.</p>
        </div>

        <div className="projects-grid">
          {projectList.map((project, idx) => (
            <div 
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="project-card glass-card reveal-up"
              onMouseMove={(e) => handleMouseMove(e, idx)}
            >
              <div className="card-glow-element"></div>
              <div className="project-img-container">
                <div className="project-overlay-glow"></div>
                <div className="project-category-badge">{project.category}</div>
                <i className={`${project.icon} project-icon-bg`}></i>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech-stack">
                  {project.tech.map((tag, tIdx) => (
                    <span key={tIdx} className="tech-tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.source} target="_blank" rel="noopener noreferrer" className="project-link">
                    <i className="fa-brands fa-github"></i> Source
                  </a>
                  <a href={project.demo} className="project-link">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
