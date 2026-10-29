import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getWorkshops = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workshops = await prisma.workshop.findMany({
      include: {
        host: {
          select: { id: true, name: true, avatar: true, headline: true },
        },
        enrollments: {
          select: { userId: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json(workshops);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch workshops' });
  }
};

export const createWorkshop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const hostId = req.user!.id;
    const { title, description, category, scheduledAt, durationMinutes, maxParticipants, creditCost, meetingLink } =
      req.body;

    if (!title || !description || !scheduledAt) {
      res.status(400).json({ error: 'Title, description, and scheduled time are required' });
      return;
    }

    const workshop = await prisma.workshop.create({
      data: {
        hostId,
        title,
        description,
        category: category || 'General',
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 45,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : 8,
        creditCost: creditCost ? parseInt(creditCost) : 1,
        meetingLink: meetingLink || 'https://meet.jit.si/SwapSkill-Workshop-' + Math.random().toString(36).substring(7),
      },
      include: {
        host: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json(workshop);
  } catch (error: any) {
    console.error('createWorkshop error:', error);
    res.status(500).json({ error: 'Failed to create workshop' });
  }
};

export const enrollWorkshop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: {
        enrollments: true,
      },
    });

    if (!workshop) {
      res.status(404).json({ error: 'Workshop not found' });
      return;
    }

    if (workshop.hostId === userId) {
      res.status(400).json({ error: 'You are the host of this workshop' });
      return;
    }

    if (workshop.enrollments.some((e) => e.userId === userId)) {
      res.status(400).json({ error: 'Already enrolled in this workshop' });
      return;
    }

    if (workshop.enrollments.length >= workshop.maxParticipants) {
      res.status(400).json({ error: 'Workshop is at maximum capacity' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits < workshop.creditCost) {
      res.status(400).json({ error: `You need at least ${workshop.creditCost} credit to enroll in this workshop.` });
      return;
    }

    // Deduct credit & enroll
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: workshop.creditCost } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: -workshop.creditCost,
          type: 'WORKSHOP_ENROLL',
          description: `Enrolled in workshop: "${workshop.title}"`,
        },
      }),
      prisma.workshopEnrollment.create({
        data: {
          workshopId: workshop.id,
          userId,
        },
      }),
      // Credit to host
      prisma.user.update({
        where: { id: workshop.hostId },
        data: { credits: { increment: workshop.creditCost } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: workshop.hostId,
          amount: workshop.creditCost,
          type: 'WORKSHOP_EARNED',
          description: `Earned ${workshop.creditCost} credit from workshop enrollment on "${workshop.title}"`,
        },
      }),
    ]);

    res.json({ message: 'Enrolled successfully in workshop!' });
  } catch (error: any) {
    console.error('enrollWorkshop error:', error);
    res.status(500).json({ error: 'Failed to enroll in workshop' });
  }
};
