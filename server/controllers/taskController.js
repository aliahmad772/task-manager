const Task = require("../models/Task");

async function getTasks(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { search, status, priority } = req.query;

    const allowedSort = ["title", "dueDate", "createdAt"];
    const sortBy = allowedSort.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortBy]: order, _id: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ]);

    res.json({ data, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getTasks };
