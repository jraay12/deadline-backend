const prisma = require("../config/prismaClient");
const Joi = require("joi");

const createTask = async (req, res) => {
  try {
    // 🛑 Validate Request Data
    const schema = Joi.object({
      user_id: Joi.number().integer().required(),
      title: Joi.string().min(3).max(255).required(),
      description: Joi.string().optional().allow(""),
      dueDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required(), // YYYY-MM-DD
      time: Joi.string()
        .pattern(/^\d{2}:\d{2}:\d{2}$/)
        .required(), // HH:mm:ss
      category_ids: Joi.array().items(Joi.number().integer()).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { user_id, title, description, dueDate, time, category_ids } = value;

    // 🔎 Check if User Exists
    const userExists = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!userExists) return res.status(404).json({ error: "User not found" });

    // ✅ Create Task
    const task = await prisma.task.create({
      data: {
        user_id,
        title,
        description,
        dueDate,
        time,
        categories: {
          create: category_ids.map((category_id) => ({
            category: { connect: { id: category_id } },
          })),
        },
      },
      include: { categories: true }, // Include category relationships
    });

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// update a status
const updateTaskStatus = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "in_progress",
      "completed",
      "overdue",
      "cancelled",
      "on_hold",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          error:
            "Invalid status value. Allowed values: " +
            allowedStatuses.join(", "),
        });
    }

    // Find the task
    const task = await prisma.task.findUnique({
      where: { id: parseInt(task_id) },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Update the task status
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(task_id) },
      data: { status },
    });

    return res
      .status(200)
      .json({ message: "Task status updated successfully", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// get task per user
const getUserTasks = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch tasks for the user
    const tasks = await prisma.task.findMany({
      where: { user_id: parseInt(user_id) },
      select: {
        id: true,
        title: true,
        status: true,
        dueDate: true,
        time: true,
      },
    });

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for this user" });
    }

    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { createTask, updateTaskStatus, getUserTasks };
