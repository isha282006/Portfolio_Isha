import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import SocialSidebar from './components/SocialSidebar';
import ParticlesBackground from './components/ParticlesBackground';
import MouseGlow from './components/MouseGlow';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import LeetCodeAnalytics from './components/LeetCodeAnalytics';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Scroll reveal trigger
  useEffect(() => {
    if (isLoading) return;
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-left, .reveal-right, .reveal-up');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Loader onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <ParticlesBackground />
          <MouseGlow />
          <Navbar />
          <SocialSidebar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <LeetCodeAnalytics />
            <Certifications />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
