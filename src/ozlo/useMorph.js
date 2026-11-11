import { useEffect, useRef, useState } from 'react';
import { FORM_FRAMES } from './morphs.js';

// The transformation is one bouncy move: crouch, hop, drop, SPLAT on the floor,
// spring back up already becoming the new shape, then land with a jelly wobble.
// Each step: which frame shows, how long (ms), and where it moves/stretches.
// y is the lift above the floor (negative = up); sx/sy are squash and stretch.
// `fade` blends in from the previous frame through the goo filter.
function buildSteps(fromForm, toForm) {
  const from = fromForm === 'core' ? 'core' : FORM_FRAMES[fromForm].final;
  const { rise, rebound, final } = FORM_FRAMES[toForm];
  const steps = [
    { frame: from, dur: 120, y: [0, 0], sx: [1, 1.12], sy: [1, 0.86], ease: 'out' }, // crouch
    { frame: from, dur: 170, y: [0, -70], sx: [1.12, 0.9], sy: [0.86, 1.14], ease: 'out' }, // hop
    { frame: from, dur: 150, y: [-70, 0], sx: [0.9, 0.86], sy: [1.14, 1.18], ease: 'in' }, // drop
    { frame: 'splat-impact', dur: 110, y: [0, 0], sx: [1.15, 1], sy: [0.7, 1], ease: 'out', fade: 40 }, // splat
    { frame: 'splat-recoil', dur: 90, y: [0, 0], sx: [0.92, 1.04], sy: [1, 0.92], ease: 'out', fade: 50 }, // gather
    // rise: pulls up out of the puddle (only for forms that have this frame)
    { frame: rise, dur: 110, y: [0, 0], sx: [1.06, 0.96], sy: [0.88, 1.06], ease: 'out', fade: 50 },
    { frame: rebound, dur: 200, y: [0, -80], sx: [0.9, 0.97], sy: [1.12, 1.04], ease: 'out', fade: 60 }, // spring up
    { frame: final, dur: 140, y: [-80, 0], sx: [0.96, 0.96], sy: [1.06, 1.06], ease: 'in', fade: 70 }, // fall into shape
    { frame: final, dur: 650, y: [0, 0], wobble: true }, // land
  ];
  return steps.filter((st) => st.frame);
}

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const easeIn = (t) => t * t;
const lerp = ([a, b], t) => a + (b - a) * t;

// Jelly wobble after landing: [scaleX, scaleY].
export function wobble(ms, amount = 0.16) {
  const v = amount * Math.exp(-ms / 170) * Math.cos((ms / 1000) * Math.PI * 2 * 4.2);
  return [1 + v * 0.6, 1 - v];
}

const REST = (form) => ({
  active: false,
  frame: form === 'core' ? 'core' : FORM_FRAMES[form].final,
  prev: null,
  mix: 1,
  y: 0,
  sx: 1,
  sy: 1,
  settled: form,
});

/**
 * Plays Ozlo between forms. Returns what to draw:
 *  frame / prev  current frame and the one fading out (mix: 0 = all prev, 1 = all frame)
 *  y, sx, sy     lift and squash/stretch, pivoting on the floor
 *  settled       the form he's resting as when not moving
 */
export default function useMorph(target, reduced) {
  const [view, setView] = useState(REST('core'));
  const settled = useRef('core');
  const running = useRef(false);
  const queued = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!FORM_FRAMES[target]) return;
    if (running.current) {
      queued.current = target;
      return;
    }
    if (target !== settled.current) play(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function play(goal) {
    if (reduced) {
      settled.current = goal;
      setView(REST(goal));
      return;
    }
    const steps = buildSteps(settled.current, goal);
    running.current = true;
    const start = performance.now();

    const tick = (now) => {
      let t = now - start;
      let i = 0;
      while (i < steps.length && t >= steps[i].dur) {
        t -= steps[i].dur;
        i += 1;
      }

      if (i >= steps.length) {
        running.current = false;
        settled.current = goal;
        setView(REST(goal));
        const next = queued.current;
        queued.current = null;
        if (next && next !== goal) play(next);
        return;
      }

      const s = steps[i];
      const p = t / s.dur;
      let y = 0;
      let sx = 1;
      let sy = 1;
      if (s.wobble) {
        [sx, sy] = wobble(t);
      } else {
        const e = s.ease === 'in' ? easeIn(p) : easeOut(p);
        y = lerp(s.y, e);
        sx = lerp(s.sx, e);
        sy = lerp(s.sy, e);
      }
      const prevFrame = i > 0 ? steps[i - 1].frame : null;
      const fading = s.fade && prevFrame && prevFrame !== s.frame && t < s.fade;
      setView({
        active: true,
        frame: s.frame,
        prev: fading ? prevFrame : null,
        mix: fading ? t / s.fade : 1,
        y,
        sx,
        sy,
        settled: settled.current,
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  return view;
}
