# Field Notes — Energy Portfolio (Phase 1 Prototype)

A cinematic portfolio prototype: full-screen video hero, a typography divider,
one continuous React Three Fiber environment with seven scroll-driven
project chapters, and a footer. Built with Next.js (App Router), React
Three Fiber, drei, and GSAP ScrollTrigger. See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
for how to ship this to Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — lint with ESLint (Next.js 16 removed the `next lint` command; this project runs `eslint` directly)

## Structure

```
app/          route entry (layout.jsx, page.jsx)
components/   HeroVideo, SiteNavigation, DividerSection, ThreeExperience,
              PlaceholderEnvironment, CameraRig, ProjectChapter,
              ProjectOverlay, EnergyPaths, LoadingScreen, Footer
data/         sections.js, cameraStops.js — content and camera stops the
              3D scene and chapter overlays are generated from
public/       images/, videos/, models/ static assets
styles/       globals.css design tokens
```

## Content placeholders to replace later

- `public/models/infrastructure.glb` — future Blender environment; the
  integration point is marked in `components/PlaceholderEnvironment.jsx`
- `data/sections.js` — real project copy/media for the 11 chapters
- Footer contact links in `components/Footer.jsx`

No environment variables are required to build or run this project.
