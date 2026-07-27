import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "safar-gold.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
    seedIfEmpty(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS gold_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      karat INTEGER NOT NULL,
      category TEXT NOT NULL,
      margin_buy REAL NOT NULL DEFAULT 3.0,
      margin_sell REAL NOT NULL DEFAULT 2.0,
      is_auto INTEGER NOT NULL DEFAULT 1,
      manual_buy INTEGER,
      manual_sell INTEGER
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      gold_type_id TEXT NOT NULL,
      base_price INTEGER NOT NULL,
      buy_price INTEGER NOT NULL,
      sell_price INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (gold_type_id) REFERENCES gold_types(id)
    );

    CREATE INDEX IF NOT EXISTS idx_price_date ON price_history(date);
    CREATE INDEX IF NOT EXISTS idx_price_type_date ON price_history(gold_type_id, date);

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export interface GoldTypeRow {
  id: string;
  name: string;
  karat: number;
  category: string;
  margin_buy: number;
  margin_sell: number;
  is_auto: number;
  manual_buy: number | null;
  manual_sell: number | null;
}

export interface PriceHistoryRow {
  id: number;
  date: string;
  gold_type_id: string;
  base_price: number;
  buy_price: number;
  sell_price: number;
  created_at: string;
}

export interface AppSettingRow {
  key: string;
  value: string;
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as c FROM gold_types").get() as { c: number };
  if (count.c > 0) return;

  const insertType = db.prepare(
    "INSERT INTO gold_types (id, name, karat, category, margin_buy, margin_sell) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const types = [
    ["antam-100", "Antam 100gr", 24, "antam", 3.0, 2.0],
    ["antam-50", "Antam 50gr", 24, "antam", 3.0, 2.0],
    ["antam-25", "Antam 25gr", 24, "antam", 3.5, 2.5],
    ["ubs-100", "UBS 100gr", 24, "ubs", 3.0, 2.0],
    ["ubs-50", "UBS 50gr", 24, "ubs", 3.5, 2.5],
    ["perhiasan-24k", "Perhiasan 24K", 24, "perhiasan", 5.0, 3.0],
    ["perhiasan-22k", "Perhiasan 22K", 22, "perhiasan", 5.0, 3.0],
    ["perhiasan-18k", "Perhiasan 18K", 18, "perhiasan", 5.0, 3.0],
  ];

  const insertAll = db.transaction(() => {
    for (const t of types) insertType.run(...t);
  });

  insertAll();

  const insertSetting = db.prepare("INSERT INTO app_settings (key, value) VALUES (?, ?)");
  const settings: [string, string][] = [
    ["api_key", ""],
    ["usd_idr_rate", "16300"],
    ["last_price_update", ""],
    ["phone", "+62 812-3456-7890"],
    ["email", "info@safargold.com"],
    ["address", "Jl. Emas No. 1, Jakarta"],
    ["weekday_open", "09:00"],
    ["weekday_close", "17:00"],
    ["saturday_open", "09:00"],
    ["saturday_close", "14:00"],
  ];

  const seedSettings = db.transaction(() => {
    for (const [k, v] of settings) insertSetting.run(k, v);
  });

  seedSettings();
}
