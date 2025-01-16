import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera, useGLTF, Html, useAnimations } from '@react-three/drei';
import { useViewerStore } from '../store/viewerStore';
import { Loader } from 'lucide-react';
import * as THREE from 'three';

function Model({ url, wireframe }: { url: string; wireframe: boolean }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);
  
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.wireframe = wireframe;
    }
  });

  return <primitive ref={group} object={scene} />;
}

function AxesHelper() {
  return (
    <group>
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xff0000]} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x00ff00]} />
      <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 1, 0x0000ff]} />
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

  scene.traverse((child: any) => {
    if (child.isMesh) {
      vertexCount += child.geometry.attributes.position.count;
      triangleCount += child.geometry.index ? child.geometry.index.count / 3 : child.geometry.attributes.position.count / 3;
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

export default function ModelViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    wireframe,
    autoRotate,
    backgroundColor,
    lightIntensity,
    showGrid,
    showAxes,
    cameraPosition
  } = useViewerStore();

  // Example model URL - replace with your model URL
  const modelUrl = "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-monkey/model.gltf";

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'model-screenshot.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas
        ref={canvasRef}
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
          <Model url={modelUrl} wireframe={wireframe} />
          <ModelInfo url={modelUrl} />
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={1}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}