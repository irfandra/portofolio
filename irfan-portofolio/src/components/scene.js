"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useProgress, Html, OrbitControls } from "@react-three/drei";
import Model from "./model";

function Loader() {
  const { progress } = useProgress();

  return <Html center>{progress.toFixed(1)}% loaded</Html>;
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Suspense fallback={<Loader />}>
        <Model />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={true}
          rotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
