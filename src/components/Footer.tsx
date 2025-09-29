import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>INJAI CHANNEL</h3>
            <p>Promoting Guigui rap culture and supporting emerging artists worldwide.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/artists">Artists</Link></li>
              <li><Link href="/videos">Videos</Link></li>
              <li><Link href="/events">Events</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/store">Store</Link></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Stay updated with the latest Guigui rap news and releases.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Injai Channel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 