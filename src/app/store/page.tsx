import Link from 'next/link';

export default function StorePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <h1 className="page-title">Official Store</h1>
          <p className="page-subtitle">Represent Guigui Rap Culture</p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon">
        <div className="container">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h2>Store Coming Soon</h2>
            <p>We're working hard to bring you the best Guigui rap merchandise. Our store will feature exclusive T-shirts, caps, hoodies, and more branded items that represent the culture.</p>
            <div className="coming-soon-features">
              <div className="feature-item">
                <i className="fas fa-tshirt"></i>
                <span>Premium T-Shirts</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-hat-cowboy"></i>
                <span>Designer Caps</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-music"></i>
                <span>Exclusive Merch</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-shipping-fast"></i>
                <span>Worldwide Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="store-preview">
        <div className="container">
          <h2 className="section-title">What's Coming</h2>
          <div className="preview-grid">
            <div className="preview-item">
              <div className="preview-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Injai Channel T-Shirt" />
              </div>
              <div className="preview-info">
                <h3>Injai Channel Logo T-Shirt</h3>
                <p>Classic black T-shirt featuring the iconic Injai Channel logo</p>
                <span className="preview-price">$25.00</span>
              </div>
            </div>
            <div className="preview-item">
              <div className="preview-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Guigui Rap Cap" />
              </div>
              <div className="preview-info">
                <h3>Guigui Rap Culture Cap</h3>
                <p>Premium snapback cap with embroidered Guigui rap design</p>
                <span className="preview-price">$30.00</span>
              </div>
            </div>
            <div className="preview-item">
              <div className="preview-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Artist Collection Hoodie" />
              </div>
              <div className="preview-info">
                <h3>Artist Collection Hoodie</h3>
                <p>Comfortable hoodie featuring artwork from featured artists</p>
                <span className="preview-price">$45.00</span>
              </div>
            </div>
            <div className="preview-item">
              <div className="preview-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Limited Edition Poster" />
              </div>
              <div className="preview-info">
                <h3>Limited Edition Poster Set</h3>
                <p>Collector's edition posters featuring Guigui rap artists</p>
                <span className="preview-price">$20.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="store-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Be the First to Know</h2>
            <p>Subscribe to our newsletter to get early access to new merchandise, exclusive drops, and special discounts.</p>
            <form className="newsletter-form-large">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn btn-primary">Notify Me</button>
            </form>
            <div className="newsletter-benefits">
              <div className="benefit">
                <i className="fas fa-clock"></i>
                <span>Early Access</span>
              </div>
              <div className="benefit">
                <i className="fas fa-percent"></i>
                <span>Exclusive Discounts</span>
              </div>
              <div className="benefit">
                <i className="fas fa-star"></i>
                <span>Limited Editions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Merch Section */}
      <section className="artist-merch">
        <div className="container">
          <h2 className="section-title">Artist Merchandise</h2>
          <p className="section-subtitle">Support your favorite Guigui rap artists with official merchandise</p>
          <div className="artist-merch-grid">
            <div className="artist-merch-item">
              <div className="artist-merch-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="MC Flow Merch" />
              </div>
              <div className="artist-merch-info">
                <h3>MC Flow Collection</h3>
                <p>Official merchandise from the pioneer of Guigui rap</p>
                <span className="status">Coming Soon</span>
              </div>
            </div>
            <div className="artist-merch-item">
              <div className="artist-merch-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Rhyme Master Merch" />
              </div>
              <div className="artist-merch-info">
                <h3>Rhyme Master Collection</h3>
                <p>Technical wizard merchandise for the wordplay enthusiasts</p>
                <span className="status">Coming Soon</span>
              </div>
            </div>
            <div className="artist-merch-item">
              <div className="artist-merch-image">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80" alt="Street Poet Merch" />
              </div>
              <div className="artist-merch-info">
                <h3>Street Poet Collection</h3>
                <p>Storyteller merchandise for the urban poetry lovers</p>
                <span className="status">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="store-contact">
        <div className="container">
          <div className="contact-content">
            <h2>Questions About Merch?</h2>
            <p>Have questions about our upcoming merchandise or want to suggest product ideas? We'd love to hear from you!</p>
            <div className="contact-options">
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
              <Link href="#" className="btn btn-outline">Join Discord</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 