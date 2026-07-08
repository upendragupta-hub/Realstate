import { useState, useEffect } from 'react';
import API from '../../api/axios';
import PropertyCard from '../../components/PropertyCard';
import { HiEye } from 'react-icons/hi';

const RecentlyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/properties/my/recentlyviewed');
        setProperties(data.properties || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 24, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 12 }}>
        <HiEye style={{ color: '#06b6d4' }} /> Recently Viewed
      </h1>
      {properties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <HiEye style={{ fontSize: '3rem', color: '#475569', marginBottom: 12 }} />
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>No recently viewed properties.</p>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Properties you view will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {properties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
