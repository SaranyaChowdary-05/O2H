const { readDB, writeDB, generateId } = require('../utils/mockDb');

const getTeamMembers = async (req, res, next) => {
  try {
    const db = readDB();
    const members = db.teams.map(t => ({
      ...t,
      user: db.users.find(u => u._id === t.userId)
    }));

    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

const inviteMember = async (req, res, next) => {
  try {
    const db = readDB();
    if (req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Admin access required');
    }

    const { email, role } = req.body;
    const existingUser = db.users.find(u => u.email === email);
    
    if (!existingUser) {
      res.status(404);
      throw new Error('User not found in system. They must register first.');
    }

    const teamMember = {
      _id: generateId(),
      userId: existingUser._id,
      teamRole: role,
      joinedAt: new Date().toISOString()
    };

    db.teams.push(teamMember);
    writeDB(db);

    res.status(201).json({ success: true, data: teamMember });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeamMembers, inviteMember };
