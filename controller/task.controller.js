const Task = require('../model/Task');
const taskController = {};

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const newTask = new Task({ task, isComplete });
    await newTask.save();
    res.status(200).json({ status: 'ok', data: newTask });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

taskController.getTasks = async (req, res) => {
  try {
    const taskList = await Task.find({}).select('-__v');
    res.status(200).json({ status: 'ok', data: taskList });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

taskController.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { task, isComplete } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { task, isComplete });
    res.status(200).json({ status: 'ok', data: updatedTask });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

taskController.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: 'ok', message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

module.exports = taskController;
