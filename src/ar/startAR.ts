import cardsData from "../content/cards.json";
import * as THREE from "three";
import { loadGLB } from "./loadModel";
import { initPanelUI, showCardInPanel, clearPanel } from "../ui/panel";

// IMPORTANT: must be imported from src/, so Vite can resolve "three" inside MindAR
// @ts-ignore
import { MindARThree } from "../vendor/mindar/mindar-image-three.prod.js";

type CardDef = {
  id: string;
  name: string;
  category?: string;
  targetIndex: number;
  model: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  facts?: string[];
};

export async function startAR() {
  // Ensure panel listeners are ready
  initPanelUI();

  const mindFile = "/targets/cards.mind";
  const head = await fetch(mindFile, { method: "HEAD" });
  if (!head.ok) {
    throw new Error(`Missing ${mindFile}. Put it at public/targets/cards.mind`);
  }

  const cards = (cardsData as any).cards as CardDef[];
  if (!cards?.length) throw new Error("cards.json has no cards");

  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: mindFile,
    maxTrack: 1
  });

  const { renderer, scene, camera } = mindarThree;
  renderer.setClearColor(0x000000, 0); // transparent background


  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1.0);
  dir.position.set(1, 2, 1);
  scene.add(dir);

  // Anchors (one per targetIndex in your cards list)
  const anchors = cards.map((c) => mindarThree.addAnchor(c.targetIndex));

  // Track loaded objects per anchor
  const loadedByAnchor = new Map<any, THREE.Object3D>();

  anchors.forEach((anchor: any, idx: number) => {
    const card = cards[idx];

    anchor.onTargetFound = async () => {
      showCardInPanel(card);

      if (loadedByAnchor.has(anchor)) return;

      try {
        const obj = await loadGLB(card.model);

        obj.scale.setScalar(card.scale ?? 1);

        const [px, py, pz] = card.position ?? [0, 0, 0];
        obj.position.set(px, py, pz);

        const [rx, ry, rz] = card.rotation ?? [0, 0, 0];
        obj.rotation.set(rx, ry, rz);

        anchor.group.add(obj);
        loadedByAnchor.set(anchor, obj);
      } catch (e) {
        console.error("Failed to load GLB:", e);
      }
    };

    anchor.onTargetLost = () => {
      clearPanel();

      const obj = loadedByAnchor.get(anchor);
      if (obj) {
        anchor.group.remove(obj);
        loadedByAnchor.delete(anchor);
      }
    };
  });

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    // Optional: slight rotation of any loaded object
    loadedByAnchor.forEach((obj) => {
      obj.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  });
}
