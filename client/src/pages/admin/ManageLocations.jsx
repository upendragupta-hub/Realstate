import { useState, useEffect } from 'react';
import { getLocations, createLocation, deleteLocation } from '../../api/adminApi';
import { HiPlus, HiTrash, HiLocationMarker } from 'react-icons/hi';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLoc, setNewLoc] = useState({ city: '', state: '' });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await getLocations();
      setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createLocation(newLoc);
      setShowModal(false);
      setNewLoc({ city: '', state: '' });
      fetchLocations();
    } catch (error) {
      alert('Failed to create location');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteLocation(id);
        fetchLocations();
      } catch (error) {
        alert('Failed to delete location');
      }
    }
  };

  if (loading) return <div style={{ color: '#e2e8f0' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>Manage Locations</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600
          }}
        >
          <HiPlus /> Add Location
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {locations.map((loc) => (
          <div key={loc._id} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            position: 'relative'
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12, background: 'rgba(16,185,129,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
              color: '#34d399'
            }}>
              <HiLocationMarker />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>{loc.city}</h3>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{loc.state}</p>
            </div>
            <button
              onClick={() => handleDelete(loc._id)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'transparent', color: '#64748b', border: 'none',
                cursor: 'pointer', padding: 4
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            ><HiTrash size={18}/></button>
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
            <h3 style={{ marginTop: 0, color: '#f8fafc', fontSize: '1.4rem', marginBottom: 20 }}>Add Location</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>City</label>
                <input
                  type="text" required
                  value={newLoc.city}
                  onChange={(e) => setNewLoc({ ...newLoc, city: e.target.value })}
                  style={{
                    width: '100%', padding: 12, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', outline: 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.9rem' }}>State</label>
                <input
                  type="text" required
                  value={newLoc.state}
                  onChange={(e) => setNewLoc({ ...newLoc, state: e.target.value })}
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
                  flex: 1, padding: 12, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
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

export default ManageLocations;
