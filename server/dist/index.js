"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017/cricket';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
const matchRoutes_1 = __importDefault(require("./routes/matchRoutes"));
app.use('/api/match', matchRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Cricket Scoring API Running');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
