# Ozlo sandbox

A place to build Ozlo, the Osprey Visuals helper, before he moves into the site
(`src/components/Ozlo` in OVS2).

## Run it

```
npm install
npm run dev
```

Open the address it prints. The big Ozlo is for checking detail; the one in the
bottom-right corner is real size.

## What's where

- `public/ozlo/`: the art layers (WebP). Replace a file with the same name to swap art.
- `src/ozlo/layers.js`: where each layer sits on the 560 × 580 stage.
- `src/ozlo/Ozlo.jsx`: the component (props: `size`, `mood`, `talking`, `look`, `blinkSignal`).
- `src/ozlo/Ozlo.css`: all the motion (bounce, droplets, shadow, glow).
- `src/ozlo/forms.js`: keywords that cue each form (hat, shirt, van…).
- `src/App.jsx`: the test page.

## Morphs

- Press **Hat** under Form (or type "I need hats" and Send) to watch the morph.
- Frames live in `public/ozlo/morphs/`; their positions and where the eyes sit on each
  are in `src/ozlo/morphs.js`. The order of frames per form is `MORPH_PATHS`.
- Timing is at the top of `src/ozlo/useMorph.js` (blend, hold, anticipation, settle).
- To swap the eyes, replace `public/ozlo/morphs/eyes.webp` (same canvas as the core art).
