import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'portfolio.db');

if (fs.existsSync(dbPath)) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    DELETE FROM certificates;
    DELETE FROM projects;
    DELETE FROM skills;
    DELETE FROM students;
    VACUUM;
  `);

  console.log('Database tables cleared successfully.');
  db.close();
}

// Clean uploaded files but keep directories
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.lstatSync(fullPath).isFile()) {
        fs.unlinkSync(fullPath);
      }
    }
  }
}

cleanDirectory(path.join(process.cwd(), 'public', 'uploads', 'resumes'));
cleanDirectory(path.join(process.cwd(), 'public', 'uploads', 'certificates'));

console.log('Upload directories cleaned.');
