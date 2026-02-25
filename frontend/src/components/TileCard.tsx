import type { Reward } from '../types';

interface Props {
  reward: Reward;
  isActive: boolean;
  onClick: () => void;
}

export default function TileCard({ reward, isActive, onClick }: Props) {
  const hasPhoto = !!reward.image;
  const bgStyle: React.CSSProperties = hasPhoto
    ? { backgroundImage: `url(/${reward.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: reward.gradient ?? '#1c1c20' };

  return (
    <div className={`tile${isActive ? ' tile-active' : ''}`} onClick={onClick}>
      <div className={`tile-bg${hasPhoto ? ' tile-bg-photo' : ''}`} style={bgStyle}>
        {!hasPhoto && <span className="tile-emoji">{reward.emoji}</span>}
        <div className="tile-info">
          <span className="tile-name">{reward.label}</span>
          <span className="tile-cost">{reward.cost} pts</span>
        </div>
      </div>
    </div>
  );
}
