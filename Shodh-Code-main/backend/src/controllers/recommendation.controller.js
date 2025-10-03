import mongoose from 'mongoose';
import Problem from '../models/Problem.js';
import SolvedProblem from '../models/SolvedProblem.js';

export async function recommendNext(req, res, next) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const tagStats = await SolvedProblem.aggregate([
      { $match: { userId: userObjectId } },
      { $lookup: { from: 'problems', localField: 'problemId', foreignField: '_id', as: 'problem' } },
      { $unwind: '$problem' },
      { $unwind: '$problem.tags' },
      { $group: { _id: '$problem.tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topTags = tagStats.map(t => t._id);

    if (topTags.length === 0) {
      const fallback = await Problem.find().sort({ createdAt: -1 }).limit(10);
      return res.json({ tagsUsed: [], items: fallback });
    }

    const solved = await SolvedProblem.find({ userId: userObjectId }).select('problemId');
    const solvedIds = solved.map(s => s.problemId);

    const items = await Problem.find({
      _id: { $nin: solvedIds },
      tags: { $in: topTags }
    }).limit(20);

    res.json({ tagsUsed: topTags, items });
  } catch (err) {
    next(err);
  }
}





