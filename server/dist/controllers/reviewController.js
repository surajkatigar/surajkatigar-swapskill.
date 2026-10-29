"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReviews = exports.createReview = void 0;
const prisma_js_1 = require("../prisma.js");
const createReview = async (req, res) => {
    try {
        const reviewerId = req.user.id;
        const { sessionId, rating, comment, skillQualityRating, punctualityRating } = req.body;
        if (!sessionId || !rating || !comment) {
            res.status(400).json({ error: 'Session ID, rating, and feedback comment are required' });
            return;
        }
        const session = await prisma_js_1.prisma.sessionBooking.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            res.status(404).json({ error: 'Session not found' });
            return;
        }
        if (session.status !== 'COMPLETED') {
            res.status(400).json({ error: 'Can only review completed sessions' });
            return;
        }
        if (session.learnerId !== reviewerId && session.teacherId !== reviewerId) {
            res.status(403).json({ error: 'You did not participate in this session' });
            return;
        }
        // Determine reviewee
        const revieweeId = session.learnerId === reviewerId ? session.teacherId : session.learnerId;
        // Check if already reviewed
        const existing = await prisma_js_1.prisma.review.findFirst({
            where: {
                sessionId,
                reviewerId,
            },
        });
        if (existing) {
            res.status(400).json({ error: 'You have already submitted a review for this session' });
            return;
        }
        const review = await prisma_js_1.prisma.review.create({
            data: {
                sessionId,
                reviewerId,
                revieweeId,
                rating: Math.min(5, Math.max(1, parseInt(rating))),
                comment,
                skillQualityRating: skillQualityRating ? Math.min(5, Math.max(1, parseInt(skillQualityRating))) : 5,
                punctualityRating: punctualityRating ? Math.min(5, Math.max(1, parseInt(punctualityRating))) : 5,
            },
            include: {
                reviewer: { select: { id: true, name: true, avatar: true } },
            },
        });
        res.status(201).json(review);
    }
    catch (error) {
        console.error('createReview error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};
exports.createReview = createReview;
const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await prisma_js_1.prisma.review.findMany({
            where: { revieweeId: userId },
            include: {
                reviewer: { select: { id: true, name: true, avatar: true, headline: true } },
                session: { select: { skillName: true, scheduledAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
exports.getUserReviews = getUserReviews;
