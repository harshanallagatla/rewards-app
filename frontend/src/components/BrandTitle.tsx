const STARS: { style: React.CSSProperties; char: string; cls?: string }[] = [
  // Top arc — twinkle
  { char: '✦', style: { top: '-22px', left:  '2%',  fontSize: '0.62rem', animationDelay: '0s'   } },
  { char: '✧', style: { top: '-12px', left:  '14%', fontSize: '0.38rem', animationDelay: '0.8s' } },
  { char: '✸', style: { top: '-28px', left:  '30%', fontSize: '0.72rem', animationDelay: '0.3s' }, cls: 'brand-star-accent' },
  { char: '✦', style: { top: '-18px', left:  '46%', fontSize: '0.52rem', animationDelay: '1.5s' } },
  { char: '⋆',  style: { top: '-8px',  left:  '60%', fontSize: '0.5rem',  animationDelay: '2.3s' } },
  { char: '✧', style: { top: '-14px', right: '20%', fontSize: '0.42rem', animationDelay: '0.4s' } },
  { char: '✸', style: { top: '-26px', right:  '6%', fontSize: '0.65rem', animationDelay: '1.0s' }, cls: 'brand-star-accent' },
  // Mid sides — pulse
  { char: '✦', style: { top:  '4px',  left: '-14px', fontSize: '0.44rem', animationDelay: '1.7s' } },
  { char: '✧', style: { top:  '8px',  right:'-10px', fontSize: '0.36rem', animationDelay: '0.9s' } },
  { char: '⋆',  style: { top: '50%',  left: '-20px', fontSize: '0.5rem',  animationDelay: '2.5s' } },
  { char: '⋆',  style: { top: '50%',  right:'-18px', fontSize: '0.48rem', animationDelay: '0.1s' } },
  // Bottom arc — twinkle
  { char: '✧', style: { bottom: '-16px', left:  '8%',  fontSize: '0.4rem',  animationDelay: '0.6s' } },
  { char: '✦', style: { bottom: '-22px', left:  '26%', fontSize: '0.56rem', animationDelay: '1.8s' } },
  { char: '✸', style: { bottom: '-30px', left:  '48%', fontSize: '0.68rem', animationDelay: '1.2s' }, cls: 'brand-star-accent' },
  { char: '✦', style: { bottom: '-18px', right: '18%', fontSize: '0.44rem', animationDelay: '0.2s' } },
  { char: '✧', style: { bottom: '-12px', right:  '4%', fontSize: '0.38rem', animationDelay: '2.0s' } },
  // Floating micro-stars within text zone
  { char: '·',  style: { top: '18%',  left: '18%',  fontSize: '0.9rem', animationDelay: '1.3s', opacity: 0.5 } },
  { char: '·',  style: { top: '65%',  left: '72%',  fontSize: '0.9rem', animationDelay: '2.7s', opacity: 0.5 } },
];

export default function BrandTitle() {
  return (
    <h1 className="app-brand">
      <span className="brand-inner">
        {STARS.map((s, i) => (
          <span key={i} className={`brand-star${s.cls ? ' ' + s.cls : ''}`} style={s.style}>{s.char}</span>
        ))}
        Stardust Rewards
      </span>
    </h1>
  );
}
