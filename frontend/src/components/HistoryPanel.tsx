import { useEffect, useState } from 'react';
import type { RedemptionHistoryItem } from '../types';
import { api } from '../api/client';

interface Props {
  onClose: () => void;
}

export default function HistoryPanel({ onClose }: Props) {
  const [items, setItems] = useState<RedemptionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h2 className="history-title">Redemption History</h2>
          <button className="history-close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p className="history-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="history-empty">No redemptions yet.</p>
        ) : (
          <ul className="history-list">
            {items.map(item => (
              <li key={item.id} className="history-item">
                <span className="history-emoji">{item.reward_emoji ?? '🎁'}</span>
                <div className="history-details">
                  <span className="history-reward-name">{item.reward_label}</span>
                  <span className="history-meta">
                    {item.quantity > 1 && `${item.quantity}×  · `}{item.total_cost} pts
                  </span>
                </div>
                <span className="history-date">{formatDate(item.redeemed_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
