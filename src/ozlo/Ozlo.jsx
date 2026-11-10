import { useEffect, useId, useRef, useState } from 'react';
import { LAYERS, LIDS, SHADOW, STAGE, BODY_CENTRE } from './layers.js';
import { MORPH_FRAMES, EYES, BEAK, EYE_CENTRE, FACE_ON } from './morphs.js';
import useMorph, { wobble } from './useMorph.js';
import './Ozlo.css';

const GROUND = 498; // where Ozlo's base sits on the stage; squash and wobble pivot here

/**
 * Ozlo, the jelly helper.
 *
 * Props
 *  size         width in px (the stage keeps its 560 × 580 proportions)
 *  mood         'idle' | 'happy' | 'thinking'
 *  talking      true while a reply is streaming: the mouth flaps
 *  look         'center' | 'up'
 *  blinkSignal  change this number to force a blink (handy for testing)
 *  form         'core' | 'hat' – changing it plays the morph
 */
export default function Ozlo({ size = 150, mood = 'idle', talking = false, look = 'center', blinkSignal = 0, form = 'core' }) {
  const reduced = usePrefersReducedMotion();
  const hidden = usePageHidden();
  const still = reduced || hidden;
  const happy = mood === 'happy';

  const morph = useMorph(form, reduced);
  const asObject = morph.morphing || morph.settled !== 'core';

  const blinking = useBlink({ enabled: !still && !happy && !asObject, signal: asObject ? 0 : blinkSignal });
  const objectBlink = useBlink({ enabled: !still && !morph.morphing && morph.settled !== 'core', signal: asObject ? blinkSignal : 0 });
  const mouthOpen = useMouth({ talking: talking && !still && !asObject, idleSmiles: !still && mood === 'idle' && !asObject });

  const scale = size / STAGE.width;

  // Load the morph art in the background once the page is idle, so the first morph doesn't flicker.
  useEffect(() => {
    const load = () => [...Object.values(MORPH_FRAMES), EYES, BEAK].forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    idle(load);
  }, []);

  return (
    <div
      className="ozlo"
      data-mood={mood}
      data-still={still || undefined}
      style={{ width: size, height: STAGE.height * scale }}
      role="img"
      aria-label="Ozlo, the Osprey Visuals helper"
    >
      <div className="ozlo__stage" style={{ width: STAGE.width, height: STAGE.height, transform: `scale(${scale})` }}>
        <div
          className="ozlo__shadow"
          style={{ left: SHADOW.cx - SHADOW.w / 2, top: SHADOW.cy - SHADOW.h / 2, width: SHADOW.w, height: SHADOW.h }}
        />

        <div className="ozlo__bob" style={{ transformOrigin: `${BODY_CENTRE.x}px ${BODY_CENTRE.y}px` }}>
          <div className="ozlo__glow" style={{ left: BODY_CENTRE.x - 280, top: BODY_CENTRE.y - 280 }} />

          {asObject ? (
            <MorphView view={morph} blinking={objectBlink} />
          ) : (
            <CoreFace
              look={look}
              happy={happy}
              mouthOpen={mouthOpen}
              blinking={blinking}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Ozlo's own painted face, with the face patches swapped in as needed.
function CoreFace({ look, happy, mouthOpen, blinking }) {
  return (
    <>
          <Layer name="body" />
          <Layer name="lookUp" show={look === 'up' && !happy} />
          <Layer name="laugh" show={happy} />
          <Layer name="mouthClosed" show={!happy && !mouthOpen} />
          <Layer name="blinkPatch" show={blinking} />
          <svg
            className="ozlo__lids"
            data-hide={!blinking || undefined}
            width={STAGE.width}
            height={STAGE.height}
            viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
            aria-hidden="true"
          >
            {LIDS.map(({ cx, cy, r }) => (
              <path
                key={cx}
                d={`M ${cx - 0.94 * r} ${cy - 0.19 * r} A ${r} ${0.55 * r} 0 0 1 ${cx + 0.94 * r} ${cy - 0.19 * r}`}
              />
            ))}
          </svg>

          <Layer name="drop1" className="ozlo__drop ozlo__drop--1" />
          <Layer name="drop2" className="ozlo__drop ozlo__drop--2" />
          <Layer name="drop3" className="ozlo__drop ozlo__drop--3" />
    </>
  );
}

// Morphing (or resting as an object): painted frames blended through a "goo" filter
// so their outlines flow into each other, with one face layer gliding on top.
function MorphView({ view, blinking }) {
  const id = useId().replace(/:/g, '');
  const { from, to, u, antic, sinceArrive } = view;
  const blending = from !== to;
  const blur = blending ? 2 + 9 * Math.sin(Math.PI * u) : 0;

  let [sx, sy] = wobble(sinceArrive);
  if (antic) {
    sx *= 1 + 0.1 * antic;
    sy *= 1 - 0.1 * antic;
  }

  const a = FACE_ON[from];
  const b = FACE_ON[to];
  const mix = (k) => a[k] + (b[k] - a[k]) * u;
  const face = { cx: mix('cx'), cy: mix('cy'), s: mix('s'), beak: mix('beak') };

  return (
    <div
      className="ozlo__morph"
      style={{ transform: `scale(${sx}, ${sy})`, transformOrigin: `${BODY_CENTRE.x}px ${GROUND}px` }}
    >
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={`goo${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div className="ozlo__frames" style={{ filter: blur ? `url(#goo${id})` : 'none' }}>
        <Frame name={from} opacity={blending ? 1 - u : 1} />
        {blending && <Frame name={to} opacity={u} />}
      </div>

      <div
        className="ozlo__face"
        data-blink={blinking || undefined}
        style={{
          transform: `translate(${face.cx - EYE_CENTRE.x}px, ${face.cy - EYE_CENTRE.y}px) scale(${face.s})`,
          transformOrigin: `${EYE_CENTRE.x}px ${EYE_CENTRE.y}px`,
        }}
      >
        <img className="ozlo__layer" src={BEAK.src} alt="" draggable="false" style={{ left: BEAK.x, top: BEAK.y, width: BEAK.w, height: BEAK.h, opacity: face.beak }} />
        <img className="ozlo__layer ozlo__eyes" src={EYES.src} alt="" draggable="false" style={{ left: EYES.x, top: EYES.y, width: EYES.w, height: EYES.h }} />
      </div>
    </div>
  );
}

function Frame({ name, opacity }) {
  if (name === 'core') {
    // Ozlo's painted body and droplets, held still while he melts.
    return (
      <div className="ozlo__frame" style={{ opacity }}>
        {['body', 'drop1', 'drop2', 'drop3'].map((n) => (
          <Layer key={n} name={n} />
        ))}
      </div>
    );
  }
  const f = MORPH_FRAMES[name];
  return (
    <img
      className="ozlo__layer"
      src={f.src}
      alt=""
      draggable="false"
      style={{ left: f.x, top: f.y, width: f.w, height: f.h, opacity }}
    />
  );
}

function Layer({ name, show = true, className = '' }) {
  const { src, x, y, w, h } = LAYERS[name];
  return (
    <img
      className={`ozlo__layer ${className}`}
      data-hide={!show || undefined}
      src={src}
      alt=""
      draggable="false"
      style={{ left: x, top: y, width: w, height: h }}
    />
  );
}

// Blinks every 2.8–5.5 s at random, sometimes twice in a row.
function useBlink({ enabled, signal }) {
  const [blinking, setBlinking] = useState(false);
  const timers = useRef([]);

  const blinkOnce = (delay = 0) => {
    timers.current.push(setTimeout(() => setBlinking(true), delay));
    timers.current.push(setTimeout(() => setBlinking(false), delay + 130));
  };

  useEffect(() => {
    if (!enabled) return undefined;
    let next;
    const schedule = () => {
      next = setTimeout(() => {
        blinkOnce();
        if (Math.random() < 0.15) blinkOnce(260);
        schedule();
      }, 2800 + Math.random() * 2700);
    };
    schedule();
    return () => {
      clearTimeout(next);
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setBlinking(false);
    };
  }, [enabled]);

  useEffect(() => {
    if (signal && enabled) blinkOnce();
  }, [signal]); // eslint-disable-line react-hooks/exhaustive-deps

  return blinking;
}

// Talking: the mouth flaps open/closed at an uneven rhythm.
// Idle: closed, with a short open smile now and then.
function useMouth({ talking, idleSmiles }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!talking) return undefined;
    let t;
    const flap = (isOpen) => {
      setOpen(isOpen);
      t = setTimeout(() => flap(!isOpen), isOpen ? 110 + Math.random() * 90 : 70 + Math.random() * 80);
    };
    flap(true);
    return () => {
      clearTimeout(t);
      setOpen(false);
    };
  }, [talking]);

  useEffect(() => {
    if (talking || !idleSmiles) return undefined;
    let t;
    const cycle = () => {
      t = setTimeout(() => {
        setOpen(true);
        t = setTimeout(() => {
          setOpen(false);
          cycle();
        }, 1600);
      }, 6000 + Math.random() * 5000);
    };
    cycle();
    return () => clearTimeout(t);
  }, [talking, idleSmiles]);

  return open;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function usePageHidden() {
  const [hidden, setHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);
  return hidden;
}
