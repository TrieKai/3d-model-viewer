import * as THREE from 'three';

export interface ModelInfo {
  id: string;
  name: string;
  format: string;
  size?: number;
  animated: boolean;
  url: string;
}

export interface ViewerState {
  wireframe: boolean;
  autoRotate: boolean;
  backgroundColor: string;
  lightIntensity: number;
  showGrid: boolean;
  showAxes: boolean;
  cameraPosition: [number, number, number];
  isPlaying: boolean;
}

export interface ModelControls {
  setWireframe: (value: boolean) => void;
  setAutoRotate: (value: boolean) => void;
  setBackgroundColor: (value: string) => void;
  setLightIntensity: (value: number) => void;
  setShowGrid: (value: boolean) => void;
  setShowAxes: (value: boolean) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  setIsPlaying: (value: boolean) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      arrowHelper: THREE.Object3DProps & {
        args: [THREE.Vector3, THREE.Vector3, number, number | string];
      };
    }
  }
}