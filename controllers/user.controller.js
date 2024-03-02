import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import taskModel from "../models/task.model.js";
import subTaskModel from "../models/subTask.model.js";
import { taskCreateValidation } from "../validation/task.validation.js";
// import mongoose from "mongoose";

const routes = {};

routes.getToken = async (req, res) => {
  try {
    const { phone_number } = req.body;
    const user = await userModel.findOne({ phone_number });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res
        .status(200)
        .json({ token, message: "User logged in successfully" });
    } else {
      const newUser = new userModel({ phone_number });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res
        .status(200)
        .json({ token, message: "User created and logged in successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    const { error } = taskCreateValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user_id = req.userId;
    const task = new taskModel({ title, description, due_date, user_id });
    await task.save();
    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;
    if (!task_id) {
      return res.status(400).json({ message: "Task id is required" });
    }
    const task = await taskModel.findById(task_id);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    const subtask = new subTaskModel({ task_id });
    await subtask.save();
    res.status(200).json({ message: "Subtask created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.getTasks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const priority = req.query.priority;
    const dueDate = req.query.due_date;

    const query = {};

    if (priority) {
      query.priority = priority;
    }

    if (dueDate) {
      query.due_date = dueDate;
    }

    query.deleted_at = null;

    query.user_id = req.userId;

    const tasks = await taskModel
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalTasks = await taskModel.countDocuments(query);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
      totalTasks,
      limit,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.getSubTasks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const task_id = req.query.task_id;
    const status = req.query.status;
    const userId = req.userId;

    const userTasks = await taskModel.find({ user_id: userId }).select('_id');

    const userTaskIds = userTasks.map(task => task._id);

    const query = {
      task_id: { $in: userTaskIds } 
    };

    if (task_id) {
      query.task_id = task_id;
    }
    if(status){
      query.status = status;
    }

    query.deleted_at = null;

    const subtasks = await subTaskModel
      .find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalSubTasks = await subTaskModel.countDocuments(query);

    res.status(200).json({
      subtasks,
      totalPages: Math.ceil(totalSubTasks / limit),
      currentPage: page,
      totalSubTasks,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { due_date, status } = req.body;

    const task = await taskModel.findById(id);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    if (due_date) {
      task.due_date = due_date;
    }

    if (status) {
      task.status = status;
    }

    await task.save();
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.updateSubTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 1 && status !== 0) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const subtask = await subTaskModel.findById(id);

    if (!subtask) {
      return res.status(400).json({ message: "Subtask not found" });
    }

    if (status) {
      subtask.status = status;
    }

    await subtask.save();
    res.status(200).json({ message: "Subtask updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

routes.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    task.deleted_at = new Date();
    await task.save();

    await subTaskModel.updateMany({ task_id: id }, { deleted_at: new Date() });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

routes.deleteSubTask = async (req, res) => {
  try {
    const { id } = req.params;
    const subtask = await subTaskModel.findById(id);

    if (!subtask) {
      return res.status(400).json({ message: "Subtask not found" });
    }

    subtask.deleted_at = new Date();
    await subtask.save();
    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

export default routes;