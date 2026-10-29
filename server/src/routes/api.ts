import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';
import * as userCtrl from '../controllers/userController.js';
import * as matchCtrl from '../controllers/matchController.js';
import * as bookingCtrl from '../controllers/bookingController.js';
import * as chatCtrl from '../controllers/chatController.js';
import * as reviewCtrl from '../controllers/reviewController.js';
import * as workshopCtrl from '../controllers/workshopController.js';
import * as circleCtrl from '../controllers/circleController.js';
import * as taskCtrl from '../controllers/taskController.js';
import * as adminCtrl from '../controllers/adminController.js';

const router = Router();

// Auth routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/logout', authCtrl.logout);
router.get('/auth/me', authenticate, authCtrl.getMe);
router.get('/auth/demo-users', authCtrl.getDemoUsers);

// User routes
router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUserById);
router.put('/users/profile', authenticate, userCtrl.updateProfile);
router.post('/users/skills', authenticate, userCtrl.addSkill);
router.delete('/users/skills/:skillId', authenticate, userCtrl.deleteSkill);
router.post('/users/portfolio', authenticate, userCtrl.addPortfolioItem);
router.delete('/users/portfolio/:itemId', authenticate, userCtrl.deletePortfolioItem);
router.get('/users/credits/history', authenticate, userCtrl.getCreditHistory);

// Matchmaking
router.get('/matches', authenticate, matchCtrl.getMatches);

// Sessions / Bookings & Escrow
router.post('/bookings', authenticate, bookingCtrl.createBooking);
router.get('/bookings/my', authenticate, bookingCtrl.getMyBookings);
router.put('/bookings/:id/accept', authenticate, bookingCtrl.acceptBooking);
router.put('/bookings/:id/decline', authenticate, bookingCtrl.declineBooking);
router.put('/bookings/:id/complete', authenticate, bookingCtrl.completeBooking);
router.put('/bookings/:id/cancel', authenticate, bookingCtrl.cancelBooking);

// Real-Time Chat
router.get('/chat/conversations', authenticate, chatCtrl.getConversations);
router.get('/chat/messages/:partnerId', authenticate, chatCtrl.getMessagesWithUser);
router.post('/chat/messages', authenticate, chatCtrl.sendMessage);

// Reviews & Ratings
router.post('/reviews', authenticate, reviewCtrl.createReview);
router.get('/reviews/user/:userId', reviewCtrl.getUserReviews);

// Small Group Workshops
router.get('/workshops', workshopCtrl.getWorkshops);
router.post('/workshops', authenticate, workshopCtrl.createWorkshop);
router.post('/workshops/:id/enroll', authenticate, workshopCtrl.enrollWorkshop);

// Learning Circles
router.get('/circles', circleCtrl.getCircles);
router.post('/circles', authenticate, circleCtrl.createCircle);
router.post('/circles/:id/join', authenticate, circleCtrl.joinCircle);

// Practice Tasks & Quizzes
router.get('/tasks', authenticate, taskCtrl.getMyTasks);
router.post('/tasks', authenticate, taskCtrl.assignTask);
router.put('/tasks/:id/submit', authenticate, taskCtrl.submitTask);
router.put('/tasks/:id/review', authenticate, taskCtrl.reviewTask);

// Admin Dashboard & Dispute Resolution
router.get('/admin/stats', authenticate, adminCtrl.getPlatformStats);
router.get('/admin/categories', adminCtrl.getSkillCategories);
router.post('/admin/categories', authenticate, requireAdmin, adminCtrl.createSkillCategory);
router.get('/admin/disputes', authenticate, adminCtrl.getDisputes);
router.post('/admin/disputes', authenticate, adminCtrl.fileDispute);
router.put('/admin/disputes/:id/resolve', authenticate, requireAdmin, adminCtrl.resolveDispute);

export default router;
