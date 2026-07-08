import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 24px 30px',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 40,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 800, color: '#fff',
            }}>R</div>
            <span style={{
              fontSize: '1.3rem', fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #818cf8, #22d3ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Realstate</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 300 }}>
            Your trusted partner in finding the perfect property. We make real estate simple, transparent, and accessible.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#e2e8f0', marginBottom: 16, fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/listings', label: 'Browse Properties' },
              { to: '/login', label: 'Login' },
              { to: '/register', label: 'Register' },
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#818cf8'}
                onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#e2e8f0', marginBottom: 16, fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiMail style={{ color: '#6366f1', fontSize: '1.1rem' }} />
              contact@realstate.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiPhone style={{ color: '#6366f1', fontSize: '1.1rem' }} />
              +1 (555) 123-4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#94a3b8', fontSize: '0.9rem' }}>
              <HiLocationMarker style={{ color: '#6366f1', fontSize: '1.1rem' }} />
              123 Property Lane, Real City
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem',
      }}>
        © {new Date().getFullYear()} Realstate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
