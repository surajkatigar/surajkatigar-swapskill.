"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_js_1 = require("../middleware/auth.js");
const authCtrl = __importStar(require("../controllers/authController.js"));
const userCtrl = __importStar(require("../controllers/userController.js"));
const matchCtrl = __importStar(require("../controllers/matchController.js"));
const bookingCtrl = __importStar(require("../controllers/bookingController.js"));
const chatCtrl = __importStar(require("../controllers/chatController.js"));
const reviewCtrl = __importStar(require("../controllers/reviewController.js"));
const workshopCtrl = __importStar(require("../controllers/workshopController.js"));
const circleCtrl = __importStar(require("../controllers/circleController.js"));
const taskCtrl = __importStar(require("../controllers/taskController.js"));
const adminCtrl = __importStar(require("../controllers/adminController.js"));
const router = (0, express_1.Router)();
// Auth routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/logout', authCtrl.logout);
router.get('/auth/me', auth_js_1.authenticate, authCtrl.getMe);
router.get('/auth/demo-users', authCtrl.getDemoUsers);
// User routes
router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUserById);
router.put('/users/profile', auth_js_1.authenticate, userCtrl.updateProfile);
router.post('/users/skills', auth_js_1.authenticate, userCtrl.addSkill);
router.delete('/users/skills/:skillId', auth_js_1.authenticate, userCtrl.deleteSkill);
router.post('/users/portfolio', auth_js_1.authenticate, userCtrl.addPortfolioItem);
router.delete('/users/portfolio/:itemId', auth_js_1.authenticate, userCtrl.deletePortfolioItem);
router.get('/users/credits/history', auth_js_1.authenticate, userCtrl.getCreditHistory);
// Matchmaking
router.get('/matches', auth_js_1.authenticate, matchCtrl.getMatches);
// Sessions / Bookings & Escrow
router.post('/bookings', auth_js_1.authenticate, bookingCtrl.createBooking);
router.get('/bookings/my', auth_js_1.authenticate, bookingCtrl.getMyBookings);
router.put('/bookings/:id/accept', auth_js_1.authenticate, bookingCtrl.acceptBooking);
router.put('/bookings/:id/decline', auth_js_1.authenticate, bookingCtrl.declineBooking);
router.put('/bookings/:id/complete', auth_js_1.authenticate, bookingCtrl.completeBooking);
router.put('/bookings/:id/cancel', auth_js_1.authenticate, bookingCtrl.cancelBooking);
// Real-Time Chat
router.get('/chat/conversations', auth_js_1.authenticate, chatCtrl.getConversations);
router.get('/chat/messages/:partnerId', auth_js_1.authenticate, chatCtrl.getMessagesWithUser);
router.post('/chat/messages', auth_js_1.authenticate, chatCtrl.sendMessage);
// Reviews & Ratings
router.post('/reviews', auth_js_1.authenticate, reviewCtrl.createReview);
router.get('/reviews/user/:userId', reviewCtrl.getUserReviews);
// Small Group Workshops
router.get('/workshops', workshopCtrl.getWorkshops);
router.post('/workshops', auth_js_1.authenticate, workshopCtrl.createWorkshop);
router.post('/workshops/:id/enroll', auth_js_1.authenticate, workshopCtrl.enrollWorkshop);
// Learning Circles
router.get('/circles', circleCtrl.getCircles);
router.post('/circles', auth_js_1.authenticate, circleCtrl.createCircle);
router.post('/circles/:id/join', auth_js_1.authenticate, circleCtrl.joinCircle);
// Practice Tasks & Quizzes
router.get('/tasks', auth_js_1.authenticate, taskCtrl.getMyTasks);
router.post('/tasks', auth_js_1.authenticate, taskCtrl.assignTask);
router.put('/tasks/:id/submit', auth_js_1.authenticate, taskCtrl.submitTask);
router.put('/tasks/:id/review', auth_js_1.authenticate, taskCtrl.reviewTask);
// Admin Dashboard & Dispute Resolution
router.get('/admin/stats', auth_js_1.authenticate, adminCtrl.getPlatformStats);
router.get('/admin/categories', adminCtrl.getSkillCategories);
router.post('/admin/categories', auth_js_1.authenticate, auth_js_1.requireAdmin, adminCtrl.createSkillCategory);
router.get('/admin/disputes', auth_js_1.authenticate, adminCtrl.getDisputes);
router.post('/admin/disputes', auth_js_1.authenticate, adminCtrl.fileDispute);
router.put('/admin/disputes/:id/resolve', auth_js_1.authenticate, auth_js_1.requireAdmin, adminCtrl.resolveDispute);
exports.default = router;
