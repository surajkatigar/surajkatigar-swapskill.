import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getPlatformStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalSessions = await prisma.sessionBooking.count();
    const completedSessions = await prisma.sessionBooking.count({
      where: { status: 'COMPLETED' },
    });
    const pendingSessions = await prisma.sessionBooking.count({
      where: { status: 'PENDING' },
    });
    const lockedEscrowSessions = await prisma.sessionBooking.count({
      where: { escrowCreditLocked: true },
    });
    const totalWorkshops = await prisma.workshop.count();
    const totalCircles = await prisma.learningCircle.count();
    const totalSkills = await prisma.userSkill.count();
    const openDisputes = await prisma.disputeReport.count({
      where: { status: 'OPEN' },
    });

    const categories = await prisma.skillCategory.findMany();

    res.json({
      totalUsers,
      totalSessions,
      completedSessions,
      pendingSessions,
      lockedEscrowSessions,
      totalWorkshops,
      totalCircles,
      totalSkills,
      openDisputes,
      categoriesCount: categories.length,
    });
  } catch (error: any) {
    console.error('getPlatformStats error:', error);
    res.status(500).json({ error: 'Failed to fetch platform metrics' });
  }
};

export const getSkillCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await prisma.skillCategory.findMany();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch skill categories' });
  }
};

export const createSkillCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, iconName, popularTags } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const cat = await prisma.skillCategory.create({
      data: {
        name,
        description,
        iconName: iconName || 'Sparkles',
        popularTags: popularTags || '',
      },
    });

    res.status(201).json(cat);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const getDisputes = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const disputes = await prisma.disputeReport.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
        session: { select: { id: true, skillName: true, status: true, escrowCreditLocked: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(disputes);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
};

export const fileDispute = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reporterId = req.user!.id;
    const { reportedUserId, sessionId, reason } = req.body;

    if (!reportedUserId || !reason) {
      res.status(400).json({ error: 'Reported user and reason are required' });
      return;
    }

    const dispute = await prisma.disputeReport.create({
      data: {
        reporterId,
        reportedUserId,
        sessionId: sessionId || null,
        reason,
        status: 'OPEN',
      },
    });

    res.status(201).json(dispute);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to file report' });
  }
};

export const resolveDispute = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes, refundCredit } = req.body;

    const dispute = await prisma.disputeReport.findUnique({
      where: { id },
      include: { session: true },
    });

    if (!dispute) {
      res.status(404).json({ error: 'Dispute not found' });
      return;
    }

    // If admin chooses to refund escrow credit
    if (refundCredit && dispute.session && dispute.session.escrowCreditLocked) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: dispute.reporterId },
          data: { credits: { increment: 1 } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: dispute.reporterId,
            amount: 1,
            type: 'ESCROW_REFUND',
            sessionId: dispute.sessionId,
            description: `Admin dispute resolution refund: 1 credit returned for session on ${dispute.session.skillName}`,
          },
        }),
        prisma.sessionBooking.update({
          where: { id: dispute.session.id },
          data: { status: 'CANCELLED', escrowCreditLocked: false },
        }),
        prisma.disputeReport.update({
          where: { id },
          data: {
            status: status || 'RESOLVED',
            adminNotes: adminNotes || 'Resolved with escrow refund to reporter',
          },
        }),
      ]);
    } else {
      await prisma.disputeReport.update({
        where: { id },
        data: {
          status: status || 'RESOLVED',
          adminNotes: adminNotes || '',
        },
      });
    }

    res.json({ message: 'Dispute updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to resolve dispute' });
  }
};
