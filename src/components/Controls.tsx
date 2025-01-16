import { useViewerStore } from "../store/viewerStore";
import {
  Eye,
  Rotate3d,
  Grid,
  Axe,
  Sun,
  Share2,
  Camera,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

export default function Controls() {
  const {
    wireframe,
    setWireframe,
    autoRotate,
    setAutoRotate,
    lightIntensity,
    setLightIntensity,
    showGrid,
    setShowGrid,
    showAxes,
    setShowAxes,
    isPlaying,
    setIsPlaying,
  } = useViewerStore();

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "model-screenshot.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const handleShare = async () => {
    try {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        if (blob) {
          await navigator.share({
            files: [new File([blob], "model-view.png", { type: "image/png" })],
            title: "3D Model View",
          });
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-2 rounded-lg ${
            wireframe ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Toggle Wireframe"
        >
          <Eye size={20} />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg ${
            autoRotate ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Auto Rotate"
        >
          <Rotate3d size={20} />
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 rounded-lg ${
            showGrid ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Show Grid"
        >
          <Grid size={20} />
        </button>
        <button
          onClick={() => setShowAxes(!showAxes)}
          className={`p-2 rounded-lg ${
            showAxes ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          title="Show Axes"
        >
          <Axe size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Sun size={20} />
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={lightIntensity}
            onChange={(e) => setLightIntensity(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            title={isPlaying ? "Pause Animation" : "Play Animation"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              // Reset animation logic here
            }}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            title="Reset Animation"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        <button
          onClick={handleScreenshot}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          title="Take Screenshot"
        >
          <Camera size={20} />
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          title="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
