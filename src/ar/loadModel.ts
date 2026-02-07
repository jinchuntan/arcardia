import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

export async function loadGLB(url: string): Promise<THREE.Object3D> {
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}
