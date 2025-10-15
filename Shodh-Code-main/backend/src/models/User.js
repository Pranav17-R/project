import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 50, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    joinedAt: { type: Date, default: Date.now },
    weeklyGoal: { type: Number, default: 0, min: 0 },
    monthlyGoal: { type: Number, default: 0, min: 0 },
    easyGoal: { type: Number, default: 0, min: 0 },
    mediumGoal: { type: Number, default: 0, min: 0 }
    ,
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

