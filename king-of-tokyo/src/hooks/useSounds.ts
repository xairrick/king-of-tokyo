import { useCallback, useRef } from 'react';

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  /** Higher-pitched tick for increment (+) button */
  const playClickUp = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  }, [getCtx]);

  /** Lower-pitched tick for decrement (−) button */
  const playClickDown = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);
  }, [getCtx]);

  /** Dramatic descending tone when a player's health hits zero */
  const playDeath = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const dur = 2.0;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    osc1.connect(g); osc2.connect(g); g.connect(ctx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.exponentialRampToValueAtTime(35, now + dur);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(90, now);
    osc2.frequency.exponentialRampToValueAtTime(28, now + dur);
    g.gain.setValueAtTime(0.35, now);
    g.gain.setValueAtTime(0.35, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc1.start(now); osc1.stop(now + dur);
    osc2.start(now); osc2.stop(now + dur);
  }, [getCtx]);

  /**
   * Monster-specific smash sounds — each tuned to the monster's personality.
   * cyber-kitty : electronic screech/purr  (rising sine sweep)
   * gigazaur    : dino roar                (low sawtooth growl)
   * meka-dragon : fire breath              (metallic noise burst + pitch drop)
   * kong        : chest-pound thump        (sub-bass triangle thud)
   * alienoid    : laser zap               (fast sci-fi sweep)
   */
  const playSmash = useCallback((monsterId: string) => {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (monsterId === 'cyber-kitty') {
      // Electronic screech: rapid rising sweep with vibrato
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); osc2.connect(g); g.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, now);
      osc2.frequency.exponentialRampToValueAtTime(4000, now + 0.2);
      g.gain.setValueAtTime(0.4, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now); osc.stop(now + 0.5);
      osc2.start(now); osc2.stop(now + 0.5);

    } else if (monsterId === 'gigazaur') {
      // Deep dino roar: layered low sawtooth growl
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc1.connect(g); osc2.connect(g); g.connect(ctx.destination);
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.setValueAtTime(60, now + 0.1);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.8);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(55, now);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      g.gain.setValueAtTime(0.5, now);
      g.gain.setValueAtTime(0.5, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc1.start(now); osc1.stop(now + 0.9);
      osc2.start(now); osc2.stop(now + 0.9);

    } else if (monsterId === 'meka-dragon') {
      // Metallic fire breath: noise burst with descending metallic tone
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); osc2.connect(g); g.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(600, now);
      osc2.frequency.exponentialRampToValueAtTime(150, now + 0.4);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.45, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now); osc.stop(now + 0.7);
      osc2.start(now); osc2.stop(now + 0.7);

    } else if (monsterId === 'kong') {
      // Chest-pound thump: sub-bass triangle hit + impact
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); osc2.connect(g); g.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.3);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(60, now);
      osc2.frequency.exponentialRampToValueAtTime(20, now + 0.5);
      g.gain.setValueAtTime(0.6, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now); osc.stop(now + 0.55);
      osc2.start(now); osc2.stop(now + 0.55);

    } else {
      // alienoid — sci-fi laser zap: fast descending frequency sweep
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); osc2.connect(g); g.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(3000, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1500, now);
      osc2.frequency.exponentialRampToValueAtTime(100, now + 0.35);
      g.gain.setValueAtTime(0.3, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
      osc2.start(now); osc2.stop(now + 0.4);
    }
  }, [getCtx]);

  return { playClickUp, playClickDown, playDeath, playSmash };
}
