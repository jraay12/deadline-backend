const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/create-task", authenticateToken, taskController.createTask);

router.patch(
  "/update-task/:task_id",
  authenticateToken,
  taskController.updateTaskStatus
);

router.get(
  "/retrieve-task/:user_id",
  authenticateToken,
  taskController.getUserTasks
);


module.exports = router;
