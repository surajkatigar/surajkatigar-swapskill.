"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const api_js_1 = __importDefault(require("./routes/api.js"));
const chatSocket_js_1 = require("./sockets/chatSocket.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// Setup Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => callback(null, true),
        credentials: true,
    },
});
(0, chatSocket_js_1.setupChatSocket)(io);
// Middlewares
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// API Routes
app.use('/api', api_js_1.default);
// Health check
app.get('/api/health', (_req, expressRes) => {
    expressRes.json({ status: 'ok', name: 'SwapSkill API', timestamp: new Date() });
});
// Serve frontend static build in production
const clientDist = path_1.default.resolve(__dirname, '../../client/dist');
if (fs_1.default.existsSync(clientDist)) {
    app.use(express_1.default.static(clientDist));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(clientDist, 'index.html'));
    });
}
// Start server
server.listen(PORT, () => {
    console.log(`🚀 SwapSkill Server running on http://localhost:${PORT}`);
});
