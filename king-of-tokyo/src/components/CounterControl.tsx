interface CounterControlProps {
  value: number;
  min: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
  label: string;
  accentColor?: string;
  disabled?: boolean;
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
}: CounterControlProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-xs font-semibold uppercase tracking-widest ${accentColor} opacity-70`}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          disabled={disabled || value <= min}
          aria-label={`Decrease ${label}`}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors active:scale-95 touch-manipulation"
        >
          −
        </button>
        <span className={`w-10 text-center text-2xl font-bold tabular-nums ${accentColor}`}>
          {value}
        </span>
        <button
          onClick={onIncrement}
          disabled={disabled || value >= max}
          aria-label={`Increase ${label}`}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg transition-colors active:scale-95 touch-manipulation"
        >
          +
        </button>
      </div>
    </div>
  );
}
