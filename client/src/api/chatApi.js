import API from './axios';

export const getChats = () => API.get('/chats');
export const accessChat = (agentId, propertyId) => API.post('/chats', { agentId, propertyId });
export const getMessages = (chatId) => API.get(`/chats/${chatId}/messages`);
export const sendMessage = (chatId, text) => API.post(`/chats/${chatId}/messages`, { text });
