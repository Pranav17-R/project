import mongoose from 'mongoose';
import SolvedProblem from '../models/SolvedProblem.js';

export async function summary(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const byDifficulty = await SolvedProblem.aggregate([
      { $match: { userId } },
      { $lookup: { from: 'problems', localField: 'problemId', foreignField: '_id', as: 'problem' } },
      { $unwind: '$problem' },
      { $group: { _id: '$problem.difficulty', count: { $sum: 1 } } }
    ]);

    const byTag = await SolvedProblem.aggregate([
      { $match: { userId } },
      { $lookup: { from: 'problems', localField: 'problemId', foreignField: '_id', as: 'problem' } },
      { $unwind: '$problem' },
      { $unwind: '$problem.tags' },
      { $group: { _id: '$problem.tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const total = await SolvedProblem.countDocuments({ userId });

    res.json({ total, byDifficulty, byTag });
  } catch (err) {
    next(err);
  }
}

export async function timeline(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { days = 90 } = req.query;
    const start = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const data = await SolvedProblem.aggregate([
      { $match: { userId, solvedAt: { $gte: start } } },
      {
        $group: {
          _id: {
            y: { $year: '$solvedAt' },
            m: { $month: '$solvedAt' },
            d: { $dayOfMonth: '$solvedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
    ]);

    res.json({ items: data });
  } catch (err) {
    next(err);
  }
}






