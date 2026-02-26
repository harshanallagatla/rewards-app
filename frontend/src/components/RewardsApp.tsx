import { useState, useRef, useEffect, useCallback } from 'react';
import type { User, Reward } from '../types';
import { api } from '../api/client';
import TileCard from './TileCard';
import HistoryPanel from './HistoryPanel';
import AddPointsModal from './AddPointsModal';

interface Props {
  user: User;
  onPointsUpdate: (pts: number) => void;
  onSignOut: () => void;
}

export default function RewardsApp({ user, onPointsUpdate, onSignOut }: Props) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [atEnd, setAtEnd] = useState(false);
  const [toast, setToast] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addPointsOpen, setAddPointsOpen] = useState(false);
  const [emailPopup, setEmailPopup] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.getRewards().then(r => {
      setRewards(r);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setQty(1);
  }, [activeIdx]);

  const handleTrackScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  const startScroll = useCallback((dir: number) => {
    scrollTimerRef.current = setInterval(() => {
      trackRef.current?.scrollBy({ left: dir * 3 });
      handleTrackScroll();
    }, 16);
  }, [handleTrackScroll]);

  const stopScroll = useCallback(() => {
    if (scrollTimerRef.current) clearInterval(scrollTimerRef.current);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleRedeem() {
    const reward = rewards[activeIdx];
    if (!reward) return;
    setConfirmOpen(false);
    try {
      const res = await api.redeem(reward.id, qty);
      onPointsUpdate(res.new_points);
      setQty(1);
      showToast(`Redeemed ${qty > 1 ? `${qty}× ` : ''}${reward.label}!`);
      setEmailPopup(true);
      setTimeout(() => setEmailPopup(false), 4000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Redemption failed');
    }
  }

  if (loading) {
    return (
      <div className="app">
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', paddingTop: 80 }}>Loading rewards…</p>
      </div>
    );
  }

  const reward = rewards[activeIdx];
  const totalCost = reward ? reward.cost * qty : 0;
  const canAfford = user.points >= (reward?.cost ?? Infinity);
  const maxQty = reward ? Math.floor(user.points / reward.cost) : 0;

  return (
    <div className="app">
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-left">
          <span className="username-chip">{user.username}</span>
          <span className="points-badge">{user.points.toLocaleString()} pts</span>
          {user.is_admin && (
            <button className="add-points-btn" onClick={() => setAddPointsOpen(true)}>
              ADD POINTS
            </button>
          )}
        </div>
        <button className="history-btn" onClick={() => setHistoryOpen(true)}>HISTORY</button>
        <button className="signout-btn" onClick={onSignOut}>LOGOUT</button>
      </div>

      {/* Tile row */}
      <div className="tile-wrapper">
        <div
          className="tile-track"
          ref={trackRef}
          onScroll={handleTrackScroll}
        >
          {rewards.map((r, i) => (
            <TileCard
              key={r.id}
              reward={r}
              isActive={i === activeIdx}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
        {!atEnd && <div className="tile-fade-right" />}
        <div
          className="scroll-zone-right"
          onMouseEnter={() => startScroll(1)}
          onMouseLeave={stopScroll}
        />
        <div
          className="scroll-zone-left"
          onMouseEnter={() => startScroll(-1)}
          onMouseLeave={stopScroll}
        />
      </div>

      {/* Bottom bar */}
      {reward && (
        <div className="bottom-bar">
          <div className="bottom-left">
            <p className="reward-desc">{reward.description}</p>
            <p className="avail-text">
              Up to {maxQty} redemption{maxQty !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="bottom-right">
            <div className={`qty-stepper${!canAfford ? ' qty-disabled' : ''}`}>
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={!canAfford || qty <= 1}
              >−</button>
              <span className="qty-label">
                {qty} × {reward.cost}<span className="qty-pts"> pts</span>
              </span>
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                disabled={!canAfford || qty >= maxQty}
              >+</button>
            </div>
            <button
              className={`redeem-btn${!canAfford ? ' redeem-disabled' : ''}`}
              onClick={() => canAfford && setConfirmOpen(true)}
              disabled={!canAfford}
            >
              {canAfford ? 'REDEEM NOW' : 'NOT ENOUGH POINTS'}
            </button>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirmOpen && reward && (
        <div className="modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <p className="modal-title">Confirm Redemption</p>
            <p className="modal-body">
              Redeem {qty > 1 ? `${qty}× ` : ''}<strong>{reward.label}</strong> for{' '}
              <strong>{totalCost} pts</strong>?
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="modal-confirm" onClick={handleRedeem}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Email confirmation popup */}
      {emailPopup && (
        <div className="email-popup">
          <span className="email-popup-icon">✉️</span>
          <div>
            <p className="email-popup-title">Check your email!</p>
            <p className="email-popup-sub">A confirmation has been sent to you.</p>
          </div>
        </div>
      )}

      {/* History panel */}
      {historyOpen && <HistoryPanel onClose={() => setHistoryOpen(false)} />}

      {/* Add Points modal (admin only) */}
      {addPointsOpen && <AddPointsModal onClose={() => setAddPointsOpen(false)} />}
    </div>
  );
}
