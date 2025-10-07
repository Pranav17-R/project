import Problem from '../models/Problem.js';
import SolvedProblem from '../models/SolvedProblem.js';

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
    const { problemId, title, tags = [], difficulty, platform, url } = req.body;
    const exists = await Problem.findOne({ problemId });
    if (exists) return res.status(409).json({ message: 'Problem already exists' });
    const problem = await Problem.create({ problemId, title, tags, difficulty, platform, url });
    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
}

export async function updateProblem(req, res, next) {
  try {
    const { id } = req.params;
    const { title, tags, difficulty, platform, url } = req.body;

    // Ensure the current user has this problem in their solved list
    const hasAccess = await SolvedProblem.findOne({ userId: req.user.id, problemId: id });
    if (!hasAccess) return res.status(403).json({ message: 'Not allowed to update this problem' });

    const update = {};
    if (typeof title === 'string') update.title = title;
    if (Array.isArray(tags)) update.tags = tags;
    if (typeof difficulty === 'string') update.difficulty = difficulty;
    if (typeof platform === 'string') update.platform = platform;
    if (typeof url === 'string') update.url = url;

    const updated = await Problem.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Problem not found' });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}






