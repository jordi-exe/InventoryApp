import type { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
	await db.execAsync(`
		PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

		CREATE TABLE IF NOT EXISTS categories (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS locations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS labels (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE
		);

    CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
    );

		CREATE TABLE IF NOT EXISTS items (
			id INTEGER PRIMARY KEY AUTOINCREMENT,

			item_name TEXT NOT NULL,

			category_id INTEGER NOT NULL,

			item_expiry_date TEXT,

      item_quantity REAL NOT NULL DEFAULT 0,

      unit_id INTEGER NOT NULL,

      location_id INTEGER NOT NULL,

			date_added TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

			FOREIGN KEY (category_id)
				REFERENCES categories(id),
      
      FOREIGN KEY (unit_id)
        REFERENCES units(id),

			FOREIGN KEY (location_id)
				REFERENCES locations(id)
		);

		CREATE TABLE IF NOT EXISTS item_labels (
			item_id INTEGER NOT NULL,

			label_id INTEGER NOT NULL,

			PRIMARY KEY (item_id, label_id),

			FOREIGN KEY (item_id)
				REFERENCES items(id)
				ON DELETE CASCADE,

			FOREIGN KEY (label_id)
				REFERENCES labels(id)
				ON DELETE CASCADE
		);
	`);
}
