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
        // Disassociate any previous user previously tied to this socket
        for (const [uid, sid] of Object.entries(onlineUsers)) {
          if (sid === socket.id && uid !== userId) {
            delete onlineUsers[uid];
          }
        }
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

        // 1. Emit to the sender socket
        socket.emit('new_message', newMsg);

        // 2. Emit to receiver if online and on a different socket
        const receiverSocketId = onlineUsers[receiverId];
        if (receiverSocketId && receiverSocketId !== socket.id) {
          io.to(receiverSocketId).emit('new_message', newMsg);
        }
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    // Typing indicator
    socket.on('typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId && receiverSocketId !== socket.id) {
        io.to(receiverSocketId).emit('user_typing', { userId: senderId });
      }
    });

    socket.on('stop_typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId && receiverSocketId !== socket.id) {
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
