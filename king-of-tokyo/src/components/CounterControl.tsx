interface CounterControlProps {
  value: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  label: string;
  accentColor?: string;
  disabled?: boolean;
  onSound?: () => void;
  onSoundDown?: () => void;
  compact?: boolean;
}

export default function CounterControl({
  value,
  min,
  max,
  onDecrement,
  onIncrement,
  label,
  accentColor = 'text-white',
  disabled = false,
  onSound,
  onSoundDown,
  compact = false,
}: CounterControlProps) {
  const btnSize = compact ? 'w-7 h-7 text-base' : 'w-9 h-9 text-lg';
  const numSize = compact ? 'w-8 text-xl' : 'w-10 text-2xl';
  const labelSize = compact ? 'text-[10px]' : 'text-xs';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`${labelSize} font-semibold uppercase tracking-widest ${accentColor} opacity-70`}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => { (onSoundDown ?? onSound)?.(); onDecrement(); }}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          className={`${btnSize} rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-colors active:scale-95 touch-manipulation`}
        >
          −
        </button>
        <span className={`${numSize} text-center font-bold tabular-nums ${accentColor}`}>
          {value}
        </span>
        <button
          onClick={() => { onSound?.(); onIncrement(); }}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          className={`${btnSize} rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold transition-colors active:scale-95 touch-manipulation`}
        >
          +
        </button>
      </div>
    </div>
  );
}
