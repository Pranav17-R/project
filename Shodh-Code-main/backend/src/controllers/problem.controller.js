import Problem from '../models/Problem.js';

export async function listProblems(req, res, next) {
  try {
    const { tags, difficulty, platform, q, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (tags) filter.tags = { $in: tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (difficulty) filter.difficulty = difficulty;
    if (platform) filter.platform = platform;
    if (q) filter.title = { $regex: q, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Problem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Problem.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function createProblem(req, res, next) {
  try {
    const { problemId, title, tags = [], difficulty, platform } = req.body;
    const exists = await Problem.findOne({ problemId });
    if (exists) return res.status(409).json({ message: 'Problem already exists' });
    const problem = await Problem.create({ problemId, title, tags, difficulty, platform });
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
}






