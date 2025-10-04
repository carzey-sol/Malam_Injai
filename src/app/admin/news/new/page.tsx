'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import LinkPreview from '@/components/LinkPreview';

export default function NewNewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [featured, setFeatured] = useState(false);
  const [links, setLinks] = useState([{ text: '', url: '' }]);
  const [previewUrl, setPreviewUrl] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const filteredLinks = links.filter(link => link.text.trim() && link.url.trim());
      
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          image,
          excerpt,
          author,
          category,
          featured,
          links: filteredLinks
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create article');
      }
      
      router.push('/admin/news');
    } catch (e: any) {
      setError(e.message);
    } finally { 
      setSubmitting(false); 
    }
  };

  const addLink = () => {
    setLinks([...links, { text: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Add New Article</h1>
        <button 
          className="btn btn-outline"
          onClick={() => router.push('/admin/news')}
        >
          Back to News
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="admin-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Excerpt (Short Description)</label>
            <textarea 
              rows={3} 
              value={excerpt} 
              onChange={(e) => setExcerpt(e.target.value)} 
              required 
              maxLength={200}
            />
            <small>{excerpt.length}/200 characters</small>
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
              height="400px"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Author</label>
              <input 
                value={author} 
                onChange={(e) => setAuthor(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="GENERAL">General</option>
                <option value="RELEASES">New Releases</option>
                <option value="EVENTS">Events</option>
                <option value="INTERVIEWS">Interviews</option>
                <option value="INDUSTRY">Industry News</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <ImageUpload
              onImageUpload={setImage}
              currentImage={image}
              folder="news"
              label="Article Image"
            />
          </div>
          
          <div className="form-group">
            <label>Preview URL (Optional)</label>
            <input 
              type="url"
              value={previewUrl} 
              onChange={(e) => setPreviewUrl(e.target.value)} 
              placeholder="https://example.com"
            />
            <small>Enter a URL to generate a preview for social sharing</small>
            {previewUrl && (
              <LinkPreview 
                url={previewUrl}
                type="external"
              />
            )}
          </div>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e) => setFeatured(e.target.checked)} 
              />
              Featured Article
            </label>
          </div>
          
          <div className="form-group">
            <label>Links (Optional)</label>
            {links.map((link, index) => (
              <div key={index} className="link-input-group">
                <input
                  type="text"
                  placeholder="Link text"
                  value={link.text}
                  onChange={(e) => updateLink(index, 'text', e.target.value)}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => removeLink(index)}
                  className="btn btn-small"
                  style={{ background: '#ff4444', color: 'white' }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addLink}
              className="btn btn-outline"
              style={{ marginTop: '0.5rem' }}
            >
              Add Link
            </button>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Article'}
            </button>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => router.push('/admin/news')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
