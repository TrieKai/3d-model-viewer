import { useRef, Suspense, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  PerspectiveCamera,
  useGLTF,
  Html,
  useAnimations,
} from "@react-three/drei";
import { useViewerStore } from "../store/viewerStore";
import { Loader } from "lucide-react";
import * as THREE from "three";

function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  const {
    isPlaying,
    selectedAnimation,
    setSelectedAnimation,
    setAnimationNames,
  } = useViewerStore();

  scene.traverse((child): void => {
    if (child instanceof THREE.Mesh) {
      child.material.wireframe = wireframe;
    }
  });

  useEffect(() => {
    setAnimationNames(names);
    if (names.length > 0 && !selectedAnimation) {
      setSelectedAnimation(names[0]);
    }
  }, [names, selectedAnimation, setSelectedAnimation, setAnimationNames]);

  useEffect(() => {
    if (names.length > 0) {
      Object.values(actions).forEach((action) => action?.stop());

      if (isPlaying && selectedAnimation && actions[selectedAnimation]) {
        actions[selectedAnimation].reset().play();
      }
    }
  }, [actions, names, isPlaying, selectedAnimation]);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.setScalar(scale);

      scene.position.sub(center.multiplyScalar(scale));
      scene.position.y = 0;
    }
  }, [scene]);

  return (
    <>
      <primitive ref={group} object={scene} />
      <ModelInfo url={url} />
    </>
  );
}

function AxesHelper() {
  return (
    <group>
      <arrowHelper
        args={[
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 0, 0),
          1,
          0xff0000,
        ]}
      />
      <arrowHelper
        args={[
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(0, 0, 0),
          1,
          0x00ff00,
        ]}
      />
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(0, 0, 0),
          1,
          0x0000ff,
        ]}
      />
    </group>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg">
        <Loader className="animate-spin" size={24} />
        <span className="text-gray-800">Loading model...</span>
      </div>
    </Html>
  );
}

function ModelInfo({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  let vertexCount = 0;
  let triangleCount = 0;

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      vertexCount += child.geometry.attributes.position.count;
      triangleCount += child.geometry.index
        ? child.geometry.index.count / 3
        : child.geometry.attributes.position.count / 3;
    }
  });

  return (
    <Html position={[2, 0, 0]}>
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <h3 className="font-bold mb-2">Model Information</h3>
        <div className="text-sm">
          <p>Vertices: {vertexCount.toLocaleString()}</p>
          <p>Triangles: {Math.floor(triangleCount).toLocaleString()}</p>
        </div>
      </div>
    </Html>
  );
}

function FileUpload() {
  const { setModelUrl } = useViewerStore();

  const isModelLoaded = !!useViewerStore.getState().modelUrl;

  const handleDrop = useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
      }
    },
    [setModelUrl]
  );

  const handleDragOver = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (file && (file.name.endsWith(".glb") || file.name.endsWith(".gltf"))) {
        const url = URL.createObjectURL(file);
        setModelUrl(url);
      }
    },
    [setModelUrl]
  );

  if (!isModelLoaded) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ pointerEvents: "auto" }}
          >
            <h2 className="text-xl font-bold mb-2">拖放 3D 模型到這裡</h2>
            <p className="text-gray-600 mb-4">支援 .glb 和 .gltf 檔案</p>
            <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
              選擇檔案
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => setModelUrl(null)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        移除模型
      </button>
    </div>
  );
}

export default function ModelViewer() {
  const {
    wireframe,
    autoRotate,
    backgroundColor,
    lightIntensity,
    showGrid,
    showAxes,
    cameraPosition,
    modelUrl,
  } = useViewerStore();

  return (
    <div className="w-full h-full">
      <Canvas
        style={{ background: backgroundColor }}
        camera={{ position: cameraPosition }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <Environment preset="studio" />
          <ambientLight intensity={lightIntensity * 0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={lightIntensity}
            castShadow
          />
          {showGrid && <Grid infiniteGrid />}
          {showAxes && <AxesHelper />}
          {modelUrl && <Model url={modelUrl} wireframe={wireframe} />}
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enableDamping
          />
        </Suspense>
      </Canvas>
      <FileUpload />
    </div>
  );
}
