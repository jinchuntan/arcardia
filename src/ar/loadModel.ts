import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

function normalizeModel(root: THREE.Object3D) {
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  if (box.isEmpty()) return root;

  const center = box.getCenter(new THREE.Vector3());

  // Center the model on the marker and place its base on the target plane.
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y;

  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.frustumCulled = false;
    }
  });

  root.updateMatrixWorld(true);
  return root;
}

export async function loadGLB(url: string): Promise<THREE.Object3D> {
  const gltf = await loader.loadAsync(url);
  return normalizeModel(gltf.scene);
}
