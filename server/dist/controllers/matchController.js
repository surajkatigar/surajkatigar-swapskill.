"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatches = void 0;
const prisma_js_1 = require("../prisma.js");
const getMatches = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = await prisma_js_1.prisma.user.findUnique({
            where: { id: currentUserId },
            include: {
                skills: true,
            },
        });
        if (!currentUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const myTeachSkills = currentUser.skills.filter((s) => s.type === 'TEACH');
        const myLearnSkills = currentUser.skills.filter((s) => s.type === 'LEARN');
        const otherUsers = await prisma_js_1.prisma.user.findMany({
            where: {
                id: { not: currentUserId },
            },
            include: {
                skills: true,
                receivedReviews: {
                    select: { rating: true },
                },
                _count: {
                    select: {
                        teacherBookings: { where: { status: 'COMPLETED' } },
                    },
                },
            },
        });
        const matchResults = otherUsers
            .map((peer) => {
            const peerTeachSkills = peer.skills.filter((s) => s.type === 'TEACH');
            const peerLearnSkills = peer.skills.filter((s) => s.type === 'LEARN');
            // Skills peer can teach me:
            // Peer teach skills matching my learn skills (case-insensitive name match or category match)
            const canTeachMe = peerTeachSkills.filter((pt) => myLearnSkills.some((ml) => ml.skillName.toLowerCase() === pt.skillName.toLowerCase() ||
                (ml.category.toLowerCase() === pt.category.toLowerCase() &&
                    ml.skillName.toLowerCase().includes(pt.skillName.toLowerCase()))));
            // Skills I can teach peer:
            // My teach skills matching peer learn skills
            const canLearnFromMe = peerLearnSkills.filter((pl) => myTeachSkills.some((mt) => mt.skillName.toLowerCase() === pl.skillName.toLowerCase() ||
                (mt.category.toLowerCase() === pl.category.toLowerCase() &&
                    mt.skillName.toLowerCase().includes(pl.skillName.toLowerCase()))));
            let matchType = 'EXPLORE';
            let matchScore = 30; // base affinity
            if (canTeachMe.length > 0 && canLearnFromMe.length > 0) {
                matchType = 'MUTUAL_EXCHANGE';
                matchScore = 90 + Math.min(10, (canTeachMe.length + canLearnFromMe.length) * 3);
            }
            else if (canTeachMe.length > 0) {
                matchType = 'CAN_TEACH_YOU';
                matchScore = 70 + Math.min(15, canTeachMe.length * 5);
            }
            else if (canLearnFromMe.length > 0) {
                matchType = 'WANTS_YOUR_SKILL';
                matchScore = 55 + Math.min(15, canLearnFromMe.length * 5);
            }
            const ratings = peer.receivedReviews.map((r) => r.rating);
            const avgRating = ratings.length
                ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
                : 5.0;
            return {
                user: {
                    id: peer.id,
                    name: peer.name,
                    headline: peer.headline,
                    bio: peer.bio,
                    avatar: peer.avatar,
                    languages: peer.languages,
                    availability: peer.availability,
                    credits: peer.credits,
                    skills: peer.skills,
                    averageRating: avgRating,
                    reviewCount: ratings.length,
                    completedSessions: peer._count.teacherBookings,
                },
                matchType,
                matchScore,
                canTeachMe: canTeachMe.map((s) => s.skillName),
                canLearnFromMe: canLearnFromMe.map((s) => s.skillName),
            };
        })
            .sort((a, b) => b.matchScore - a.matchScore);
        res.json(matchResults);
    }
    catch (error) {
        console.error('getMatches error:', error);
        res.status(500).json({ error: 'Failed to compute matches' });
    }
};
exports.getMatches = getMatches;
