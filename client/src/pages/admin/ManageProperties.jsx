import { useState, useEffect } from 'react';
import { getProperties, createProperty, updateProperty, deleteProperty } from '../../api/propertyApi';
import Modal from '../../components/Modal';
import { HiPlus, HiPencil, HiTrash, HiSearch } from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';

const initialForm = { title: '', description: '', price: '', location: '', images: '', features: '', status: 'available', propertyType: 'house', bedrooms: '', bathrooms: '', area: '' };

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      const { data } = await getProperties({ limit: 100 });
      setProperties(data.properties);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditId(null); setForm(initialForm); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ title: p.title, description: p.description, price: p.price, location: p.location, images: (p.images||[]).join(', '), features: (p.features||[]).join(', '), status: p.status, propertyType: p.propertyType || 'house', bedrooms: p.bedrooms || '', bathrooms: p.bathrooms || '', area: p.area || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, price: Number(form.price), bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0, area: Number(form.area) || 0, images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [], features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [] };
    try {
      if (editId) { await updateProperty(editId, payload); toast.success('Property updated'); }
      else { await createProperty(payload); toast.success('Property created'); }
      setModalOpen(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try { await deleteProperty(id); toast.success('Deleted'); fetchAll(); } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <Toaster position="top-right" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9' }}>Manage Properties</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{properties.length} total properties</p>
        </div>
        <button className="btn-primary" onClick={openCreate}><HiPlus /> Add Property</button>
      </div>

      <div className="table-container">
        <table>
          <thead><tr><th>Title</th><th>Location</th><th>Price</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {properties.map(p => (
              <tr key={p._id}>
                <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{p.title}</td>
                <td style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.location}</td>
                <td style={{ fontWeight: 600 }}>${p.price?.toLocaleString()}</td>
                <td style={{ textTransform: 'capitalize' }}>{p.propertyType}</td>
                <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openEdit(p)}><HiPencil /></button>
                    <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(p._id)}><HiTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No properties found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Property' : 'Add Property'} maxWidth={640}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="input-field" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input-field" placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <select className="input-field" value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })}>
              <option value="house">House</option><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="commercial">Commercial</option><option value="land">Land</option>
            </select>
            <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="available">Available</option><option value="sold">Sold</option><option value="pending">Pending</option>
            </select>
            <input className="input-field" placeholder="Area (sqft)" type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input-field" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
            <input className="input-field" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
          </div>
          <input className="input-field" placeholder="Image URLs (comma separated)" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
          <input className="input-field" placeholder="Features (comma separated)" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} />
          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {submitting ? 'Saving...' : editId ? 'Update Property' : 'Create Property'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProperties;
