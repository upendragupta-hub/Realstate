import API from './axios';

export const createMessage = (data) => API.post('/contacts', data);
export const getMessages = () => API.get('/contacts');
export const replyMessage = (id, replyMessage) => API.post(`/contacts/${id}/reply`, { replyMessage });
export const deleteMessage = (id) => API.delete(`/contacts/${id}`);
