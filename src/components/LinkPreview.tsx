'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LinkPreviewProps {
  url: string;
  type?: 'news' | 'artist' | 'video' | 'event' | 'external';
  id?: string;
  onPreviewGenerated?: (preview: any) => void;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  artist?: string;
  date?: string;
}

export default function LinkPreview({ url, type = 'external', id, onPreviewGenerated }: LinkPreviewProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (url && url.trim()) {
      generatePreview();
    } else {
      setPreview(null);
      setError('');
    }
  }, [url, type, id]);

  const generatePreview = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          type,
          id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const previewData = await response.json();
      setPreview(previewData);
      
      if (onPreviewGenerated) {
        onPreviewGenerated(previewData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate preview');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  if (!url || !url.trim()) {
    return null;
  }

  if (loading) {
    return (
      <div className="link-preview loading">
        <div className="preview-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-description"></div>
          </div>
        </div>
        <p className="loading-text">Generating preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="link-preview error">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Could not generate preview: {error}</span>
        </div>
        <button 
          onClick={generatePreview}
          className="btn btn-small btn-outline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <div className="link-preview">
      <div className="preview-header">
        <h4>Link Preview</h4>
        <span className="preview-type">{preview.type}</span>
      </div>
      
      <div className="preview-content">
        {preview.image && (
          <div className="preview-image">
            <Image
              src={preview.image}
              alt={preview.title}
              width={300}
              height={200}
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="preview-text">
          <h5 className="preview-title">{preview.title}</h5>
          {preview.description && (
            <p className="preview-description">{preview.description}</p>
          )}
          {preview.artist && (
            <p className="preview-artist">
              <i className="fas fa-user"></i> {preview.artist}
            </p>
          )}
          {preview.date && (
            <p className="preview-date">
              <i className="fas fa-calendar"></i> {new Date(preview.date).toLocaleDateString()}
            </p>
          )}
          <div className="preview-url">
            <i className="fas fa-link"></i>
            <span>{preview.url}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
