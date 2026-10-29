import { Response } from 'express';
import { prisma } from '../prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const learnerId = req.user!.id;
    const { teacherId, skillName, scheduledAt, durationMinutes, goalDescription, meetingLink, location } = req.body;

    if (!teacherId || !skillName || !scheduledAt) {
      res.status(400).json({ error: 'Teacher, skill name, and scheduled date/time are required' });
      return;
    }

    if (learnerId === teacherId) {
      res.status(400).json({ error: 'You cannot book a session with yourself' });
      return;
    }

    // Check learner credit balance
    const learner = await prisma.user.findUnique({ where: { id: learnerId } });
    if (!learner || learner.credits < 1) {
      res.status(400).json({
        error: 'Insufficient credits. You need at least 1 credit to book a session. Teach a skill or join a circle to earn credits!',
      });
      return;
    }

    const booking = await prisma.sessionBooking.create({
      data: {
        learnerId,
        teacherId,
        skillName,
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 30,
        goalDescription: goalDescription || '',
        meetingLink: meetingLink || 'https://meet.jit.si/SwapSkill-' + Math.random().toString(36).substring(7),
        location: location || 'Online Video Room',
        status: 'PENDING',
        escrowCreditLocked: false,
      },
      include: {
        learner: { select: { id: true, name: true, avatar: true } },
        teacher: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json(booking);
  } catch (error: any) {
    console.error('createBooking error:', error);
    res.status(500).json({ error: 'Failed to create session request' });
  }
};

export const acceptBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user!.id;
    const { id } = req.params;

    const booking = await prisma.sessionBooking.findUnique({
      where: { id },
      include: {
        learner: true,
        teacher: true,
      },
    });

    if (!booking || booking.teacherId !== teacherId) {
      res.status(403).json({ error: 'Booking not found or unauthorized' });
      return;
    }

    if (booking.status !== 'PENDING') {
      res.status(400).json({ error: `Cannot accept booking with status '${booking.status}'` });
      return;
    }

    // Verify learner has at least 1 credit available to lock in escrow
    const learner = await prisma.user.findUnique({ where: { id: booking.learnerId } });
    if (!learner || learner.credits < 1) {
      res.status(400).json({
        error: 'Learner currently has 0 credits. Cannot confirm session escrow.',
      });
      return;
    }

    // Transaction: Deduct 1 credit from learner, lock in escrow for this booking
    await prisma.$transaction([
      prisma.user.update({
        where: { id: booking.learnerId },
        data: { credits: { decrement: 1 } },
      }),
      prisma.creditTransaction.create({
        data: {
          userId: booking.learnerId,
          amount: -1,
          type: 'ESCROW_LOCK',
          sessionId: booking.id,
          description: `1 credit held in escrow for session on ${booking.skillName} with ${booking.teacher.name}`,
        },
      }),
      prisma.sessionBooking.update({
        where: { id: booking.id },
        data: {
          status: 'ACCEPTED',
          escrowCreditLocked: true,
        },
      }),
    ]);

    const updated = await prisma.sessionBooking.findUnique({
      where: { id },
      include: {
        learner: { select: { id: true, name: true, avatar: true, email: true } },
        teacher: { select: { id: true, name: true, avatar: true, email: true } },
      },
    });

    res.json({ message: 'Session accepted and 1 credit locked in escrow', booking: updated });
  } catch (error: any) {
    console.error('acceptBooking error:', error);
    res.status(500).json({ error: 'Failed to accept booking' });
  }
};

export const declineBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const teacherId = req.user!.id;
    const { id } = req.params;

    const booking = await prisma.sessionBooking.findUnique({ where: { id } });
    if (!booking || booking.teacherId !== teacherId) {
      res.status(403).json({ error: 'Booking not found or unauthorized' });
      return;
    }

    await prisma.sessionBooking.update({
      where: { id },
      data: { status: 'DECLINED' },
    });

    res.json({ message: 'Booking declined' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to decline booking' });
  }
};

