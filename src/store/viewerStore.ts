import { create } from 'zustand';
import { ViewerState, ModelControls } from '../types/model';

interface ViewerStore extends ViewerState, ModelControls {}

export const useViewerStore = create<ViewerStore>((set) => ({
  wireframe: false,
  autoRotate: false,
  backgroundColor: '#1a1a1a',
  lightIntensity: 1,
  showGrid: true,
  showAxes: true,
  cameraPosition: [5, 5, 5],
  isPlaying: false,

  setWireframe: (value) => set({ wireframe: value }),
  setAutoRotate: (value) => set({ autoRotate: value }),
  setBackgroundColor: (value) => set({ backgroundColor: value }),
  setLightIntensity: (value) => set({ lightIntensity: value }),
  setShowGrid: (value) => set({ showGrid: value }),
  setShowAxes: (value) => set({ showAxes: value }),
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setIsPlaying: (value) => set({ isPlaying: value }),
}));