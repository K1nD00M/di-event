import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'leads.db')

let db: Database.Database | null = null

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        name TEXT NOT NULL,
        contact_method TEXT NOT NULL DEFAULT 'telegram',
        contact_value TEXT NOT NULL,
        client_type TEXT NOT NULL,
        event_type TEXT,
        guests TEXT,
        event_date TEXT,
        message TEXT,
        budget TEXT,
        calc_summary TEXT,
        status TEXT NOT NULL DEFAULT 'new'
      )
    `)
    /* Миграция для существующих баз данных */
    const cols = (db.prepare("PRAGMA table_info(leads)").all() as {name:string}[]).map(r => r.name)
    if (cols.includes('phone') && !cols.includes('contact_value')) {
      /* Старая схема: phone → contact_value */
      db.exec(`
        ALTER TABLE leads ADD COLUMN contact_method TEXT NOT NULL DEFAULT 'telegram';
        ALTER TABLE leads ADD COLUMN contact_value TEXT NOT NULL DEFAULT '';
        ALTER TABLE leads ADD COLUMN calc_summary TEXT;
      `)
      db.exec(`UPDATE leads SET contact_value = phone WHERE contact_value = ''`)
    } else {
      if (!cols.includes('contact_method')) db.exec("ALTER TABLE leads ADD COLUMN contact_method TEXT NOT NULL DEFAULT 'telegram'")
      if (!cols.includes('contact_value'))  db.exec("ALTER TABLE leads ADD COLUMN contact_value TEXT NOT NULL DEFAULT ''")
      if (!cols.includes('calc_summary'))   db.exec("ALTER TABLE leads ADD COLUMN calc_summary TEXT")
    }
  }
  return db
}

export interface Lead {
  id: number
  created_at: string
  name: string
  contact_method: string
  contact_value: string
  client_type: string
  event_type: string
  guests: string
  event_date: string
  message: string
  budget: string
  calc_summary: string
  status: string
}

export function insertLead(data: Omit<Lead, 'id' | 'created_at' | 'status'>) {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO leads (name, contact_method, contact_value, client_type, event_type, guests, event_date, message, budget, calc_summary)
    VALUES (@name, @contact_method, @contact_value, @client_type, @event_type, @guests, @event_date, @message, @budget, @calc_summary)
  `)
  return stmt.run(data)
}

export function getAllLeads(): Lead[] {
  const db = getDb()
  return db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as Lead[]
}

export function updateLeadStatus(id: number, status: string) {
  const db = getDb()
  return db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id)
}

export function deleteLead(id: number) {
  const db = getDb()
  return db.prepare('DELETE FROM leads WHERE id = ?').run(id)
}
