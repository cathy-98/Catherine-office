# Temporary 3D Model Slots

This folder is ready for final `.glb` assets. Current scene objects are geometry placeholders, and each interactive object already stores its future model path in `src/components/hero-office/officeData.ts`.

Expected future files:

- `office.glb`
- `laptop.glb`
- `coffee.glb`
- `aurora.glb`
- `camera.glb`
- `window.glb`
- `notebook.glb`

When the models are ready, load them in `OfficeScene.tsx` and `InteractiveObject.tsx`, replacing the placeholder geometry while keeping the same object IDs and panel data.
