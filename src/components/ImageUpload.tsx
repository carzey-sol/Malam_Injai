'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  folder = 'injai-channel',
  label = 'Upload Image',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onImageUpload(result.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <label className="form-label">{label}</label>
      
      <div className="image-upload-area" onClick={handleClick}>
        {preview ? (
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <div className="image-overlay">
              <button 
                type="button" 
                className="btn-upload"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Change Image'}
              </button>
              <button 
                type="button" 
                className="btn-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Click to upload image</p>
            <p className="upload-hint">Supports JPG, PNG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={uploading}
      />
    </div>
  );
}
