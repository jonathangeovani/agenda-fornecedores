import { type SQLiteDatabase } from 'expo-sqlite';

export const initializeDatabase = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      company TEXT,
      phone TEXT,
      isImportant INTEGER,
      days TEXT
    );
  `);

  // await db.execAsync(`
  //   DROP TABLE suppliers;
  // `);
};
