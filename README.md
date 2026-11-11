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

## Morphs (drop → splat → rebound)

- Under **Form**, press **Car / wrap** or **Hat**, or type "how much for a car wrap?" and Send.
- Every change is one bouncy move: crouch, hop, drop, splat on the floor, spring back up
  as the new shape, land with a wobble. Form to form goes straight through the splat.
- Shared frames: `splat-impact`, `splat-recoil`, `ozlo-rebound`. Each form needs two more:
  `[form]-rebound` and `[form]-final`, listed in `FORM_FRAMES` in `src/ozlo/morphs.js`.
- Resting forms have no drips; their floating orbs are separate files listed under `orbs`
  in `src/ozlo/morphs.js`, so they pop free on landing and drift on their own.
- Frame positions and where the forward eyes sit on each are in `src/ozlo/morphs.js`.
- Timing and squash/stretch for each beat are in `buildSteps()` in `src/ozlo/useMorph.js`.
- `npm run preview` serves the built site at `/Ozlo.v1/`, same as GitHub Pages.
