import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ReportCard } from '../components/ReportCard';
import { Watchlist } from '../components/Watchlist';
import { runFinanceAgent } from '../lib/agent';
import {
  deleteReport,
  deleteTicker,
  getReports,
  getWatchlist,
  saveReport,
  saveTicker,
} from '../lib/storage';
import type { FinanceReport, WatchlistTicker } from '../types/finance';

export function App() {
  const [tickerInput, setTickerInput] = useState('');
  const [reports, setReports] = useState<FinanceReport[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistTicker[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    try {
      setLoadError(null);
      const list = await getReports();
      setReports(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load reports');
    }
  }, []);

  const refreshWatchlist = useCallback(async () => {
    try {
      setLoadError(null);
      const list = await getWatchlist();
      setWatchlist(list);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load watchlist');
    }
  }, []);

  useEffect(() => {
    void refreshReports();
    void refreshWatchlist();
  }, [refreshReports, refreshWatchlist]);

  const handleRun = async () => {
    const t = tickerInput.trim();
    if (!t) return;
    setLoading(true);
    try {
      const report = await runFinanceAgent(t);
      await saveReport(report);
      setReports((prev) =>
        [report, ...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Agent run failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReport(id);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveWatchlist = async () => {
    const t = tickerInput.trim();
    if (!t) return;
    await saveTicker(t);
    await refreshWatchlist();
  };

  const handleRemoveWatchlist = async (symbol: string) => {
    await deleteTicker(symbol);
    await refreshWatchlist();
  };

  const handleSelectWatchlist = (symbol: string) => {
    setTickerInput(symbol);
  };

  const canRun = tickerInput.trim().length > 0;

  return (
    <div className="appShell">
      <header className="appHeader">
        <h1 className="appTitle">Finance research desk</h1>
        <p className="appSubtitle">
          Run a mocked research agent on any ticker, keep reports locally, and curate a short watchlist—built for fast iteration before wiring a real model.
        </p>
        <p className="disclaimer">
          This is a research assistant prototype, not financial advice.
        </p>
      </header>

      {loadError ? (
        <p className="disclaimer" role="alert" style={{ color: '#fb7185', textAlign: 'center' }}>
          {loadError}
        </p>
      ) : null}

      <div className="layout">
        <div>
          <SearchBar
            value={tickerInput}
            onChange={setTickerInput}
            onRun={() => void handleRun()}
            onSaveWatchlist={() => void handleSaveWatchlist()}
            loading={loading}
            canRun={canRun}
          />

          <div className="reportsStack">
            <div className="reportsHeader">
              <h2 className="reportsHeading">Saved reports</h2>
              <span className="reportsMeta">{reports.length} stored locally</span>
            </div>
            {reports.length === 0 ? (
              <div className="emptyReports glass">
                No reports yet. Enter a ticker and run the agent—everything persists in IndexedDB on this device.
              </div>
            ) : (
              reports.map((r) => (
                <ReportCard key={r.id} report={r} onDelete={(id) => void handleDeleteReport(id)} />
              ))
            )}
          </div>
        </div>

        <Watchlist
          items={watchlist}
          onSelect={handleSelectWatchlist}
          onRemove={(sym) => void handleRemoveWatchlist(sym)}
        />
      </div>
    </div>
  );
}