export const completeBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { id } = req.params;

    const booking = await prisma.sessionBooking.findUnique({
      where: { id },
      include: {
        learner: true,
        teacher: true,
      },
    });

    if (!booking || (booking.learnerId !== currentUserId && booking.teacherId !== currentUserId)) {
      res.status(403).json({ error: 'Booking not found or unauthorized' });
      return;
    }

    if (booking.status !== 'ACCEPTED') {
      res.status(400).json({ error: 'Only accepted sessions can be completed' });
      return;
    }

    const isLearner = booking.learnerId === currentUserId;
    const newLearnerConfirmed = isLearner ? true : booking.learnerConfirmed;
    const newTeacherConfirmed = !isLearner ? true : booking.teacherConfirmed;

    // In a smooth barter flow, confirmation by learner or mutual completes the transfer:
    // When completed, release the locked escrow credit to the teacher balance!
    const shouldFinalize = newLearnerConfirmed || (newLearnerConfirmed && newTeacherConfirmed);

    if (shouldFinalize && booking.escrowCreditLocked) {
      await prisma.$transaction([
        // Transfer 1 credit to teacher
        prisma.user.update({
          where: { id: booking.teacherId },
          data: { credits: { increment: 1 } },
        }),
        // Record credit ledger transaction
        prisma.creditTransaction.create({
          data: {
            userId: booking.teacherId,
            amount: 1,
            type: 'ESCROW_RELEASE',
            sessionId: booking.id,
            description: `Earned 1 learning credit for teaching ${booking.skillName} to ${booking.learner.name}`,
          },
        }),
        // Mark booking completed
        prisma.sessionBooking.update({
          where: { id: booking.id },
          data: {
            status: 'COMPLETED',
            escrowCreditLocked: false,
            learnerConfirmed: true,
            teacherConfirmed: true,
          },
        }),
      ]);

      const finished = await prisma.sessionBooking.findUnique({
        where: { id },
        include: {
          learner: { select: { id: true, name: true, avatar: true } },
          teacher: { select: { id: true, name: true, avatar: true } },
        },
      });

      res.json({
        message: 'Session completed successfully! 1 credit has been transferred to the teacher.',
        booking: finished,
        completed: true,
      });
      return;
    }

    // Otherwise record single-side confirmation
    const updated = await prisma.sessionBooking.update({
      where: { id },
      data: {
        learnerConfirmed: newLearnerConfirmed,
        teacherConfirmed: newTeacherConfirmed,
      },
    });

    res.json({ message: 'Session marked confirmed', booking: updated, completed: false });
  } catch (error: any) {
    console.error('completeBooking error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;
    const { id } = req.params;

    const booking = await prisma.sessionBooking.findUnique({
      where: { id },
      include: { learner: true },
    });

    if (!booking || (booking.learnerId !== currentUserId && booking.teacherId !== currentUserId)) {
      res.status(403).json({ error: 'Booking not found or unauthorized' });
      return;
    }

    if (booking.status === 'COMPLETED') {
      res.status(400).json({ error: 'Completed sessions cannot be cancelled' });
      return;
    }

    // If escrow was already locked, refund the 1 credit back to learner
    if (booking.escrowCreditLocked) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: booking.learnerId },
          data: { credits: { increment: 1 } },
        }),
        prisma.creditTransaction.create({
          data: {
            userId: booking.learnerId,
            amount: 1,
            type: 'ESCROW_REFUND',
            sessionId: booking.id,
            description: `Escrow refund: 1 credit returned for cancelled session on ${booking.skillName}`,
          },
        }),
        prisma.sessionBooking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            escrowCreditLocked: false,
          },
        }),
      ]);
    } else {
      await prisma.sessionBooking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' },
      });
    }

    res.json({ message: 'Session cancelled and escrow credit refunded if previously held' });
  } catch (error: any) {
    console.error('cancelBooking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user!.id;

    const bookings = await prisma.sessionBooking.findMany({
      where: {
        OR: [{ learnerId: currentUserId }, { teacherId: currentUserId }],
      },
      include: {
        learner: {
          select: { id: true, name: true, avatar: true, email: true, headline: true },
        },
        teacher: {
          select: { id: true, name: true, avatar: true, email: true, headline: true },
        },
        reviews: true,
        practiceTasks: true,
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};
