"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDispute = exports.fileDispute = exports.getDisputes = exports.createSkillCategory = exports.getSkillCategories = exports.getPlatformStats = void 0;
const prisma_js_1 = require("../prisma.js");
const getPlatformStats = async (_req, res) => {
    try {
        const totalUsers = await prisma_js_1.prisma.user.count();
        const totalSessions = await prisma_js_1.prisma.sessionBooking.count();
        const completedSessions = await prisma_js_1.prisma.sessionBooking.count({
            where: { status: 'COMPLETED' },
        });
        const pendingSessions = await prisma_js_1.prisma.sessionBooking.count({
            where: { status: 'PENDING' },
        });
        const lockedEscrowSessions = await prisma_js_1.prisma.sessionBooking.count({
            where: { escrowCreditLocked: true },
        });
        const totalWorkshops = await prisma_js_1.prisma.workshop.count();
        const totalCircles = await prisma_js_1.prisma.learningCircle.count();
        const totalSkills = await prisma_js_1.prisma.userSkill.count();
        const openDisputes = await prisma_js_1.prisma.disputeReport.count({
            where: { status: 'OPEN' },
        });
        const categories = await prisma_js_1.prisma.skillCategory.findMany();
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
    }
    catch (error) {
        console.error('getPlatformStats error:', error);
        res.status(500).json({ error: 'Failed to fetch platform metrics' });
    }
};
exports.getPlatformStats = getPlatformStats;
const getSkillCategories = async (_req, res) => {
    try {
        const categories = await prisma_js_1.prisma.skillCategory.findMany();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch skill categories' });
    }
};
exports.getSkillCategories = getSkillCategories;
const createSkillCategory = async (req, res) => {
    try {
        const { name, description, iconName, popularTags } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Category name is required' });
            return;
        }
        const cat = await prisma_js_1.prisma.skillCategory.create({
            data: {
                name,
                description,
                iconName: iconName || 'Sparkles',
                popularTags: popularTags || '',
            },
        });
        res.status(201).json(cat);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
};
exports.createSkillCategory = createSkillCategory;
const getDisputes = async (_req, res) => {
    try {
        const disputes = await prisma_js_1.prisma.disputeReport.findMany({
            include: {
                reporter: { select: { id: true, name: true, email: true } },
                reportedUser: { select: { id: true, name: true, email: true } },
                session: { select: { id: true, skillName: true, status: true, escrowCreditLocked: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(disputes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch disputes' });
    }
};
exports.getDisputes = getDisputes;
const fileDispute = async (req, res) => {
    try {
        const reporterId = req.user.id;
        const { reportedUserId, sessionId, reason } = req.body;
        if (!reportedUserId || !reason) {
            res.status(400).json({ error: 'Reported user and reason are required' });
            return;
        }
        const dispute = await prisma_js_1.prisma.disputeReport.create({
            data: {
                reporterId,
                reportedUserId,
                sessionId: sessionId || null,
                reason,
                status: 'OPEN',
            },
        });
        res.status(201).json(dispute);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to file report' });
    }
};
exports.fileDispute = fileDispute;
const resolveDispute = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, refundCredit } = req.body;
        const dispute = await prisma_js_1.prisma.disputeReport.findUnique({
            where: { id },
            include: { session: true },
        });
        if (!dispute) {
            res.status(404).json({ error: 'Dispute not found' });
            return;
        }
        // If admin chooses to refund escrow credit
        if (refundCredit && dispute.session && dispute.session.escrowCreditLocked) {
            await prisma_js_1.prisma.$transaction([
                prisma_js_1.prisma.user.update({
                    where: { id: dispute.reporterId },
                    data: { credits: { increment: 1 } },
                }),
                prisma_js_1.prisma.creditTransaction.create({
                    data: {
                        userId: dispute.reporterId,
                        amount: 1,
                        type: 'ESCROW_REFUND',
                        sessionId: dispute.sessionId,
                        description: `Admin dispute resolution refund: 1 credit returned for session on ${dispute.session.skillName}`,
                    },
                }),
                prisma_js_1.prisma.sessionBooking.update({
                    where: { id: dispute.session.id },
                    data: { status: 'CANCELLED', escrowCreditLocked: false },
                }),
                prisma_js_1.prisma.disputeReport.update({
                    where: { id },
                    data: {
                        status: status || 'RESOLVED',
                        adminNotes: adminNotes || 'Resolved with escrow refund to reporter',
                    },
                }),
            ]);
        }
        else {
            await prisma_js_1.prisma.disputeReport.update({
                where: { id },
                data: {
                    status: status || 'RESOLVED',
                    adminNotes: adminNotes || '',
                },
            });
        }
        res.json({ message: 'Dispute updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to resolve dispute' });
    }
};
exports.resolveDispute = resolveDispute;
