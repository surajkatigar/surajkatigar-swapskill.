"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditHistory = exports.deletePortfolioItem = exports.addPortfolioItem = exports.deleteSkill = exports.addSkill = exports.updateProfile = exports.getUserById = exports.getUsers = void 0;
const prisma_js_1 = require("../prisma.js");
const getUsers = async (req, res) => {
    try {
        const { search, category, language, skillType, level } = req.query;
        const whereClause = {};
        if (search && typeof search === 'string') {
            whereClause.OR = [
                { name: { contains: search } },
                { headline: { contains: search } },
                { bio: { contains: search } },
                { skills: { some: { skillName: { contains: search } } } },
            ];
        }
        if (language && typeof language === 'string') {
            whereClause.languages = { contains: language };
        }
        if (category || skillType || level) {
            const skillFilter = {};
            if (category && typeof category === 'string')
                skillFilter.category = category;
            if (skillType && typeof skillType === 'string')
                skillFilter.type = skillType;
            if (level && typeof level === 'string')
                skillFilter.proficiencyLevel = level;
            whereClause.skills = {
                some: skillFilter,
            };
        }
        const users = await prisma_js_1.prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                headline: true,
                bio: true,
                avatar: true,
                credits: true,
                languages: true,
                availability: true,
                role: true,
                skills: true,
                portfolio: true,
                receivedReviews: {
                    select: {
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        teacherBookings: {
                            where: { status: 'COMPLETED' },
                        },
                    },
                },
            },
        });
        const formatted = users.map((u) => {
            const ratings = u.receivedReviews.map((r) => r.rating);
            const avgRating = ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 5.0;
            return {
                ...u,
                averageRating: avgRating,
                reviewCount: ratings.length,
                completedSessions: u._count.teacherBookings,
            };
        });
        res.json(formatted);
    }
    catch (error) {
        console.error('getUsers error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id },
            include: {
                skills: true,
                portfolio: true,
                receivedReviews: {
                    include: {
                        reviewer: {
                            select: { id: true, name: true, headline: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                hostedWorkshops: {
                    where: { scheduledAt: { gte: new Date() } },
                },
                _count: {
                    select: {
                        teacherBookings: { where: { status: 'COMPLETED' } },
                        learnerBookings: { where: { status: 'COMPLETED' } },
                    },
                },
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const { passwordHash, ...safeUser } = user;
        const ratings = user.receivedReviews.map((r) => r.rating);
        const avgRating = ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 5.0;
        res.json({
            ...safeUser,
            averageRating: avgRating,
            reviewCount: ratings.length,
            completedAsTeacher: user._count.teacherBookings,
            completedAsLearner: user._count.learnerBookings,
        });
    }
    catch (error) {
        console.error('getUserById error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};
exports.getUserById = getUserById;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, headline, bio, languages, availability } = req.body;
        const updated = await prisma_js_1.prisma.user.update({
            where: { id: userId },
            data: {
                name,
                headline,
                bio,
                languages,
                availability,
            },
            include: {
                skills: true,
                portfolio: true,
            },
        });
        const { passwordHash, ...safeUser } = updated;
        res.json(safeUser);
    }
    catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
const addSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skillName, category, type, proficiencyLevel, yearsExperience } = req.body;
        if (!skillName || !category || !type) {
            res.status(400).json({ error: 'Skill name, category, and type (TEACH/LEARN) are required' });
            return;
        }
        const skill = await prisma_js_1.prisma.userSkill.create({
            data: {
                userId,
                skillName,
                category,
                type, // "TEACH" | "LEARN"
                proficiencyLevel: proficiencyLevel || 'INTERMEDIATE',
                yearsExperience: yearsExperience ? parseInt(yearsExperience) : 1,
            },
        });
        res.status(201).json(skill);
    }
    catch (error) {
        console.error('addSkill error:', error);
        res.status(500).json({ error: 'Failed to add skill' });
    }
};
exports.addSkill = addSkill;
const deleteSkill = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skillId } = req.params;
        const skill = await prisma_js_1.prisma.userSkill.findUnique({ where: { id: skillId } });
        if (!skill || skill.userId !== userId) {
            res.status(403).json({ error: 'Skill not found or unauthorized' });
            return;
        }
        await prisma_js_1.prisma.userSkill.delete({ where: { id: skillId } });
        res.json({ message: 'Skill deleted' });
    }
    catch (error) {
        console.error('deleteSkill error:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
};
exports.deleteSkill = deleteSkill;
const addPortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, projectUrl, mediaUrl } = req.body;
        if (!title) {
            res.status(400).json({ error: 'Title is required' });
            return;
        }
        const item = await prisma_js_1.prisma.portfolioItem.create({
            data: {
                userId,
                title,
                description,
                projectUrl,
                mediaUrl,
            },
        });
        res.status(201).json(item);
    }
    catch (error) {
        console.error('addPortfolioItem error:', error);
        res.status(500).json({ error: 'Failed to add portfolio item' });
    }
};
exports.addPortfolioItem = addPortfolioItem;
const deletePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const item = await prisma_js_1.prisma.portfolioItem.findUnique({ where: { id: itemId } });
        if (!item || item.userId !== userId) {
            res.status(403).json({ error: 'Portfolio item not found or unauthorized' });
            return;
        }
        await prisma_js_1.prisma.portfolioItem.delete({ where: { id: itemId } });
        res.json({ message: 'Portfolio item deleted' });
    }
    catch (error) {
        console.error('deletePortfolioItem error:', error);
        res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
};
exports.deletePortfolioItem = deletePortfolioItem;
const getCreditHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await prisma_js_1.prisma.creditTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch credit history' });
    }
};
exports.getCreditHistory = getCreditHistory;
