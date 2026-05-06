import { BookmarkPlus, Loader2, Play } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onSaveWatchlist: () => void;
  loading: boolean;
  canRun: boolean;
}

export function SearchBar({
  value,
  onChange,
  onRun,
  onSaveWatchlist,
  loading,
  canRun,
}: SearchBarProps) {
  return (
    <div className="searchBar glass">
      <div className="sectionLabel" style={{ marginTop: 0 }}>
        Ticker
      </div>
      <div className="searchRow">
        <input
          className="tickerInput"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder="e.g. NVDA, TSM, MU"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canRun && !loading) onRun();
          }}
        />
        <div className="actions">
          <button
            type="button"
            className="btn btnPrimary"
            onClick={onRun}
            disabled={!canRun || loading}
          >
            {loading ? (
              <Loader2 className="spin" size={18} aria-hidden />
            ) : (
              <Play size={18} aria-hidden />
            )}
            {loading ? 'Running…' : 'Run Agent'}
          </button>
          <button
            type="button"
            className="btn btnGhost"
            onClick={onSaveWatchlist}
            disabled={!value.trim()}
            title="Save ticker to watchlist"
          >
            <BookmarkPlus size={18} aria-hidden />
            Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
