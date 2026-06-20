const { readDB, writeDB, generateId } = require('../utils/mockDb');

const getTasks = async (req, res, next) => {
  try {
    const db = readDB();
    const userTasks = db.tasks.filter(t => t.assignedUser === req.user._id);

    // Basic sorting (newest first)
    userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: userTasks.length,
      data: userTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const db = readDB();
    const task = db.tasks.find(t => t._id === req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (task.assignedUser !== req.user._id && req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('Not authorized to access this task');
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const db = readDB();
    
    const task = {
      _id: generateId(),
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'Pending',
      priority: req.body.priority || 'Medium',
      category: req.body.category || 'General',
      tags: req.body.tags || [],
      dueDate: req.body.dueDate,
      assignedUser: req.body.assignedUser || req.user._id,
      createdBy: req.user._id,
      comments: [],
      attachments: [],
      history: [{
        action: 'Created task',
        user: req.user._id,
        date: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.tasks.push(task);
    
    // Log activity
    db.logs.push({
      _id: generateId(),
      action: `Task Created: ${task.title}`,
      user: req.user._id,
      timestamp: new Date().toISOString()
    });

    writeDB(db);

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const db = readDB();
    const taskIndex = db.tasks.findIndex(t => t._id === req.params.id);

    if (taskIndex === -1) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (db.tasks[taskIndex].assignedUser !== req.user._id && db.tasks[taskIndex].createdBy !== req.user._id && req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    // Handle new comment
    if (req.body.newComment) {
      db.tasks[taskIndex].comments = db.tasks[taskIndex].comments || [];
      db.tasks[taskIndex].comments.push({
        _id: generateId(),
        user: req.user._id,
        text: req.body.newComment,
        date: new Date().toISOString()
      });
      delete req.body.newComment;
    }

    const updatedTask = { 
      ...db.tasks[taskIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Add history log if status changed
    if (req.body.status && req.body.status !== db.tasks[taskIndex].status) {
      updatedTask.history = updatedTask.history || [];
      updatedTask.history.push({
        action: `Changed status to ${req.body.status}`,
        user: req.user._id,
        date: new Date().toISOString()
      });
      
      // Add notification for assignment
      db.notifications.push({
        _id: generateId(),
        user: updatedTask.assignedUser,
        message: `Task "${updatedTask.title}" moved to ${req.body.status}`,
        read: false,
        date: new Date().toISOString()
      });
    }

    db.tasks[taskIndex] = updatedTask;
    writeDB(db);

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const db = readDB();
    const taskIndex = db.tasks.findIndex(t => t._id === req.params.id);

    if (taskIndex === -1) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (db.tasks[taskIndex].assignedUser !== req.user._id && req.user.role !== 'Admin') {
      res.status(401);
      throw new Error('Not authorized');
    }

    db.tasks.splice(taskIndex, 1);
    writeDB(db);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
