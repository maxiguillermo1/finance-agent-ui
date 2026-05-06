import { Bookmark, X } from 'lucide-react';
import type { WatchlistTicker } from '../types/finance';

export interface WatchlistProps {
  items: WatchlistTicker[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}

export function Watchlist({ items, onSelect, onRemove }: WatchlistProps) {
  return (
    <aside className="watchlist glass">
      <h2 className="watchlistTitle">
        <Bookmark size={18} aria-hidden strokeWidth={2} />
        Watchlist
      </h2>
      {items.length === 0 ? (
        <p className="watchlistEmpty">
          Save symbols you are tracking. Click a row to drop it into the search field.
        </p>
      ) : (
        <ul className="watchlistList">
          {items.map((item) => (
            <li key={item.symbol} className="watchlistItem">
              <button
                type="button"
                className="watchlistSymbol"
                onClick={() => onSelect(item.symbol)}
              >
                {item.symbol}
              </button>
              <button
                type="button"
                className="watchlistRemove"
                aria-label={`Remove ${item.symbol}`}
                onClick={() => onRemove(item.symbol)}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
