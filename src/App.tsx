import React from 'react';
import ModelViewer from './components/ModelViewer';
import Controls from './components/Controls';

function App() {
  return (
    <div className="w-full h-screen bg-gray-900 relative">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-2xl font-bold text-white">3D Model Viewer</h1>
      </div>
      <ModelViewer />
      <Controls />
    </div>
  );
}

export default App;