import API from './axios';

export const getStats = () => API.get('/admin/stats');
export const getUsers = () => API.get('/admin/users');
export const updateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Locations CRUD
export const getLocations = () => API.get('/admin/locations');
export const createLocation = (data) => API.post('/admin/locations', data);
export const deleteLocation = (id) => API.delete(`/admin/locations/${id}`);

// Categories CRUD
export const getCategories = () => API.get('/admin/categories');
export const createCategory = (data) => API.post('/admin/categories', data);
export const deleteCategory = (id) => API.delete(`/admin/categories/${id}`);
