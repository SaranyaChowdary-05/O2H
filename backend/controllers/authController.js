const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDB, writeDB, generateId } = require('../utils/mockDb');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.email === email)) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      _id: generateId(),
      name,
      email,
      password: hashedPassword,
      role: 'User',
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    writeDB(db);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u._id === req.user._id);

    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
