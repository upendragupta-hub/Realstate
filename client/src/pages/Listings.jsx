import { useState, useEffect } from 'react';
import { getProperties } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import { HiSearch, HiAdjustments, HiX } from 'react-icons/hi';

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: '', location: '', propertyType: '', minPrice: '', maxPrice: '', sort: 'newest' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await getProperties(params);
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);
  const handleSearch = (e) => { e.preventDefault(); fetchProperties(1); };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div className="animate-fade-in" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9', marginBottom: 8 }}>
          Browse <span className="gradient-text">Properties</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>{pagination.total} properties available</p>
      </div>

      <form onSubmit={handleSearch} className="glass" style={{ padding: '20px 24px', marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <HiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input className="input-field" placeholder="Search..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} style={{ paddingLeft: 42 }} />
          </div>
          <input className="input-field" placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} style={{ width: 180 }} />
          <button type="submit" className="btn-primary"><HiSearch /> Search</button>
          <button type="button" className="btn-secondary" onClick={() => setShowFilters(!showFilters)} style={{ padding: '12px 16px' }}><HiAdjustments /></button>
        </div>
        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, paddingTop: 16, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <select className="input-field" value={filters.propertyType} onChange={e => setFilters({ ...filters, propertyType: e.target.value })}>
              <option value="">All Types</option><option value="house">House</option><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="commercial">Commercial</option><option value="land">Land</option>
            </select>
            <input className="input-field" placeholder="Min Price" type="number" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
            <input className="input-field" placeholder="Max Price" type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
            <select className="input-field" value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
              <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option>
            </select>
            <button type="button" onClick={() => { setFilters({ search:'',location:'',propertyType:'',minPrice:'',maxPrice:'',sort:'newest' }); }} className="btn-secondary"><HiX /> Clear</button>
          </div>
        )}
      </form>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="loader"></div></div>
      ) : properties.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24, marginBottom: 40 }}>
            {properties.map((p, i) => (
              <div key={p._id} className="animate-fade-in-up" style={{ animationDelay: `${i*80}ms`, animationFillMode: 'backwards' }}>
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pg => (
                <button key={pg} onClick={() => fetchProperties(pg)} style={{ width: 40, height: 40, borderRadius: 10, border: pg === pagination.page ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)', background: pg === pagination.page ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)', color: pg === pagination.page ? '#818cf8' : '#94a3b8', fontWeight: 600, cursor: 'pointer' }}>{pg}</button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="glass" style={{ padding: 80, textAlign: 'center' }}>
          <HiSearch style={{ fontSize: '3rem', color: '#64748b', marginBottom: 16 }} />
          <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit' }}>No Properties Found</h3>
        </div>
      )}
    </div>
  );
};

export default Listings;
