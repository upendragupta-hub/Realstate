const StatsCard = ({ icon, label, value, color, delay = 0 }) => {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 20,
        padding: '28px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        transition: 'all 0.3s ease',
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '40';
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}15`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', color,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '2rem', fontWeight: 800,
          fontFamily: 'Outfit, sans-serif',
          color: '#f1f5f9',
          lineHeight: 1,
          marginBottom: 4,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '0.82rem', fontWeight: 500,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
