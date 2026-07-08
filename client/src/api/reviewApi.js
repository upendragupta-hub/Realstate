import API from './axios';

export const createReview = (data) => API.post('/reviews', data);
export const getPropertyReviews = (propertyId) => API.get(`/reviews/property/${propertyId}`);
export const getAllReviews = () => API.get('/reviews');
export const approveReview = (id) => API.put(`/reviews/${id}/approve`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
