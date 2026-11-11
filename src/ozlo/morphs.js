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
      { src: `${base}hat-final-orb2.webp`, x: 84.1, y: 459.6, w: 39, h: 38 },
      { src: `${base}hat-final-orb3.webp`, x: 418.9, y: 236.9, w: 33, h: 32 },
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
};

// Each form: the frame it springs up as after the splat, and the shape it lands as.
// 'core' lands as Ozlo's own painted body. Add a form here once its two frames exist.
export const FORM_FRAMES = {
  core: { rebound: 'ozlo-rebound', final: 'core' },
  car: { rebound: 'car-rebound', final: 'car-final' },
  hat: { rebound: 'brim', final: 'hat-final' }, // placeholder rebound until hat-rebound is made
};
