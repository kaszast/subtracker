import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Subscription, BillingCycle, Currency, Category } from '@/types';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'subscriptions.db');

// Biztosítjuk a mappa létezését
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL');
    initDb(dbInstance);
  }
  return dbInstance;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'HUF',
      billing_cycle TEXT NOT NULL DEFAULT 'monthly',
      next_billing_date TEXT NOT NULL,
      category TEXT NOT NULL,
      payment_method TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      is_trial INTEGER NOT NULL DEFAULT 0,
      trial_end_date TEXT,
      notes TEXT,
      icon TEXT,
      color TEXT,
      url TEXT,
          domain TEXT,
          status TEXT DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id TEXT PRIMARY KEY,
      subscription_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      FOREIGN KEY(subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Ellenőrizzük, van-e már adat. Ha üres, seedelünk néhány kezdeti népszerű előfizetést
  const countRow = db.prepare('SELECT COUNT(*) as count FROM subscriptions').get() as { count: number };
  if (countRow.count === 0) {
    seedInitialSubscriptions(db);
  }
}

function seedInitialSubscriptions(db: Database.Database) {
  const now = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  const dateInDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return formatYMD(d);
  };

  const sampleSubscriptions = [
    {
      id: 'sub-netflix',
      name: 'Netflix Premium',
      amount: 4490,
      currency: 'HUF',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(3),
      category: 'Streaming & Média',
      payment_method: 'OTP Főkártya',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: '4K családi csomag',
      icon: 'Tv',
      color: '#E50914',
      url: 'https://netflix.com',
      domain: 'netflix.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sub-google-ai',
      name: 'Google AI (Gemini Advanced)',
      amount: 8290,
      currency: 'HUF',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(7),
      category: 'AI & Produktivitás',
      payment_method: 'Revolut Virtual',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: 'Google One 2TB felhőtárhely + Gemini 1.5 Pro',
      icon: 'Sparkles',
      color: '#4285F4',
      url: 'https://one.google.com',
      domain: 'google.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sub-youtube',
      name: 'YouTube Premium',
      amount: 2390,
      currency: 'HUF',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(14),
      category: 'Streaming & Média',
      payment_method: 'OTP Főkártya',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: 'Reklámmentes YouTube és YouTube Music',
      icon: 'Youtube',
      color: '#FF0000',
      url: 'https://youtube.com',
      domain: 'youtube.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sub-apple-tv',
      name: 'Apple TV+',
      amount: 2790,
      currency: 'HUF',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(21),
      category: 'Streaming & Média',
      payment_method: 'Apple Pay (Revolut)',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: 'Apple Originals sorozatok',
      icon: 'Apple',
      color: '#000000',
      url: 'https://tv.apple.com',
      domain: 'apple.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sub-spotify',
      name: 'Spotify Premium Individual',
      amount: 1990,
      currency: 'HUF',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(18),
      category: 'Zene & Podcast',
      payment_method: 'OTP Főkártya',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: 'Zene és podcast letöltés offline módhoz',
      icon: 'Music',
      color: '#1DB954',
      url: 'https://spotify.com',
      domain: 'spotify.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sub-chatgpt',
      name: 'ChatGPT Plus',
      amount: 20,
      currency: 'USD',
      billing_cycle: 'monthly',
      next_billing_date: dateInDays(9),
      category: 'AI & Produktivitás',
      payment_method: 'Revolut Virtual',
      is_active: 1,
      is_trial: 0,
      trial_end_date: null,
      notes: 'GPT-4o és Canvas eszközök',
      icon: 'Bot',
      color: '#10A37F',
      url: 'https://chat.openai.com',
      domain: 'openai.com',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const insert = db.prepare(`
    INSERT INTO subscriptions (
      id, name, amount, currency, billing_cycle, next_billing_date,
      category, payment_method, is_active, is_trial, trial_end_date,
      notes, icon, color, url, domain, status, created_at, updated_at
    ) VALUES (
      @id, @name, @amount, @currency, @billing_cycle, @next_billing_date,
      @category, @payment_method, @is_active, @is_trial, @trial_end_date,
      @notes, @icon, @color, @url, @domain, @status, @created_at, @updated_at
    )
  `);

  const insertMany = db.transaction((subs) => {
    for (const sub of subs) insert.run(sub);
  });

  insertMany(sampleSubscriptions);
}

function mapRowToSubscription(row: any): Subscription {
  return {
    id: row.id,
    name: row.name,
    amount: Number(row.amount),
    currency: row.currency as Currency,
    billingCycle: row.billing_cycle as BillingCycle,
    nextBillingDate: row.next_billing_date,
    category: row.category as Category,
    paymentMethod: row.payment_method || undefined,
    isActive: Boolean(row.is_active),
    isTrial: Boolean(row.is_trial),
    trialEndDate: row.trial_end_date || undefined,
    notes: row.notes || undefined,
    icon: row.icon || undefined,
    color: row.color || undefined,
    url: row.url || undefined,
    domain: row.domain || undefined,
    status: row.status || 'active',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function getAllSubscriptions(): Subscription[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM subscriptions ORDER BY next_billing_date ASC').all();
  return rows.map(mapRowToSubscription);
}

export function getSubscriptionById(id: string): Subscription | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(id);
  if (!row) return null;
  return mapRowToSubscription(row);
}

export function createSubscription(data: Omit<Subscription, 'createdAt' | 'updatedAt'>): Subscription {
  const db = getDb();
  const now = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO subscriptions (
      id, name, amount, currency, billing_cycle, next_billing_date,
      category, payment_method, is_active, is_trial, trial_end_date,
      notes, icon, color, url, domain, status, created_at, updated_at
    ) VALUES (
      @id, @name, @amount, @currency, @billingCycle, @nextBillingDate,
      @category, @paymentMethod, @isActive, @isTrial, @trialEndDate,
      @notes, @icon, @color, @url, @domain, @status, @createdAt, @updatedAt
    )
  `);

  stmt.run({
    id: data.id,
    name: data.name,
    amount: data.amount,
    currency: data.currency,
    billingCycle: data.billingCycle,
    nextBillingDate: data.nextBillingDate,
    category: data.category,
    paymentMethod: data.paymentMethod || null,
    isActive: data.isActive ? 1 : 0,
    isTrial: data.isTrial ? 1 : 0,
    trialEndDate: data.trialEndDate || null,
    notes: data.notes || null,
    icon: data.icon || null,
    color: data.color || null,
    url: data.url || null,
    domain: data.domain || null,
    status: data.status || 'active',
    createdAt: now,
    updatedAt: now
  });

  const historyId = `ph-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  db.prepare('INSERT INTO price_history (id, subscription_id, amount, currency, changed_at) VALUES (?, ?, ?, ?, ?)').run(historyId, data.id, data.amount, data.currency, now);
  return getSubscriptionById(data.id)!;
}

export function updateSubscription(id: string, data: Partial<Subscription>): Subscription | null {
  const db = getDb();
  const existing = getSubscriptionById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const merged = { ...existing, ...data, updatedAt: now };

  const stmt = db.prepare(`
    UPDATE subscriptions SET
      name = @name,
      amount = @amount,
      currency = @currency,
      billing_cycle = @billingCycle,
      next_billing_date = @nextBillingDate,
      category = @category,
      payment_method = @paymentMethod,
      is_active = @isActive,
      is_trial = @isTrial,
      trial_end_date = @trialEndDate,
      notes = @notes,
      icon = @icon,
      color = @color,
      url = @url,
      domain = @domain,
      status = @status,
      updated_at = @updatedAt
    WHERE id = @id
  `);

  stmt.run({
    id,
    name: merged.name,
    amount: merged.amount,
    currency: merged.currency,
    billingCycle: merged.billingCycle,
    nextBillingDate: merged.nextBillingDate,
    category: merged.category,
    paymentMethod: merged.paymentMethod || null,
    isActive: merged.isActive ? 1 : 0,
    isTrial: merged.isTrial ? 1 : 0,
    trialEndDate: merged.trialEndDate || null,
    notes: merged.notes || null,
    icon: merged.icon || null,
    color: merged.color || null,
    url: merged.url || null,
    domain: merged.domain || null,
    status: merged.status || 'active',
    updatedAt: now
  });

  if (existing.amount !== merged.amount || existing.currency !== merged.currency) {
    const historyId = `ph-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    db.prepare('INSERT INTO price_history (id, subscription_id, amount, currency, changed_at) VALUES (?, ?, ?, ?, ?)').run(historyId, id, merged.amount, merged.currency, now);
  }
  return getSubscriptionById(id);
}

export function deleteSubscription(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM subscriptions WHERE id = ?').run(id);
  return result.changes > 0;
}

export function importSubscriptions(subscriptions: Subscription[], mode: 'replace' | 'merge' = 'replace'): { count: number } {
  const db = getDb();
  const now = new Date().toISOString();

  const transaction = db.transaction((subs: Subscription[]) => {
    if (mode === 'replace') {
      db.prepare('DELETE FROM subscriptions').run();
    }

    const insert = db.prepare(`
      INSERT OR REPLACE INTO subscriptions (
        id, name, amount, currency, billing_cycle, next_billing_date,
        category, payment_method, is_active, is_trial, trial_end_date,
        notes, icon, color, url, domain, status, created_at, updated_at
      ) VALUES (
        @id, @name, @amount, @currency, @billingCycle, @nextBillingDate,
        @category, @paymentMethod, @isActive, @isTrial, @trialEndDate,
        @notes, @icon, @color, @url, @domain, @status, @createdAt, @updatedAt
      )
    `);

    for (const sub of subs) {
      insert.run({
        id: sub.id,
        name: sub.name,
        amount: Number(sub.amount),
        currency: sub.currency || 'HUF',
        billingCycle: sub.billingCycle || 'monthly',
        nextBillingDate: sub.nextBillingDate,
        category: sub.category || 'Egyéb',
        paymentMethod: sub.paymentMethod || null,
        isActive: sub.isActive ? 1 : 0,
        isTrial: sub.isTrial ? 1 : 0,
        trialEndDate: sub.trialEndDate || null,
        notes: sub.notes || null,
        icon: sub.icon || null,
        color: sub.color || null,
        url: sub.url || null,
        domain: sub.domain || null,
        status: sub.status || 'active',
        createdAt: sub.createdAt || now,
        updatedAt: now
      });
    }
  });

  transaction(subscriptions);
  return { count: subscriptions.length };
}


export function getPriceHistory(subscriptionId: string): import('@/types').PriceHistory[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM price_history WHERE subscription_id = ? ORDER BY changed_at DESC').all(subscriptionId);
  return rows.map((r: any) => ({
    id: r.id,
    subscriptionId: r.subscription_id,
    amount: Number(r.amount),
    currency: r.currency,
    changedAt: r.changed_at
  }));
}
