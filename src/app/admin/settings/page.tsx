'use client';

import { useEffect, useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

interface SocialLink { platform: string; label: string; url: string; iconClass?: string }
interface TeamMember { name: string; role: string; image?: string; bio?: string }

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [featuredPlaylist, setFeaturedPlaylist] = useState<any>({ title: '', description: '', playlistUrl: '', items: [] as { title: string; thumbnail: string; youtubeId: string }[] });
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLines, setAddressLines] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { notify } = useToast();
  const iconOptions = [
    { value: 'fab fa-youtube', label: 'YouTube' },
    { value: 'fab fa-instagram', label: 'Instagram' },
    { value: 'fab fa-twitter', label: 'Twitter/X' },
    { value: 'fab fa-tiktok', label: 'TikTok' },
    { value: 'fab fa-facebook', label: 'Facebook' },
    { value: 'fab fa-linkedin', label: 'LinkedIn' },
    { value: 'fas fa-globe', label: 'Website' },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      setSocialLinks(data?.socialLinks || []);
      setTeam(data?.team || []);
      setFeaturedPlaylist(data?.featuredPlaylist || { title: '', description: '', playlistUrl: '', items: [] });
      setHeadline(data?.getInTouch?.headline || '');
      setDescription(data?.getInTouch?.description || '');
      setEmail(data?.getInTouch?.email || '');
      setPhone(data?.getInTouch?.phone || '');
      setAddressLines(data?.getInTouch?.addressLines || []);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ socialLinks, team, featuredPlaylist, getInTouch: { headline, description, email, phone, addressLines } }) });
      if (!res.ok) throw new Error('Failed to save');
      setMessage('Saved successfully');
      notify('Settings saved', 'success');
    } catch (e: any) {
      setMessage(e.message || 'Save failed');
      notify(e.message || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const saveSocialLinks = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ socialLinks }) });
      if (!res.ok) throw new Error('Failed to save social links');
      setMessage('Social links saved');
      notify('Social links saved', 'success');
    } catch (e: any) { setMessage(e.message || 'Save failed'); } finally { setSaving(false); }
  };

  const saveTeam = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ team }) });
      if (!res.ok) throw new Error('Failed to save team');
      setMessage('Team saved');
      notify('Team saved', 'success');
    } catch (e: any) { setMessage(e.message || 'Save failed'); } finally { setSaving(false); }
  };

  const saveGetInTouch = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ getInTouch: { headline, description, email, phone, addressLines } }) });
      if (!res.ok) throw new Error('Failed to save get in touch');
      setMessage('Get in Touch saved');
      notify('Get in Touch saved', 'success');
    } catch (e: any) { setMessage(e.message || 'Save failed'); } finally { setSaving(false); }
  };

  const saveFeaturedPlaylist = async () => {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featuredPlaylist }) });
      if (!res.ok) throw new Error('Failed to save playlist');
      setMessage('Featured playlist saved');
      notify('Featured playlist saved', 'success');
    } catch (e: any) { setMessage(e.message || 'Save failed'); } finally { setSaving(false); }
  };

  if (loading || !user) return null;

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
      <h1 className="page-title">Site Settings</h1>
      <section style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: 10, boxShadow: 'var(--shadow)' }}>
        <h2>Featured Playlist</h2>
        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input value={featuredPlaylist.title} onChange={(e)=> setFeaturedPlaylist({ ...featuredPlaylist, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Playlist URL (YouTube)</label>
            <input value={featuredPlaylist.playlistUrl} onChange={(e)=> setFeaturedPlaylist({ ...featuredPlaylist, playlistUrl: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows={3} value={featuredPlaylist.description} onChange={(e)=> setFeaturedPlaylist({ ...featuredPlaylist, description: e.target.value })} />
        </div>
        <h3>Preview Items (optional)</h3>
        {(featuredPlaylist.items || []).map((item: any, idx: number) => (
          <div key={idx} className="form-row" style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input placeholder="Title" value={item.title} onChange={(e)=>{
              const next = { ...featuredPlaylist };
              next.items[idx] = { ...next.items[idx], title: e.target.value };
              setFeaturedPlaylist(next);
            }} />
            <input placeholder="Thumbnail URL" value={item.thumbnail} onChange={(e)=>{
              const next = { ...featuredPlaylist };
              next.items[idx] = { ...next.items[idx], thumbnail: e.target.value };
              setFeaturedPlaylist(next);
            }} />
            <input placeholder="YouTube ID" value={item.youtubeId} onChange={(e)=>{
              const next = { ...featuredPlaylist };
              next.items[idx] = { ...next.items[idx], youtubeId: e.target.value };
              setFeaturedPlaylist(next);
            }} />
            <button className="btn btn-small btn-outline" onClick={()=>{
              const next = { ...featuredPlaylist };
              next.items = next.items.filter((_: any, i: number)=> i!==idx);
              setFeaturedPlaylist(next);
            }}>Remove</button>
          </div>
        ))}
        <button className="btn btn-outline" onClick={()=> setFeaturedPlaylist({ ...featuredPlaylist, items: [...(featuredPlaylist.items||[]), { title: '', thumbnail: '', youtubeId: '' }] })}>Add Playlist Item</button>
        <div style={{ marginTop: '0.75rem' }}>
          <button className="btn btn-primary" onClick={saveFeaturedPlaylist} disabled={saving}>{saving ? 'Saving...' : 'Save Playlist'}</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: 10, boxShadow: 'var(--shadow)' }}>
        <h2>Social Links</h2>
        {socialLinks.map((link, idx) => (
          <div key={idx} className="form-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr 1.5fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input placeholder="Platform (e.g., youtube)" value={link.platform} onChange={(e) => { const n=[...socialLinks]; n[idx]={...n[idx], platform:e.target.value}; setSocialLinks(n); }} />
            <input placeholder="Label" value={link.label} onChange={(e) => { const n=[...socialLinks]; n[idx]={...n[idx], label:e.target.value}; setSocialLinks(n); }} />
            <input placeholder="URL" value={link.url} onChange={(e) => { const n=[...socialLinks]; n[idx]={...n[idx], url:e.target.value}; setSocialLinks(n); }} />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                className="filter-select"
                value={link.iconClass || ''}
                onChange={(e) => { const n=[...socialLinks]; n[idx]={...n[idx], iconClass:e.target.value}; setSocialLinks(n); }}
                style={{ width: '100%' }}
              >
                <option value="">Select icon…</option>
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div title="Preview" style={{ width: 36, height: 36, border: '2px solid var(--light-gray)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={(link.iconClass || 'fas fa-question')} style={{ fontSize: 18 }}></i>
              </div>
            </div>
            <button className="btn btn-small btn-outline" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i!==idx))}>Remove</button>
          </div>
        ))}
        <button className="btn btn-outline" onClick={() => setSocialLinks([...socialLinks, { platform: '', label: '', url: '', iconClass: '' }])}>Add Social Link</button>
        <div style={{ marginTop: '0.75rem' }}>
          <button className="btn btn-primary" onClick={saveSocialLinks} disabled={saving}>{saving ? 'Saving...' : 'Save Social Links'}</button>
        </div>
        
      </section>

      <section style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: 10, boxShadow: 'var(--shadow)' }}>
        <h2>Team</h2>
        {team.map((member, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 2fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input placeholder="Name" value={member.name} onChange={(e)=>{ const n=[...team]; n[idx]={...n[idx], name:e.target.value}; setTeam(n); }} />
            <input placeholder="Role" value={member.role} onChange={(e)=>{ const n=[...team]; n[idx]={...n[idx], role:e.target.value}; setTeam(n); }} />
            <div>
              <ImageUpload
                label="Photo"
                folder="team"
                currentImage={member.image}
                onImageUpload={(url)=>{ const n=[...team]; n[idx]={...n[idx], image:url}; setTeam(n); }}
              />
            </div>
            <input placeholder="Bio" value={member.bio || ''} onChange={(e)=>{ const n=[...team]; n[idx]={...n[idx], bio:e.target.value}; setTeam(n); }} />
            <button className="btn btn-small btn-outline" onClick={() => setTeam(team.filter((_,i)=>i!==idx))}>Remove</button>
          </div>
        ))}
        <button className="btn btn-outline" onClick={() => setTeam([...team, { name: '', role: '' }])}>Add Team Member</button>
        <div style={{ marginTop: '0.75rem' }}>
          <button className="btn btn-primary" onClick={saveTeam} disabled={saving}>{saving ? 'Saving...' : 'Save Team'}</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: 10, boxShadow: 'var(--shadow)' }}>
        <h2>Get in Touch</h2>
        <div className="form-group"><label>Headline</label><input value={headline} onChange={(e)=>setHeadline(e.target.value)} /></div>
        <div className="form-group"><label>Description</label><input value={description} onChange={(e)=>setDescription(e.target.value)} /></div>
        <div className="form-group"><label>Email</label><input value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        <div className="form-group"><label>Phone</label><input value={phone} onChange={(e)=>setPhone(e.target.value)} /></div>
        <div className="form-group">
          <label>Address Lines</label>
          {addressLines.map((line, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input value={line} onChange={(e)=>{ const n=[...addressLines]; n[idx]=e.target.value; setAddressLines(n); }} />
              <button className="btn btn-small btn-outline" onClick={()=> setAddressLines(addressLines.filter((_,i)=>i!==idx))}>Remove</button>
            </div>
          ))}
          <button className="btn btn-outline" onClick={()=> setAddressLines([...(addressLines||[]), ''])}>Add Address Line</button>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <button className="btn btn-primary" onClick={saveGetInTouch} disabled={saving}>{saving ? 'Saving...' : 'Save Get in Touch'}</button>
        </div>
      </section>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {message && <span>{message}</span>}
      </div>
    </div>
  );
}


