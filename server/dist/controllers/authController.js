"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoUsers = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../prisma.js");
const JWT_SECRET = process.env.JWT_SECRET || 'swapskill_super_secret_jwt_key_2026_secure';
const register = async (req, res) => {
    try {
        const { name, email, password, headline, bio, languages, availability } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Name, email, and password are required' });
            return;
        }
        const existingUser = await prisma_js_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'An account with this email already exists' });
            return;
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Rule: New user receives 2 starter credits upon signup
        const user = await prisma_js_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                headline: headline || 'New SwapSkill Peer',
                bio: bio || '',
                languages: languages || 'English',
                availability: availability || 'Flexible',
                credits: 2,
                creditLedger: {
                    create: {
                        amount: 2,
                        type: 'STARTER_BONUS',
                        description: 'SwapSkill Welcome Bonus: 2 starter credits',
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                headline: true,
                bio: true,
                credits: true,
                role: true,
                languages: true,
                availability: true,
                createdAt: true,
            },
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({ user, token });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email },
            include: {
                skills: true,
                portfolio: true,
            },
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const { passwordHash, ...safeUser } = user;
        res.json({ user: safeUser, token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const logout = (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Not authenticated' });
            return;
        }
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                skills: true,
                portfolio: true,
                creditLedger: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const { passwordHash, ...safeUser } = user;
        res.json({ user: safeUser });
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to fetch current user' });
    }
};
exports.getMe = getMe;
// Quick switch between demo seed users for easy testing and evaluation
const getDemoUsers = async (_req, res) => {
    try {
        const users = await prisma_js_1.prisma.user.findMany({
            take: 6,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                headline: true,
                credits: true,
                skills: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch demo users' });
    }
};
exports.getDemoUsers = getDemoUsers;
