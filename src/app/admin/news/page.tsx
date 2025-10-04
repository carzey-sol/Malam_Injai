'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import LinkPreview from '@/components/LinkPreview';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: 'GENERAL' | 'RELEASES' | 'EVENTS' | 'INTERVIEWS' | 'INDUSTRY';
  featured: boolean;
  links: {
    text: string;
    url: string;
  }[];
}

export default function AdminNewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    excerpt: '',
    author: '',
    category: 'GENERAL' as 'GENERAL' | 'RELEASES' | 'EVENTS' | 'INTERVIEWS' | 'INDUSTRY',
    featured: false,
    links: [{ text: '', url: '' }],
    previewUrl: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoadingArticles(true);
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch articles');
      setArticles(await res.json());
    } catch (e: any) { 
      setError(e.message); 
    } finally { 
      setLoadingArticles(false); 
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const res = await fetch(`/api/news?id=${articleId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete article');
      }
      
      setMessage('Article deleted successfully');
      loadArticles();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      image: article.image,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      featured: article.featured,
      links: article.links.length > 0 ? article.links : [{ text: '', url: '' }],
      previewUrl: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const filteredLinks = formData.links.filter(link => link.text.trim() && link.url.trim());
      
      const isEditing = editingArticle !== null;
      const url = isEditing ? '/api/news' : '/api/news';
      const method = isEditing ? 'PUT' : 'POST';
      
      const requestBody = isEditing 
        ? { id: editingArticle.id, ...formData, links: filteredLinks }
        : { ...formData, links: filteredLinks };
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} article`);
      }
      
      setMessage(`Article ${isEditing ? 'updated' : 'created'} successfully`);
      setFormData({
        title: '',
        content: '',
        image: '',
        excerpt: '',
        author: '',
        category: 'GENERAL',
        featured: false,
        links: [{ text: '', url: '' }],
        previewUrl: ''
      });
      setEditingArticle(null);
      loadArticles();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { text: '', url: '' }]
    });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index)
    });
  };

  const updateLink = (index: number, field: 'text' | 'url', value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  if (loading || !user) return null;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>News Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/admin/news/new')}
        >
          Add New Article
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
          <button onClick={() => setMessage('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {/* Edit Form */}
      {editingArticle && (
        <div className="admin-form">
          <h2>{editingArticle ? 'Edit Article' : 'Add New Article'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Excerpt (Short Description)</label>
              <textarea 
                rows={3} 
                value={formData.excerpt} 
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
                required 
                maxLength={200}
              />
              <small>{formData.excerpt.length}/200 characters</small>
            </div>
            
            <div className="form-group">
              <label>Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Write your article content here..."
                height="400px"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Author</label>
                <input 
                  value={formData.author} 
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}>
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
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
                folder="news"
                label="Article Image"
              />
            </div>
            
            <div className="form-group">
              <label>Preview URL (Optional)</label>
              <input 
                type="url"
                value={formData.previewUrl} 
                onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })} 
                placeholder="https://example.com"
              />
              <small>Enter a URL to generate a preview for social sharing</small>
              {formData.previewUrl && (
                <LinkPreview 
                  url={formData.previewUrl}
                  type="external"
                />
              )}
            </div>
            
            <div className="form-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={formData.featured} 
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} 
                />
                Featured Article
              </label>
            </div>
            
            <div className="form-group">
              <label>Links (Optional)</label>
              {formData.links.map((link, index) => (
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
              >
                {editingArticle ? 'Update Article' : 'Create Article'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setEditingArticle(null);
                  setFormData({
                    title: '',
                    content: '',
                    image: '',
                    excerpt: '',
                    author: '',
                    category: 'GENERAL',
                    featured: false,
                    links: [{ text: '', url: '' }],
                    previewUrl: ''
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles List */}
      <div className="admin-form">
        <h2>All Articles</h2>
        {loadingArticles ? (
          <div className="loading">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="no-results">No articles found</div>
        ) : (
          <div className="admin-grid">
            {articles.map((article) => (
              <div key={article.id} className="admin-card">
                <div className="admin-card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(article)}
                    title="Edit Article"
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(article.id)}
                    title="Delete Article"
                  >
                    Delete
                  </button>
                </div>
                <div className="article-image">
                  <img src={article.image} alt={article.title} />
                </div>
                <div className="article-info">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                    <p>Author: {article.author}</p>
                    <p>Category: {article.category}</p>
                    <p>Published: {new Date(article.publishedAt).toLocaleDateString()}</p>
                    {article.featured && <span className="status">Featured</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
