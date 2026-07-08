import { useState, useEffect } from 'react';
import API from '../../api/axios';
import PropertyCard from '../../components/PropertyCard';
import { HiHome, HiPlusCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const UserProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/properties/my/properties');
        setProperties(data.properties || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 12 }}>
          <HiHome style={{ color: '#10b981' }} /> My Properties
        </h1>
      </div>
      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <HiHome style={{ fontSize: '3rem', color: '#475569', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>You haven't posted any properties yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {properties.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
      )}
    </div>
  );
};
export default UserProperties;
