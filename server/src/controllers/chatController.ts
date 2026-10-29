import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, headline: true } },
        receiver: { select: { id: true, name: true, avatar: true, headline: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const conversationMap = new Map<string, any>();

    for (const msg of messages) {
      const partner = msg.senderId === currentUserId ? msg.receiver : msg.sender;
      if (!conversationMap.has(partner.id)) {
        conversationMap.set(partner.id, {
          partner,
          lastMessage: msg,
          unreadCount: msg.receiverId === currentUserId && !msg.read ? 1 : 0,
        });
      } else if (msg.receiverId === currentUserId && !msg.read) {
        const item = conversationMap.get(partner.id);
        item.unreadCount += 1;
      }
    }

    res.json(Array.from(conversationMap.values()));
  } catch (error: any) {
    console.error('getConversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getMessagesWithUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { partnerId } = req.params;

    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: partnerId },
          { senderId: partnerId, receiverId: currentUserId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark unread messages as read
    await prisma.chatMessage.updateMany({
      where: {
        senderId: partnerId,
        receiverId: currentUserId,
        read: false,
      },
      data: { read: true },
    });

    res.json(messages);
  } catch (error: any) {
    console.error('getMessages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const senderId = req.user!.id;
    const { receiverId, content, sessionId, attachmentUrl, fileName } = req.body;

    if (!receiverId || (!content && !attachmentUrl)) {
      res.status(400).json({ error: 'Receiver and content or attachment are required' });
      return;
    }

    const message = await prisma.chatMessage.create({
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

    res.status(201).json(message);
  } catch (error: any) {
    console.error('sendMessage error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
