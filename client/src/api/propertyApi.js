import API from './axios';

export const getProperties = (params = {}) => API.get('/properties', { params });

export const getProperty = (id) => API.get(`/properties/${id}`);

export const createProperty = (data) => API.post('/properties', data);

export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);

export const deleteProperty = (id) => API.delete(`/properties/${id}`);
