"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinCircle = exports.createCircle = exports.getCircles = void 0;
const prisma_js_1 = require("../prisma.js");
const getCircles = async (_req, res) => {
    try {
        const circles = await prisma_js_1.prisma.learningCircle.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch learning circles' });
    }
};
exports.getCircles = getCircles;
const createCircle = async (req, res) => {
    try {
        const creatorId = req.user.id;
        const { title, topic, category, goalDescription, meetingSchedule } = req.body;
        if (!title || !topic || !goalDescription) {
            res.status(400).json({ error: 'Title, topic, and goal description are required' });
            return;
        }
        const circle = await prisma_js_1.prisma.learningCircle.create({
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
    }
    catch (error) {
        console.error('createCircle error:', error);
        res.status(500).json({ error: 'Failed to create learning circle' });
    }
};
exports.createCircle = createCircle;
const joinCircle = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const existing = await prisma_js_1.prisma.circleMember.findUnique({
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
        await prisma_js_1.prisma.circleMember.create({
            data: {
                circleId: id,
                userId,
            },
        });
        res.json({ message: 'Successfully joined learning circle!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to join circle' });
    }
};
exports.joinCircle = joinCircle;
