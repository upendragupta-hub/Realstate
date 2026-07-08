import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api/adminApi';
import { HiPlus, HiTrash, HiCollection } from 'react-icons/hi';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', icon: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCat);
      setShowModal(false);
      setNewCat({ name: '', icon: '' });
      fetchCategories();
    } catch (error) {
      alert('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        alert('Failed to delete category');
      }
    }
  };

  if (loading) return <div style={{ color: '#e2e8f0' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>Manage Categories</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600
          }}
        >
          <HiPlus /> Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {categories.map((cat) => (
          <div key={cat._id} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => handleDelete(cat._id)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            ><HiTrash /></button>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(99,102,241,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
              color: '#818cf8', marginBottom: 16
            }}>
              <HiCollection />
            </div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem' }}>{cat.name}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Slug: {cat.slug}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b', padding: 32, borderRadius: 20, width: 400,
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ marginTop: 0, color: '#f8fafc', fontSize: '1.4rem', marginBottom: 20 }}>Add Category</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>Name</label>
                <input
                  type="text" required
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  style={{
                    width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: 12, background: 'rgba(255,255,255,0.05)', color: '#e2e8f0',
                  border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600
                }}>Cancel</button>
                <button type="submit" style={{
                  flex: 1, padding: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600
                }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
