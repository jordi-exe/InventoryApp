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

export type InventoryItemProps = {
	id: number;
	title: string;
	itemCount: number;
	category: string;
	location: string;
};

export async function loadInventory(db: SQLiteDatabase) {
	const items = db.getAllSync<InventoryItemProps>(`
		SELECT
			items.id,
			items.item_name AS title,
			items.item_quantity AS itemCount,
			categories.name AS category,
			locations.name AS location
		FROM items
		JOIN categories
			ON items.category_id = categories.id
		JOIN locations
			ON items.location_id = locations.id
		ORDER BY items.id;
	`);

	return items;
}

export async function loadOptions(db: SQLiteDatabase) {
	const unitsResult = await db.getAllAsync<{ name: string }>(
		"SELECT name FROM units ORDER BY name",
	);

	const categoriesResult = await db.getAllAsync<{ name: string }>(
		"SELECT name FROM categories ORDER BY name",
	);

	const locationsResult = await db.getAllAsync<{ name: string }>(
		"SELECT name FROM locations ORDER BY name",
	);

	return {
		units: unitsResult.map((row) => row.name),
		categories: categoriesResult.map((row) => row.name),
		locations: locationsResult.map((row) => row.name),
	};
}

export type AddItemProps = {
	itemName: string;
	quantity: number;
	unit: string;
	category: string;
	location: string;
	expiryDate: string | null;
};

export async function addItem(db: SQLiteDatabase, item: AddItemProps) {
	const trimmedItemName = item.itemName.trim();
	const trimmedUnit = item.unit.trim();
	const trimmedCategory = item.category.trim();
	const trimmedLocation = item.location.trim();

	await db.withTransactionAsync(async () => {
		//Category
		const categoryResult = await db.getFirstAsync<{ id: number }>(
			"SELECT id FROM categories WHERE name = ? COLLATE NOCASE",
			trimmedCategory,
		);

		let categoryId: number;

		if (categoryResult) {
			categoryId = categoryResult.id;
		} else {
			const result = await db.runAsync(
				"INSERT INTO categories (name) VALUES (?)",
				trimmedCategory,
			);

			categoryId = result.lastInsertRowId;
		}

		//Unit
		const unitResult = await db.getFirstAsync<{ id: number }>(
			"SELECT id FROM units WHERE name = ? COLLATE NOCASE",
			trimmedUnit,
		);

		let unitId: number;

		if (unitResult) {
			unitId = unitResult.id;
		} else {
			const result = await db.runAsync(
				"INSERT INTO units (name) VALUES (?)",
				trimmedUnit,
			);

			unitId = result.lastInsertRowId;
		}

		//Location
		const locationResult = await db.getFirstAsync<{ id: number }>(
			"SELECT id FROM locations WHERE name = ? COLLATE NOCASE",
			trimmedLocation,
		);

		let locationId: number;

		if (locationResult) {
			locationId = locationResult.id;
		} else {
			const result = await db.runAsync(
				"INSERT INTO locations (name) VALUES (?)",
				trimmedLocation,
			);

			locationId = result.lastInsertRowId;
		}

		//Item
		await db.runAsync(
			`
				INSERT INTO items (
					item_name,
					category_id,
					item_expiry_date,
					item_quantity,
					unit_id,
					location_id
				)
				VALUES (?, ?, ?, ?, ?, ?)
			`,
			trimmedItemName,
			categoryId,
			item.expiryDate,
			item.quantity,
			unitId,
			locationId,
		);
	});
}
