"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewTask = exports.submitTask = exports.assignTask = exports.getMyTasks = void 0;
const prisma_js_1 = require("../prisma.js");
const getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await prisma_js_1.prisma.practiceTask.findMany({
            where: {
                OR: [{ teacherId: userId }, { learnerId: userId }],
            },
            include: {
                teacher: { select: { id: true, name: true, avatar: true } },
                learner: { select: { id: true, name: true, avatar: true } },
                session: { select: { skillName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};
exports.getMyTasks = getMyTasks;
const assignTask = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { learnerId, sessionId, title, instructions } = req.body;
        if (!learnerId || !title || !instructions) {
            res.status(400).json({ error: 'Learner, title, and instructions are required' });
            return;
        }
        const task = await prisma_js_1.prisma.practiceTask.create({
            data: {
                teacherId,
                learnerId,
                sessionId: sessionId || null,
                title,
                instructions,
                status: 'ASSIGNED',
            },
            include: {
                learner: { select: { id: true, name: true, avatar: true } },
                teacher: { select: { id: true, name: true, avatar: true } },
            },
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error('assignTask error:', error);
        res.status(500).json({ error: 'Failed to assign practice task' });
    }
};
exports.assignTask = assignTask;
const submitTask = async (req, res) => {
    try {
        const learnerId = req.user.id;
        const { id } = req.params;
        const { submissionText } = req.body;
        const task = await prisma_js_1.prisma.practiceTask.findUnique({ where: { id } });
        if (!task || task.learnerId !== learnerId) {
            res.status(403).json({ error: 'Task not found or unauthorized' });
            return;
        }
        const updated = await prisma_js_1.prisma.practiceTask.update({
            where: { id },
            data: {
                submissionText,
                status: 'SUBMITTED',
            },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit task' });
    }
};
exports.submitTask = submitTask;
const reviewTask = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { id } = req.params;
        const { feedback } = req.body;
        const task = await prisma_js_1.prisma.practiceTask.findUnique({ where: { id } });
        if (!task || task.teacherId !== teacherId) {
            res.status(403).json({ error: 'Task not found or unauthorized' });
            return;
        }
        const updated = await prisma_js_1.prisma.practiceTask.update({
            where: { id },
            data: {
                feedback,
                status: 'REVIEWED',
            },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
exports.reviewTask = reviewTask;
