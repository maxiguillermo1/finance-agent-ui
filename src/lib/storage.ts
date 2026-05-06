import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { FinanceReport, WatchlistTicker } from '../types/finance';

const DB_NAME = 'finance-agent-db';
const DB_VERSION = 1;
const REPORTS_STORE = 'reports';
const WATCHLIST_STORE = 'watchlist';

interface FinanceAgentDB extends DBSchema {
  [REPORTS_STORE]: {
    key: string;
    value: FinanceReport;
  };
  [WATCHLIST_STORE]: {
    key: string;
    value: WatchlistTicker;
  };
}

let dbPromise: Promise<IDBPDatabase<FinanceAgentDB>> | null = null;

function getDB(): Promise<IDBPDatabase<FinanceAgentDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FinanceAgentDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(REPORTS_STORE)) {
          database.createObjectStore(REPORTS_STORE, { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains(WATCHLIST_STORE)) {
          database.createObjectStore(WATCHLIST_STORE, { keyPath: 'symbol' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveReport(report: FinanceReport): Promise<void> {
  const db = await getDB();
  await db.put(REPORTS_STORE, report);
}

export async function getReports(): Promise<FinanceReport[]> {
  const db = await getDB();
  const all = await db.getAll(REPORTS_STORE);
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deleteReport(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(REPORTS_STORE, id);
}

export async function saveTicker(ticker: string): Promise<void> {
  const symbol = ticker.trim().toUpperCase();
  if (!symbol) return;
  const db = await getDB();
  const entry: WatchlistTicker = {
    symbol,
    addedAt: new Date().toISOString(),
  };
  await db.put(WATCHLIST_STORE, entry);
}

export async function getWatchlist(): Promise<WatchlistTicker[]> {
  const db = await getDB();
  const all = await db.getAll(WATCHLIST_STORE);
  return all.sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}

export async function deleteTicker(ticker: string): Promise<void> {
  const db = await getDB();
  await db.delete(WATCHLIST_STORE, ticker.trim().toUpperCase());
}
