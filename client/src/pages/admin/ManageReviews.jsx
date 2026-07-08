import { useState, useEffect } from 'react';
import { getAllReviews, approveReview, deleteReview } from '../../api/reviewApi';
import { HiStar, HiCheckCircle, HiTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await getAllReviews();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      fetchReviews();
    } catch (error) {
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(id);
        fetchReviews();
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  if (loading) return <div style={{ color: '#e2e8f0' }}>Loading reviews...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Manage Reviews</h2>

      <div style={{ display: 'grid', gap: 20 }}>
        {reviews.map((review) => (
          <div key={review._id} style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)',
            padding: 24, position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    {[...Array(5)].map((_, i) => (
                      <HiStar key={i} color={i < review.rating ? '#fbbf24' : '#475569'} size={20} />
                    ))}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>by <b>{review.name}</b></span>
                </div>
                {review.property && (
                  <Link to={`/properties/${review.property._id}`} style={{ color: '#818cf8', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600 }}>
                    For Property: {review.property.title}
                  </Link>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review._id)}
                    style={{
                      background: 'rgba(16,185,129,0.1)', color: '#34d399',
                      border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600
                    }}
                  ><HiCheckCircle size={18}/> Approve</button>
                )}
                {review.approved && (
                  <span style={{
                    background: 'rgba(34,197,94,0.1)', color: '#4ade80',
                    padding: '8px 12px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <HiCheckCircle size={18}/> Approved
                  </span>
                )}
                <button
                  onClick={() => handleDelete(review._id)}
                  style={{
                    background: 'rgba(239,68,68,0.1)', color: '#f87171',
                    border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                  }}
                ><HiTrash size={18}/></button>
              </div>
            </div>
            
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, margin: 0, marginTop: 12 }}>
              "{review.comment}"
            </p>
            <div style={{ marginTop: 16, color: '#64748b', fontSize: '0.8rem' }}>
              Submitted on: {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>No reviews found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
