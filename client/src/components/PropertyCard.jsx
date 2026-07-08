import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyDollar } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    price,
    location,
    images,
    status,
    propertyType,
    bedrooms,
    bathrooms,
    area,
  } = property;

  const statusColors = {
    available: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: 'rgba(6,182,212,0.3)' },
    sold: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  };

  const sColor = statusColors[status] || statusColors.available;

  const placeholder = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop';

  return (
    <Link to={`/property/${_id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img
            src={images?.[0] || placeholder}
            alt={title}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onError={e => { e.target.src = placeholder; }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 50%)' }} />

          {/* Status badge */}
          <span style={{
            position: 'absolute', top: 14, right: 14,
            padding: '5px 14px', borderRadius: 20,
            fontSize: '0.7rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            background: sColor.bg, color: sColor.color,
            border: `1px solid ${sColor.border}`,
            backdropFilter: 'blur(8px)',
          }}>
            {status}
          </span>

          {/* Property type */}
          <span style={{
            position: 'absolute', top: 14, left: 14,
            padding: '5px 14px', borderRadius: 20,
            fontSize: '0.7rem', fontWeight: 600,
            textTransform: 'capitalize',
            background: 'rgba(0,0,0,0.5)', color: '#e2e8f0',
            backdropFilter: 'blur(8px)',
          }}>
            {propertyType}
          </span>

          {/* Price */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{
              fontSize: '1.4rem', fontWeight: 800,
              fontFamily: 'Outfit, sans-serif', color: '#fff',
            }}>
              ${price?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px 22px' }}>
          <h3 style={{
            fontSize: '1.05rem', fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            color: '#e2e8f0', marginBottom: 8,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </h3>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: '#94a3b8', fontSize: '0.85rem', marginBottom: 16,
          }}>
            <HiLocationMarker style={{ color: '#6366f1', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</span>
          </div>

          {/* Features */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {bedrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.82rem' }}>
                <IoBedOutline style={{ fontSize: '1.1rem', color: '#8b5cf6' }} />
                {bedrooms} Bed{bedrooms > 1 ? 's' : ''}
              </div>
            )}
            {bathrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.82rem' }}>
                <IoWaterOutline style={{ fontSize: '1.1rem', color: '#06b6d4' }} />
                {bathrooms} Bath{bathrooms > 1 ? 's' : ''}
              </div>
            )}
            {area > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.82rem' }}>
                <TbRulerMeasure style={{ fontSize: '1.1rem', color: '#10b981' }} />
                {area} sqft
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
