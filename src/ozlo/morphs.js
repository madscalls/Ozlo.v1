// Morph frames and the forward-facing eyes, on the same 560 × 580 stage as layers.js.
// Every frame stands on the same ground line (y = 498) and is scaled to Ozlo's size.

const base = `${import.meta.env.BASE_URL}ozlo/morphs/`;

export const GROUND = 498;

// Resting frames carry their floating orbs separately so the orbs can drift on their own.
export const FRAMES = {
  'splat-impact': { src: `${base}splat-impact.webp`, x: 10.0, y: 313, w: 540, h: 185 },
  'splat-recoil': { src: `${base}splat-recoil.webp`, x: 65.0, y: 225, w: 430, h: 273 },
  'ozlo-rebound': { src: `${base}ozlo-rebound.webp`, x: 124.0, y: 38, w: 312, h: 460 },
  'car-rebound': { src: `${base}car-rebound.webp`, x: 90.5, y: 58, w: 379, h: 440 },
  'car-final': {
    src: `${base}car-final.webp`, x: 65.0, y: 108.7, w: 430, h: 389,
    orbs: [
      { src: `${base}car-final-orb1.webp`, x: 398.5, y: 131.4, w: 74, h: 72 },
      { src: `${base}car-final-orb2.webp`, x: 87.7, y: 220.3, w: 49, h: 50 },
      { src: `${base}car-final-orb3.webp`, x: 444.6, y: 212.4, w: 26, h: 26 },
    ],
  },
  'brim': { src: `${base}brim.webp`, x: 34.0, y: 55, w: 492, h: 443 },
  'hat-final': {
    src: `${base}hat-final.webp`, x: 55.0, y: 132.2, w: 450, h: 366,
    orbs: [
      { src: `${base}hat-final-orb1.webp`, x: 353.8, y: 163.1, w: 74, h: 70 },
      { src: `${base}hat-final-orb2.webp`, x: 34, y: 236, w: 39, h: 38 },
      { src: `${base}hat-final-orb3.webp`, x: 418.9, y: 236.9, w: 33, h: 32 },
    ],
  },
  'sign-rebound': { src: `${base}sign-rebound.webp`, x: 64.5, y: 58, w: 431, h: 440 },
  'sign-final': {
    src: `${base}sign-final.webp`, x: 60.0, y: 71, w: 440, h: 427,
    orbs: [
      { src: `${base}car-final-orb1.webp`, x: 470.0, y: 25, w: 74, h: 72 },
      { src: `${base}car-final-orb2.webp`, x: 22.0, y: 263.1, w: 49, h: 50 },
      { src: `${base}car-final-orb3.webp`, x: 506.0, y: 105.2, w: 26, h: 26 },
    ],
  },
};

// Forward-facing eyes (240 × 105 at scale 1), shown on every frame except Ozlo's own painted face.
export const EYES = { src: `${base}eyes-front.webp`, w: 240, h: 105 };

// Where the eyes sit on each frame: centre (cx, cy) and scale (sx, sy).
export const EYES_ON = {
  'splat-impact': { cx: 280.0, cy: 427.7, sx: 0.95, sy: 0.304 },
  'splat-recoil': { cx: 280.0, cy: 347.9, sx: 0.9, sy: 0.54 },
  'ozlo-rebound': { cx: 280.0, cy: 189.8, sx: 0.95, sy: 0.95 },
  'car-rebound': { cx: 268.6, cy: 190.0, sx: 0.75, sy: 0.637 },
  'car-final': { cx: 249.9, cy: 256.5, sx: 0.74, sy: 0.703 },
  'brim': { cx: 309.5, cy: 232.2, sx: 0.9, sy: 0.9 },
  'hat-final': { cx: 307.0, cy: 278.6, sx: 0.8, sy: 0.8 },
  'sign-final': { cx: 280.0, cy: 224.7, sx: 0.85, sy: 0.807 },
  'sign-rebound': { cx: 280.0, cy: 190.0, sx: 0.85, sy: 0.765 },
};

// Each form: the frame it springs up as after the splat, and the shape it lands as.
// 'core' lands as Ozlo's own painted body. Add a form here once its two frames exist.
export const FORM_FRAMES = {
  core: { rebound: 'ozlo-rebound', final: 'core' },
  car: { rebound: 'car-rebound', final: 'car-final' },
  hat: { rebound: 'brim', final: 'hat-final' }, // placeholder rebound until hat-rebound is made
  sign: { rebound: 'sign-rebound', final: 'sign-final' },
};

// Scenery that grows out of the floor with a form (stays put while the form bounces).
// Three stages: sprouting (during the rebound), growing (on landing), full (at rest).
export const GROUND_DECOR = {
  sign: [
    { src: `${base}grass-1.webp`, x: 10.0, y: 441, w: 540, h: 71 },
    { src: `${base}grass-2.webp`, x: 10.0, y: 402, w: 540, h: 110 },
    { src: `${base}grass-3.webp`, x: 10.0, y: 408, w: 540, h: 104 },
  ],
};
