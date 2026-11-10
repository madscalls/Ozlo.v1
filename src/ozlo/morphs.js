// Morph frames and face layers, positioned on the same 560 × 580 stage as layers.js.
// Generated from the transformation1 art; each frame is scaled to Ozlo's volume and
// stands on the same ground line, so shapes flow into each other without jumping.

const base = `${import.meta.env.BASE_URL}ozlo/morphs/`;

export const MORPH_FRAMES = {
  blob: { src: `${base}blob.webp`, x: 20.0, y: 243, w: 520, h: 255 },
  squash: { src: `${base}squash.webp`, x: 20.0, y: 242, w: 520, h: 256 },
  melt: { src: `${base}melt.webp`, x: 20.0, y: 94, w: 520, h: 404 },
  ball: { src: `${base}ball.webp`, x: 39.5, y: 71, w: 481, h: 427 },
  brim: { src: `${base}brim.webp`, x: 34.0, y: 55, w: 492, h: 443 },
  hat: { src: `${base}hat.webp`, x: 20.0, y: 79, w: 520, h: 419 },
};

// Eyes (no beak) and beak, placed exactly over Ozlo's painted face.
export const EYES = { src: `${base}eyes.webp`, x: 184.0, y: 129.4, w: 298, h: 162 };
export const BEAK = { src: `${base}beak.webp`, x: 336.4, y: 231.0, w: 115, h: 64 };
export const EYE_CENTRE = { x: 333.0, y: 210.4 };

// Where the eyes sit on each frame: centre as a fraction of the frame box, eye scale,
// and how visible the beak is (it fades out as Ozlo becomes an object).
export const FACE_ON = {
  core: { cx: 333.0, cy: 210.4, s: 1, beak: 1 },
  blob: { cx: 394.4, cy: 355.2, s: 0.62, beak: 1 },
  squash: { cx: 384.0, cy: 349.5, s: 0.6, beak: 1 },
  melt: { cx: 342.4, cy: 255.6, s: 0.6, beak: 0.6 },
  ball: { cx: 318.5, cy: 241.8, s: 0.75, beak: 0.25 },
  brim: { cx: 289.8, cy: 232.2, s: 0.75, beak: 0 },
  hat: { cx: 310, cy: 222, s: 0.72, beak: 0 },
};

// The frames each form passes through, starting from core Ozlo. Played in reverse to come back.
export const MORPH_PATHS = {
  hat: ['core', 'blob', 'squash', 'melt', 'ball', 'brim', 'hat'],
};
