'use client';

import { useState, useEffect } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const shareData = {
    url,
    title,
    description: description || title,
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const shareToFacebook = () => {
    if (typeof window === 'undefined' || !isValidUrl(url)) return;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    if (typeof window === 'undefined' || !isValidUrl(url)) return;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    if (typeof window === 'undefined' || !isValidUrl(url)) return;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    if (typeof window === 'undefined' || !isValidUrl(url)) return;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = () => {
    if (typeof window === 'undefined' || !isValidUrl(url)) return;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(telegramUrl, '_blank');
  };

  const copyToClipboard = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareViaNative = async () => {
    if (typeof navigator === 'undefined' || !('share' in navigator)) {
      copyToClipboard();
      return;
    }

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing: ', err);
    }
  };

  if (!isClient) {
    return (
      <div className="social-share">
        <h3>Share this article</h3>
        <div className="social-share-loading">
          <p>Loading sharing options...</p>
        </div>
      </div>
    );
  }

  if (!url || !isValidUrl(url)) {
    return (
      <div className="social-share">
        <h3>Share this article</h3>
        <div className="social-share-loading">
          <p>Sharing not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="social-share">
      <h3>Share this article</h3>
      <div className="social-share-buttons">
        <button 
          onClick={shareToFacebook}
          className="share-btn facebook"
          title="Share on Facebook"
        >
          <i className="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </button>
        
        <button 
          onClick={shareToTwitter}
          className="share-btn twitter"
          title="Share on Twitter"
        >
          <i className="fab fa-twitter"></i>
          <span>Twitter</span>
        </button>
        
        <button 
          onClick={shareToLinkedIn}
          className="share-btn linkedin"
          title="Share on LinkedIn"
        >
          <i className="fab fa-linkedin-in"></i>
          <span>LinkedIn</span>
        </button>
        
        <button 
          onClick={shareToWhatsApp}
          className="share-btn whatsapp"
          title="Share on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
          <span>WhatsApp</span>
        </button>
        
        <button 
          onClick={shareToTelegram}
          className="share-btn telegram"
          title="Share on Telegram"
        >
          <i className="fab fa-telegram-plane"></i>
          <span>Telegram</span>
        </button>
        
        <button 
          onClick={copyToClipboard}
          className="share-btn copy"
          title="Copy link"
        >
          <i className="fas fa-link"></i>
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
        
        {isClient && typeof navigator !== 'undefined' && 'share' in navigator && (
          <button 
            onClick={shareViaNative}
            className="share-btn native"
            title="Share via device"
          >
            <i className="fas fa-share-alt"></i>
            <span>Share</span>
          </button>
        )}
      </div>
    </div>
  );
}
