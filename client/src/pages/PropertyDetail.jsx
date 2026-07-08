import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getProperty } from '../api/propertyApi';
import { createBooking } from '../api/bookingApi';
import { accessChat } from '../api/chatApi';
import API from '../api/axios';
import { HiLocationMarker, HiCheckCircle, HiPhone, HiMail, HiChat } from 'react-icons/hi';
import { IoBedOutline, IoWaterOutline } from 'react-icons/io5';
import { TbRulerMeasure } from 'react-icons/tb';
import toast, { Toaster } from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user, token } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProperty(id);
        setProperty(data.property);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
  }, [user]);

  const initPayment = async (bookingId) => {
    try {
      const { data: orderData } = await API.post('/payment/create-order', { amount: 500, bookingId });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Realstate Booking',
        description: 'Site Visit Booking Fee',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', { ...response, bookingId });
            toast.success('Payment successful! Booking confirmed.');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: form.phone },
        theme: { color: '#6366f1' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Could not initiate payment');
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to submit an inquiry');
    setSubmitting(true);
    try {
      const { data } = await createBooking({ property: id, ...form });
      toast.success('Inquiry submitted. Initiating payment...');
      setForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
      initPayment(data.booking._id);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); } finally { setSubmitting(false); }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) return toast.error('Please login to chat with agent');
    try {
      await accessChat(property.postedBy._id, property._id);
      const chatPath = user?.role === 'admin' ? '/admin/chats' : user?.role === 'agent' ? '/agent/messages' : '/dashboard/messages';
      navigate(chatPath);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 120 }}><div className="loader"></div></div>;
  if (!property) return <div style={{ textAlign: 'center', padding: 120, color: '#94a3b8' }}>Property not found</div>;

  const placeholder = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop';
  const images = property.images?.length > 0 ? property.images : [placeholder];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px' }}>
      <Toaster position="top-right" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }} className="property-grid">
        {/* Left Column */}
        <div className="animate-fade-in">
          {/* Image Gallery */}
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
            <img src={images[activeImg]} alt={property.title} style={{ width: '100%', height: 440, objectFit: 'cover' }} onError={e => { e.target.src = placeholder; }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{ width: 80, height: 60, borderRadius: 10, objectFit: 'cover', cursor: 'pointer', border: i === activeImg ? '2px solid #6366f1' : '2px solid transparent', opacity: i === activeImg ? 1 : 0.6, transition: 'all 0.2s' }} />
              ))}
            </div>
          )}

          {/* Details */}
          <div className="glass" style={{ padding: '28px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className={`badge badge-${property.status}`}>{property.status}</span>
              <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', textTransform: 'capitalize' }}>{property.propertyType}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Outfit', color: '#f1f5f9', marginBottom: 8 }}>{property.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', marginBottom: 16 }}>
              <HiLocationMarker style={{ color: '#6366f1' }} /> {property.location}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: 24 }} className="gradient-text">${property.price?.toLocaleString()}</div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
              {property.bedrooms > 0 && <Stat icon={<IoBedOutline />} value={property.bedrooms} label="Bedrooms" color="#8b5cf6" />}
              {property.bathrooms > 0 && <Stat icon={<IoWaterOutline />} value={property.bathrooms} label="Bathrooms" color="#06b6d4" />}
              {property.area > 0 && <Stat icon={<TbRulerMeasure />} value={property.area} label="Sq Ft" color="#10b981" />}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: 12 }}>Description</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.95rem' }}>{property.description}</p>

            {property.features?.length > 0 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginTop: 24, marginBottom: 12 }}>Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                  {property.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#cbd5e1', fontSize: '0.9rem' }}>
                      <HiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column — Inquiry Form */}
        <div className="glass animate-slide-right" style={{ padding: '28px 24px', position: 'sticky', top: 100 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'Outfit', color: '#f1f5f9', marginBottom: 20 }}>Make an Inquiry</h3>
          <form onSubmit={handleInquiry} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input className="input-field" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="input-field" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
            <textarea className="input-field" placeholder="Message (optional)" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} style={{ resize: 'vertical' }} />
            <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Processing...' : 'Pay ₹500 & Book Visit'}
            </button>
          </form>

          {property.postedBy?._id !== user?._id && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={handleStartChat} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                <HiChat style={{ color: '#6366f1', fontSize: '1.2rem' }} /> Chat with Agent
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:900px){.property-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
};

const Stat = ({ icon, value, label, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '1.3rem', color, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e2e8f0' }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{label}</div>
  </div>
);

export default PropertyDetail;
