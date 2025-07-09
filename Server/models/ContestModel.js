import mongoose from 'mongoose';

const ContestSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
    winner: { type: String, default: null },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
});

const Contest = mongoose.model('Contest', ContestSchema);
export { Contest };