'use client';

interface SocialLink {
  platform: string;
  label: string;
  url: string;
  iconClass?: string;
}

interface GetInTouch {
  headline?: string;
  description?: string;
  email?: string;
  phone?: string;
  addressLines?: string[];
}

interface ContactInfoProps {
  getInTouch: GetInTouch;
  socialLinks: SocialLink[];
  className?: string;
}

export default function ContactInfo({ getInTouch, socialLinks, className = '' }: ContactInfoProps) {
  return (
    <div className={`contact-info ${className}`}>
      <h2>Get in Touch</h2>
      <p>{getInTouch.description || 'Have questions, suggestions, or want to collaborate? We\'d love to hear from you. Reach out to us through any of the channels below.'}</p>
      
      <div className="contact-methods">
        {getInTouch.email && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="contact-details">
              <h3>Email</h3>
              <p>{getInTouch.email}</p>
            </div>
          </div>
        )}

        {getInTouch.phone && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-phone"></i>
            </div>
            <div className="contact-details">
              <h3>Phone</h3>
              <p>{getInTouch.phone}</p>
            </div>
          </div>
        )}

        {getInTouch.addressLines && getInTouch.addressLines.length > 0 && (
          <div className="contact-method">
            <div className="contact-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="contact-details">
              <h3>Address</h3>
              {getInTouch.addressLines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        <div className="contact-method">
          <div className="contact-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="contact-details">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9AM - 6PM</p>
            <p>Saturday: 10AM - 4PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className="social-links">
          <h3>Follow Us</h3>
          <div className="social-icons">
            {socialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <i className={link.iconClass || 'fas fa-link'}></i>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
