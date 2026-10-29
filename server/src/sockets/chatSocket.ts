import { Server, Socket } from 'socket.io';
import { prisma } from '../prisma.js';

interface UserSocketMap {
  [userId: string]: string; // userId -> socketId
}

export const setupChatSocket = (io: Server) => {
  const onlineUsers: UserSocketMap = {};

  io.on('connection', (socket: Socket) => {
    // User registers their presence
    socket.on('register_user', (userId: string) => {
      if (userId) {
        onlineUsers[userId] = socket.id;
        io.emit('online_users', Object.keys(onlineUsers));
      }
    });

    // Join specific session room if desired
    socket.on('join_session_room', (sessionId: string) => {
      socket.join(`session_${sessionId}`);
    });

    // Real-time message sent
    socket.on('send_direct_message', async (data: {
      senderId: string;
      receiverId: string;
      sessionId?: string;
      content: string;
      attachmentUrl?: string;
      fileName?: string;
    }) => {
      try {
        const { senderId, receiverId, sessionId, content, attachmentUrl, fileName } = data;

        const newMsg = await prisma.chatMessage.create({
          data: {
            senderId,
            receiverId,
            sessionId: sessionId || null,
            content: content || '',
            attachmentUrl: attachmentUrl || null,
            fileName: fileName || null,
          },
          include: {
            sender: { select: { id: true, name: true, avatar: true } },
          },
        });

        // Emit to sender
        socket.emit('new_message', newMsg);

        // Emit to receiver if online
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', newMsg);
        }

        // Also broadcast to session room if attached
        if (sessionId) {
          socket.to(`session_${sessionId}`).emit('new_message', newMsg);
        }
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    // Typing indicator
    socket.on('typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId: senderId });
      }
    });

    socket.on('stop_typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', { userId: senderId });
      }
    });

    socket.on('disconnect', () => {
      for (const [uid, sid] of Object.entries(onlineUsers)) {
        if (sid === socket.id) {
          delete onlineUsers[uid];
          break;
        }
      }
      io.emit('online_users', Object.keys(onlineUsers));
    });
  });
};
