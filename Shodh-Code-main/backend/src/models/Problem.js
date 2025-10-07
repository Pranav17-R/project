import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    platform: { type: String, required: true, trim: true },
    url: { type: String, trim: true }
  },
  { timestamps: true }
);

problemSchema.index({ tags: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ platform: 1 });

export default mongoose.model('Problem', problemSchema);






