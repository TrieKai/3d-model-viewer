import { create } from "zustand";
import { ViewerState, ModelControls } from "../types/model";

interface ViewerStore extends ViewerState, ModelControls {
  modelUrl: string | null;
  selectedAnimation: string | null;
  animationNames: string[];
  setModelUrl: (url: string | null) => void;
  setSelectedAnimation: (name: string | null) => void;
  setAnimationNames: (names: string[]) => void;
}

export const useViewerStore = create<ViewerStore>((set) => ({
  wireframe: false,
  autoRotate: false,
  backgroundColor: "#1a1a1a",
  lightIntensity: 1,
  showGrid: true,
  showAxes: true,
  cameraPosition: [5, 5, 5],
  isPlaying: false,
  modelUrl: null,
  selectedAnimation: null,
  animationNames: [],

  setWireframe: (value) => set({ wireframe: value }),
  setAutoRotate: (value) => set({ autoRotate: value }),
  setBackgroundColor: (value) => set({ backgroundColor: value }),
  setLightIntensity: (value) => set({ lightIntensity: value }),
  setShowGrid: (value) => set({ showGrid: value }),
  setShowAxes: (value) => set({ showAxes: value }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setIsPlaying: (value) => set({ isPlaying: value }),
  setModelUrl: (url) => set({ modelUrl: url }),
  setSelectedAnimation: (name) => set({ selectedAnimation: name }),
  setAnimationNames: (names) => set({ animationNames: names }),
}));
