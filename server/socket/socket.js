const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*', // Adjust to your frontend URL in production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join a specific chat room
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Handle new message
    socket.on('new_message', (newMessageReceived) => {
      let chat = newMessageReceived.chatId; // Assume frontend sends the chatId
      
      if (!chat) return console.log('ChatId not defined in new_message');

      // Emit to everyone in the room except the sender
      socket.in(chat).emit('message_received', newMessageReceived);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
