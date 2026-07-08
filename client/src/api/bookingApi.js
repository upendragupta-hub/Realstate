import API from './axios';

export const createBooking = (data) => API.post('/bookings', data);

export const getMyBookings = () => API.get('/bookings/my');

export const getAllBookings = (params = {}) => API.get('/bookings', { params });

export const updateBookingStatus = (id, status) =>
  API.patch(`/bookings/${id}`, { status });
