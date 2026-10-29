import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getCircles = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const circles = await prisma.learningCircle.findMany({
      include: {
        creator: {
          select: { id: true, name: true, avatar: true, headline: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(circles);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch learning circles' });
  }
};

export const createCircle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const creatorId = req.user!.id;
    const { title, topic, category, goalDescription, meetingSchedule } = req.body;

    if (!title || !topic || !goalDescription) {
      res.status(400).json({ error: 'Title, topic, and goal description are required' });
      return;
    }

    const circle = await prisma.learningCircle.create({
      data: {
        creatorId,
        title,
        topic,
        category: category || 'Study Group',
        goalDescription,
        meetingSchedule: meetingSchedule || 'Every Saturday 4:00 PM',
        members: {
          create: {
            userId: creatorId,
          },
        },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    res.status(201).json(circle);
  } catch (error: any) {
    console.error('createCircle error:', error);
    res.status(500).json({ error: 'Failed to create learning circle' });
  }
};

export const joinCircle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = await prisma.circleMember.findUnique({
      where: {
        circleId_userId: {
          circleId: id,
          userId,
        },
      },
    });

    if (existing) {
      res.status(400).json({ error: 'Already a member of this learning circle' });
      return;
    }

    await prisma.circleMember.create({
      data: {
        circleId: id,
        userId,
      },
    });

    res.json({ message: 'Successfully joined learning circle!' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to join circle' });
  }
};
