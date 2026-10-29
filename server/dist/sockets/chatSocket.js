"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatSocket = void 0;
const prisma_js_1 = require("../prisma.js");
const setupChatSocket = (io) => {
    const onlineUsers = {};
    io.on('connection', (socket) => {
        // User registers their presence
        socket.on('register_user', (userId) => {
            if (userId) {
                onlineUsers[userId] = socket.id;
                io.emit('online_users', Object.keys(onlineUsers));
            }
        });
        // Join specific session room if desired
        socket.on('join_session_room', (sessionId) => {
            socket.join(`session_${sessionId}`);
        });
        // Real-time message sent
        socket.on('send_direct_message', async (data) => {
            try {
                const { senderId, receiverId, sessionId, content, attachmentUrl, fileName } = data;
                const newMsg = await prisma_js_1.prisma.chatMessage.create({
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
            }
            catch (err) {
                console.error('Socket message error:', err);
            }
        });
        // Typing indicator
        socket.on('typing', ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('user_typing', { userId: senderId });
            }
        });
        socket.on('stop_typing', ({ senderId, receiverId }) => {
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
exports.setupChatSocket = setupChatSocket;
