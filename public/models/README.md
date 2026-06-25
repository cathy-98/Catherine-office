# Temporary 3D Model Slots

This folder is ready for final `.glb` assets. Current scene objects are geometry placeholders, and each interactive object already stores its future model path in `src/components/hero-office/officeData.ts`.

Expected future files:

- `office.glb`
- `oficina-reference.glb` temporary CC BY room base downloaded from Sketchfab: `Oficina` by `maralflop1`. It is retinted in code and should be credited if kept in production.
- `laptop.glb`
- `macbook/model.obj` currently loaded from `Laptop - MacBook Pro/model.obj` with `materials.mtl`
- `coffee.glb`
- `aurora-coronada.glb` currently loaded from `gato_coronado.glb`
- `aurora-gangnam.glb` kept as an unused alternate experiment from `el_gato_gangnam_style.glb`
- `camera.glb`
- `window.glb`
- `notebook.glb`
- `cat-tree.glb` decorative model currently loaded from `Cat Tree.glb`
- `desk.glb` currently loaded from `Desk.glb`
- `digital-setup.glb` neutralized decorative model currently loaded from `gamer_setup_pack.glb`
- `office-pack/window-blinds` from The Office Pack
- `office-pack/plant-white-pot` from The Office Pack
- `office-pack/chair` from The Office Pack
- `office-pack/book-stack` from The Office Pack
- `office-pack/wall-art` from The Office Pack
- `office-pack/wall-shelf` from The Office Pack
- `office-pack/whiteboard` from The Office Pack
- `office-pack/blank-frame` from The Office Pack
- `office-pack/clock` from The Office Pack
- `office-pack/coffee-cup` from The Office Pack
- `office-pack/computer-mouse` from The Office Pack
- `office-pack/binder` from The Office Pack
- `office-pack/bins` from The Office Pack
- `office-pack/coat-rack` from The Office Pack

When the models are ready, load them in `OfficeScene.tsx` and `InteractiveObject.tsx`, replacing the placeholder geometry while keeping the same object IDs and panel data.
