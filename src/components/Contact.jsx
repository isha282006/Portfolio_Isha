import React, { useState, useRef } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('form-', '');
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Dynamically clear errors
    if (value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [fieldName]: false }));
    }
    if (fieldName === 'email' && validateEmail(value.trim())) {
      setErrors((prev) => ({ ...prev, email: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: formData.name.trim() === '',
      email: formData.email.trim() === '' || !validateEmail(formData.email.trim()),
      subject: formData.subject.trim() === '',
      message: formData.message.trim() === ''
    };

    setErrors(newErrors);

    const isValid = !Object.values(newErrors).some(Boolean);

    if (isValid) {
      setIsSubmitting(true);
      // Simulate server request
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 6000);
      }, 1500);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container section-container">
        <div className="contact-layout">
          
          {/* Contact Left details */}
          <div className="contact-info-panel reveal-left">
            <span className="section-tag">GET IN TOUCH</span>
            <h2 className="section-title">Let's Build Something Amazing Together</h2>
            <p className="contact-subtitle-text">
              Have an exciting project idea, internship opportunity, or just want to chat about technology and design? Drop a message!
            </p>
            
            <div className="contact-details-list">
              <div className="contact-detail-card glass-card">
                <div className="contact-detail-icon">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="contact-detail-content">
                  <span className="detail-label">Email Me</span>
                  <a href="mailto:ishavishnoi28@gmail.com" className="detail-value">ishavishnoi28@gmail.com</a>
                </div>
              </div>
              
              <div className="contact-detail-card glass-card">
                <div className="contact-detail-icon">
                  <i className="fa-brands fa-linkedin-in"></i>
                </div>
                <div className="contact-detail-content">
                  <span className="detail-label">LinkedIn</span>
                  <a href="https://www.linkedin.com/in/isha-vishnoi-a66173350" target="_blank" rel="noopener noreferrer" className="detail-value">linkedin.com/in/isha-vishnoi-a66173350</a>
                </div>
              </div>

              <div className="contact-detail-card glass-card">
                <div className="contact-detail-icon">
                  <i className="fa-brands fa-github"></i>
                </div>
                <div className="contact-detail-content">
                  <span className="detail-label">GitHub</span>
                  <a href="https://github.com/isha282006" target="_blank" rel="noopener noreferrer" className="detail-value">github.com/isha282006</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Right */}
          <div 
            ref={cardRef}
            className="contact-form-panel glass-card reveal-right"
            onMouseMove={handleMouseMove}
          >
            <div className="card-glow-element"></div>
            <h3 className="form-title">Send a Message</h3>
            
            <form id="contact-form" onSubmit={handleSubmit} noValidate>
              <div className={`form-group ${errors.name ? 'invalid' : ''}`}>
                <input 
                  type="text" 
                  id="form-name" 
                  required 
                  placeholder=" " 
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="form-name">Full Name</label>
                <span className="form-underline"></span>
                <span className="error-msg">Please enter your name</span>
              </div>
              
              <div className={`form-group ${errors.email ? 'invalid' : ''}`}>
                <input 
                  type="email" 
                  id="form-email" 
                  required 
                  placeholder=" " 
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="form-email">Email Address</label>
                <span className="form-underline"></span>
                <span className="error-msg">Please enter a valid email</span>
              </div>

              <div className={`form-group ${errors.subject ? 'invalid' : ''}`}>
                <input 
                  type="text" 
                  id="form-subject" 
                  required 
                  placeholder=" " 
                  value={formData.subject}
                  onChange={handleInputChange}
                />
                <label htmlFor="form-subject">Subject</label>
                <span className="form-underline"></span>
                <span className="error-msg">Please enter a subject</span>
              </div>

              <div className={`form-group ${errors.message ? 'invalid' : ''}`}>
                <textarea 
                  id="form-message" 
                  required 
                  placeholder=" " 
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
                <label htmlFor="form-message">Your Message</label>
                <span className="form-underline"></span>
                <span className="error-msg">Please enter your message</span>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>SENDING... <i className="fa-solid fa-spinner fa-spin"></i></>
                ) : (
                  <>SEND_MESSAGE <i className="fa-regular fa-paper-plane"></i></>
                )}
              </button>
              
              <div className={`form-success-state ${showSuccess ? 'active' : ''}`}>
                <div className="success-icon"><i className="fa-solid fa-circle-check"></i></div>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out, Isha will get back to you shortly.</p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
