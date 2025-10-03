import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectMongo } from '../src/config/db.js';
import Problem from '../src/models/Problem.js';
import User from '../src/models/User.js';

dotenv.config();

async function run() {
  await connectMongo();

  const samples = [
    { problemId: 'LC-1', title: 'Two Sum', tags: ['array', 'hash-table'], difficulty: 'Easy', platform: 'LeetCode' },
    { problemId: 'LC-3', title: 'Longest Substring Without Repeating Characters', tags: ['string', 'sliding-window'], difficulty: 'Medium', platform: 'LeetCode' },
    { problemId: 'CF-4A', title: 'Watermelon', tags: ['math'], difficulty: 'Easy', platform: 'Codeforces' },
    { problemId: 'LC-200', title: 'Number of Islands', tags: ['dfs', 'bfs', 'grid'], difficulty: 'Medium', platform: 'LeetCode' },
    { problemId: 'LC-297', title: 'Serialize and Deserialize Binary Tree', tags: ['tree', 'design'], difficulty: 'Hard', platform: 'LeetCode' }
  ];

  for (const s of samples) {
    const exists = await Problem.findOne({ problemId: s.problemId });
    if (!exists) await Problem.create(s);
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = process.env.ADMIN_EMAIL.toLowerCase();
    const existing = await User.findOne({ email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({ username: 'admin', email, passwordHash, role: 'admin' });
      console.log('Admin user created');
    }
  }

  console.log('Seed completed');
  await mongoose.connection.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});





