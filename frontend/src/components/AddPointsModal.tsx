import { useState, useEffect } from 'react';
import type { UserListItem } from '../types';
import { api } from '../api/client';

interface Props {
  onClose: () => void;
}

export default function AddPointsModal({ onClose }: Props) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [pointsToAdd, setPointsToAdd] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.getUsers().then(setUsers).catch(() => setError('Failed to load users'));
  }, []);

  const selectedUser = users.find(u => u.id === selectedId);

  async function handleSubmit() {
    if (!selectedId) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await api.addPoints(selectedId, pointsToAdd);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setSuccess(`Added ${pointsToAdd} pts to ${updated.username}. New total: ${updated.points} pts`);
      setSelectedId('');
      setPointsToAdd(10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add points');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 400 }} onClick={e => e.stopPropagation()}>
        <p className="modal-title">Add Points</p>

        <div className="auth-field" style={{ marginBottom: 16 }}>
          <label className="auth-field-label">SELECT USER</label>
          <select
            className="auth-input"
            value={selectedId}
            onChange={e => setSelectedId(Number(e.target.value))}
            style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', paddingRight: 16 }}
          >
            <option value="">— choose a user —</option>
            {users.map(u => (
              <option key={u.id} value={u.id} style={{ background: '#1c1c20' }}>
                {u.username} ({u.points.toLocaleString()} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="auth-field" style={{ marginBottom: 20 }}>
          <label className="auth-field-label">POINTS TO ADD</label>
          <div className="qty-stepper" style={{ width: 'fit-content', marginTop: 4 }}>
            <button
              className="qty-btn"
              onClick={() => setPointsToAdd(p => Math.max(10, p - 10))}
            >−</button>
            <span className="qty-label" style={{ minWidth: 70 }}>{pointsToAdd} pts</span>
            <button
              className="qty-btn"
              onClick={() => setPointsToAdd(p => p + 10)}
            >+</button>
          </div>
        </div>

        {selectedUser && (
          <p className="modal-body" style={{ marginBottom: 16 }}>
            <strong>{selectedUser.username}</strong> will go from{' '}
            <strong>{selectedUser.points.toLocaleString()}</strong> →{' '}
            <strong>{(selectedUser.points + pointsToAdd).toLocaleString()}</strong> pts
          </p>
        )}

        {error && <p className="auth-error" style={{ marginBottom: 12 }}>{error}</p>}
        {success && (
          <p style={{ fontSize: '0.83rem', color: '#6be06b', marginBottom: 12, background: 'rgba(80,200,80,0.08)', borderRadius: 6, padding: '8px 12px' }}>
            {success}
          </p>
        )}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Close</button>
          <button
            className="modal-confirm"
            onClick={handleSubmit}
            disabled={!selectedId || loading}
          >
            {loading ? 'Adding…' : 'Add Points'}
          </button>
        </div>
      </div>
    </div>
  );
}
