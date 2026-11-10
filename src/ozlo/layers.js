// Ozlo's art layers, positioned on a 560 × 580 stage (px).
// Every piece was cut from the same jelly core image, so the face patches
// sit exactly over the body. To swap art, replace the file and keep the name;
// if a new piece has a different size or spot, update its x/y/w/h here.

export const STAGE = { width: 560, height: 580 };

// Centre of the body: the bounce squashes and stretches around this point.
export const BODY_CENTRE = { x: 280, y: 260 };

const base = `${import.meta.env.BASE_URL}ozlo/`;

export const LAYERS = {
  body: { src: `${base}ozlo2-body.webp`, x: 40.5, y: 22, w: 479, h: 476 },
  drop1: { src: `${base}ozlo2-drop1.webp`, x: 409.4, y: 27.2, w: 114, h: 114 },
  drop2: { src: `${base}ozlo2-drop2.webp`, x: 43.8, y: 349, w: 76, h: 78 },
  drop3: { src: `${base}ozlo2-drop3.webp`, x: 488.1, y: 143.8, w: 55, h: 56 },

  // Face patches: each one covers part of the body's painted face.
  mouthClosed: { src: `${base}ozlo2-mouth-closed.webp`, x: 326.2, y: 238.2, w: 144, h: 170 },
  blinkPatch: { src: `${base}ozlo2-blink-patch.webp`, x: 67.3, y: 22.1, w: 431, h: 271 },
  lookUp: { src: `${base}ozlo2-look-up.webp`, x: 260.5, y: 135.2, w: 209, h: 166 },
  laugh: { src: `${base}ozlo2-laugh.webp`, x: 72, y: 105.5, w: 452, h: 285 },
};

// Closed-eyelid lines drawn over the blink patch (centre x/y, half-width r).
export const LIDS = [
  { cx: 274, cy: 218, r: 70 },
  { cx: 430, cy: 198, r: 38 },
];

// Ground shadow under the body.
export const SHADOW = { cx: 280, cy: 523, w: 250, h: 36 };
