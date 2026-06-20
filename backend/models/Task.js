const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add a due date'],
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
