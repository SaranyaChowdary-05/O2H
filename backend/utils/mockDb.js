const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const dbPath = path.join(dataDir, 'db.json');

// Initialize database
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ 
    users: [], 
    tasks: [],
    teams: [],
    notifications: [],
    logs: [],
    reports: []
  }));
}

const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const generateId = () => Math.random().toString(36).substr(2, 9);

module.exports = { readDB, writeDB, generateId };
