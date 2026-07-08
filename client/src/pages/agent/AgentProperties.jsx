import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import { HiHome, HiPlusCircle, HiPencil, HiTrash, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload';

const AgentProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', location: '', city: '', propertyType: 'flat', purpose: 'sale', bedrooms: 0, bathrooms: 0, area: 0, category: 'House', images: '' });

  const fetchProperties = async () => {
    try {
      const { data } = await API.get('/properties/my/properties');
      setProperties(data.properties || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area), images: form.images ? form.images.split(',').map(s => s.trim()) : [] };
    try {
      if (editId) {
        await API.put(`/properties/${editId}`, payload);
        toast.success('Property updated!');
      } else {
        await API.post('/properties', payload);
        toast.success('Property added!');
      }
      setShowForm(false); setEditId(null);
      setForm({ title: '', description: '', price: '', location: '', city: '', propertyType: 'flat', purpose: 'sale', bedrooms: 0, bathrooms: 0, area: 0, category: 'House', images: '' });
      fetchProperties();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({ title: p.title, description: p.description, price: p.price, location: p.location, city: p.city || '', propertyType: p.propertyType, purpose: p.purpose, bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area, category: p.category || 'House', images: (p.images || []).join(', ') });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await API.delete(`/properties/${id}`);
      toast.success('Property deleted');
      fetchProperties();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const inp = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none', fontSize: '0.9rem' };
  const lbl = { display: 'block', color: '#94a3b8', fontSize: '0.78rem', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit' }}>Manage Properties</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: '', description: '', price: '', location: '', city: '', propertyType: 'flat', purpose: 'sale', bedrooms: 0, bathrooms: 0, area: 0, category: 'House', images: '' }); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg,#10b981,#3b82f6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
          <HiPlusCircle /> {showForm ? 'Cancel' : 'Add Property'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28, marginBottom: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Title</label><input style={inp} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div style={{ gridColumn: '1/-1' }}><label style={lbl}>Description</label><textarea style={{ ...inp, minHeight: 80 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
          <div><label style={lbl}>Price (₹)</label><input type="number" style={inp} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
          <div><label style={lbl}>Location</label><input style={inp} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required /></div>
          <div><label style={lbl}>City</label><input style={inp} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
          <div><label style={lbl}>Type</label><select style={inp} value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>{['flat','house','villa','plot','apartment','commercial','land'].map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div><label style={lbl}>Purpose</label><select style={inp} value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}><option value="sale">Sale</option><option value="rent">Rent</option></select></div>
          <div><label style={lbl}>Bedrooms</label><input type="number" style={inp} value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} /></div>
          <div><label style={lbl}>Bathrooms</label><input type="number" style={inp} value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} /></div>
          <div><label style={lbl}>Area (sqft)</label><input type="number" style={inp} value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} /></div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={lbl}>Property Images</label>
            <ImageUpload onUploadSuccess={(urls) => setForm({ ...form, images: urls.join(', ') })} />
            {form.images && (
              <div style={{ marginTop: 8, color: '#10b981', fontSize: '0.85rem' }}>Images uploaded! URLs: {form.images.substring(0, 50)}...</div>
            )}
          </div>
          <div style={{ gridColumn: '1/-1' }}><button type="submit" style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{editId ? 'Update Property' : 'Add Property'}</button></div>
        </form>
      )}

      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <HiHome style={{ fontSize: '3rem', color: '#475569', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8' }}>No properties yet. Click "Add Property" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {properties.map(p => (
            <div key={p._id} style={{ display: 'flex', gap: 16, padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', flexWrap: 'wrap' }}>
              <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=130&fit=crop'} alt="" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 180 }}>
                <h3 style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{p.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '2px 0' }}>{p.location} • ₹{p.price?.toLocaleString()}</p>
                <span style={{ fontSize: '0.7rem', color: '#06b6d4' }}><HiEye style={{ verticalAlign: 'middle' }} /> {p.views} views</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(p)} style={{ padding: '8px 14px', background: 'rgba(99,102,241,0.15)', border: 'none', borderRadius: 10, color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}><HiPencil /> Edit</button>
                <button onClick={() => handleDelete(p._id)} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 10, color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}><HiTrash /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AgentProperties;
