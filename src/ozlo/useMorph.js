import { useEffect, useRef, useState } from 'react';
import { MORPH_PATHS } from './morphs.js';

// Timing (ms). Short holds keep each painted pose readable; the blends do the flowing.
const ANTICIPATION = 170; // squash before leaving core
const BLEND = 190; // goo blend between two frames
const HOLD = 60; // pause on each in-between frame
const SETTLE = 650; // wobble after the last frame lands

/**
 * Plays Ozlo between forms. Returns what to draw this frame:
 *  { morphing, from, to, u, sinceArrive, antic, settled }
 *  from/to  frame names being blended (u = 0 → from, 1 → to)
 *  sinceArrive  ms since the latest frame landed (drives the wobble)
 *  antic    0–1 anticipation squash before leaving core
 */
export default function useMorph(target, still) {
  const [view, setView] = useState({ morphing: false, from: 'core', to: 'core', u: 1, sinceArrive: 9999, antic: 0, settled: 'core' });
  const settled = useRef('core');
  const running = useRef(false);
  const queued = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (target === settled.current && !running.current) return;
    if (running.current) {
      queued.current = target;
      return;
    }
    play(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function pathTo(goal) {
    const from = settled.current;
    if (from === goal) return [];
    const out = from === 'core' ? [] : [...MORPH_PATHS[from]].reverse(); // back to core first
    const into = goal === 'core' ? [] : MORPH_PATHS[goal];
    const path = out.length && into.length ? [...out, ...into.slice(1)] : out.length ? out : into;
    return path.filter((f, i) => f !== path[i - 1]);
  }

  function play(goal) {
    const path = pathTo(goal);
    if (path.length < 2 || still) {
      settled.current = goal;
      setView({ morphing: false, from: goal, to: goal, u: 1, sinceArrive: 9999, antic: 0, settled: goal });
      return;
    }

    // Build a timeline of segments.
    const segs = [];
    if (path[0] === 'core') segs.push({ kind: 'antic', frame: 'core', dur: ANTICIPATION });
    for (let i = 0; i < path.length - 1; i += 1) {
      segs.push({ kind: 'blend', from: path[i], to: path[i + 1], dur: BLEND });
      if (i < path.length - 2) segs.push({ kind: 'hold', frame: path[i + 1], dur: HOLD });
    }
    segs.push({ kind: 'settle', frame: goal, dur: SETTLE });

    running.current = true;
    const start = performance.now();
    let lastArrive = start;

    const tick = (now) => {
      let t = now - start;
      let seg = null;
      let segStart = start;
      for (const s of segs) {
        if (t < s.dur) {
          seg = s;
          break;
        }
        t -= s.dur;
        segStart += s.dur;
      }

      if (!seg) {
        running.current = false;
        settled.current = goal;
        setView({ morphing: false, from: goal, to: goal, u: 1, sinceArrive: 9999, antic: 0, settled: goal });
        const next = queued.current;
        queued.current = null;
        if (next && next !== goal) play(next);
        return;
      }

      if (seg.kind === 'antic') {
        setView({ morphing: true, from: 'core', to: 'core', u: 1, sinceArrive: 9999, antic: t / seg.dur, settled: settled.current });
      } else if (seg.kind === 'blend') {
        const raw = t / seg.dur;
        const u = raw * raw * (3 - 2 * raw);
        if (raw > 0.5) lastArrive = Math.max(lastArrive, segStart + seg.dur * 0.5);
        setView({ morphing: true, from: seg.from, to: seg.to, u, sinceArrive: now - lastArrive, antic: 0, settled: settled.current });
      } else {
        setView({ morphing: true, from: seg.frame, to: seg.frame, u: 1, sinceArrive: now - lastArrive, antic: 0, settled: settled.current });
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  return view;
}

// Jelly wobble after a shape lands: returns [scaleX, scaleY].
export function wobble(ms, amount = 0.13) {
  if (ms > 900) return [1, 1];
  const v = amount * Math.exp(-ms / 190) * Math.cos((ms / 1000) * Math.PI * 2 * 4.2);
  return [1 - v * 0.6, 1 + v];
}
