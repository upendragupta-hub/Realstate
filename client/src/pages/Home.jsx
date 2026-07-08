import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../api/propertyApi';
import PropertyCard from '../components/PropertyCard';
import { HiArrowRight, HiSearch, HiShieldCheck, HiCurrencyDollar, HiHome } from 'react-icons/hi';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProperties({ limit: 6, status: 'available' });
        setFeaturedProperties(data.properties);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '0 24px',
      }}>
        {/* Background effects */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />

        <div style={{
          maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1,
        }} className="animate-fade-in-up">
          <div style={{
            display: 'inline-block',
            padding: '8px 20px', borderRadius: 30,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8', fontSize: '0.82rem', fontWeight: 600,
            marginBottom: 24,
            letterSpacing: '0.05em',
          }}>
            ✨ Your Dream Home Awaits
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            fontFamily: 'Outfit, sans-serif',
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            <span style={{ color: '#f1f5f9' }}>Discover Your </span>
            <span className="gradient-text">Perfect Property</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', color: '#94a3b8',
            maxWidth: 560, margin: '0 auto 36px',
            lineHeight: 1.7,
          }}>
            Explore premium properties with stunning designs and prime locations. 
            Find your next investment or dream home with Realstate.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/listings" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <HiSearch /> Browse Properties
            </Link>
            <Link to="/register" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Get Started <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section style={{
        padding: '0 24px',
        marginTop: -40,
        position: 'relative',
        zIndex: 2,
      }}>
        <div className="glass" style={{
          maxWidth: 900, margin: '0 auto',
          padding: '32px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32,
          textAlign: 'center',
        }}>
          {[
            { value: '500+', label: 'Properties Listed' },
            { value: '200+', label: 'Happy Clients' },
            { value: '50+', label: 'Cities Covered' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: '2rem', fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section style={{ padding: '100px 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#f1f5f9',
            marginBottom: 12,
          }}>
            Why Choose <span className="gradient-text">Realstate</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            We bring transparency, trust, and technology together for the best real estate experience.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {[
            { icon: <HiShieldCheck />, title: 'Verified Listings', desc: 'Every property is verified and authenticated by our expert team before listing.', color: '#6366f1' },
            { icon: <HiCurrencyDollar />, title: 'Best Prices', desc: 'Get the most competitive prices with transparent pricing and no hidden fees.', color: '#06b6d4' },
            { icon: <HiHome />, title: 'Premium Properties', desc: 'Curated collection of premium properties in the most sought-after locations.', color: '#8b5cf6' },
          ].map((item, i) => (
            <div key={i} className="glass" style={{
              padding: '36px 28px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = item.color + '40';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: `${item.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', color: item.color,
                margin: '0 auto 20px',
              }}>{item.icon}</div>
              <h3 style={{
                fontSize: '1.15rem', fontWeight: 700,
                fontFamily: 'Outfit, sans-serif',
                color: '#e2e8f0', marginBottom: 10,
              }}>{item.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Properties ─── */}
      <section style={{ padding: '40px 24px 100px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 40, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#f1f5f9',
              marginBottom: 8,
            }}>
              Featured <span className="gradient-text">Properties</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Explore our handpicked selection of premium properties
            </p>
          </div>
          <Link to="/listings" className="btn-secondary">
            View All <HiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="loader"></div>
          </div>
        ) : featuredProperties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24,
          }}>
            {featuredProperties.map((property, i) => (
              <div key={property._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
            <HiHome style={{ fontSize: '3rem', color: '#64748b', marginBottom: 16 }} />
            <h3 style={{ color: '#e2e8f0', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>No Properties Yet</h3>
            <p style={{ color: '#94a3b8' }}>Check back soon for new listings!</p>
          </div>
        )}
      </section>

      {/* ─── CTA Section ─── */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          maxWidth: 700, margin: '0 auto', textAlign: 'center',
        }}>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#f1f5f9',
            marginBottom: 16,
          }}>
            Ready to Find Your <span className="gradient-text">Dream Home?</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of happy homeowners who found their perfect property through Realstate.
          </p>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
            Get Started Today <HiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
