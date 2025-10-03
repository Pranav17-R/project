import mongoose from 'mongoose';

const solvedProblemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    solvedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

solvedProblemSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model('SolvedProblem', solvedProblemSchema);





