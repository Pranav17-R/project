import Problem from '../models/Problem.js';
import SolvedProblem from '../models/SolvedProblem.js';

export async function addSolved(req, res, next) {
  try {
    const { problemId, title, tags = [], dateSolved, difficulty, platform } = req.body;
    let problem = await Problem.findOne({ problemId });
    if (!problem) {
      problem = await Problem.create({ problemId, title, tags, difficulty, platform });
    }
    const solved = await SolvedProblem.create({
      userId: req.user.id,
      problemId: problem._id,
      solvedAt: dateSolved ? new Date(dateSolved) : new Date()
    });
    res.status(201).json({ message: 'Recorded', solvedId: solved._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already recorded' });
    next(err);
  }
}

export async function listSolved(req, res, next) {
  try {
    const { tags, difficulty, limit = 50, page = 1 } = req.query;
    const match = { userId: req.user.id };
    if (difficulty) match['problem.difficulty'] = difficulty; // for post-lookup filter

    const tagFilter = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : null;

    const pipeline = [
      { $match: { userId: new (await import('mongoose')).default.Types.ObjectId(req.user.id) } },
      { $lookup: { from: 'problems', localField: 'problemId', foreignField: '_id', as: 'problem' } },
      { $unwind: '$problem' }
    ];

    if (difficulty) pipeline.push({ $match: { 'problem.difficulty': difficulty } });
    if (tagFilter && tagFilter.length) pipeline.push({ $match: { 'problem.tags': { $in: tagFilter } } });

    const skip = (Number(page) - 1) * Number(limit);

    const facet = await SolvedProblem.aggregate([
      ...pipeline,
      { $sort: { solvedAt: -1 } },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: Number(limit) }],
          total: [{ $count: 'count' }]
        }
      }
    ]);

    const items = facet[0]?.items || [];
    const total = facet[0]?.total?.[0]?.count || 0;

    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}






