"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { useProgress, Html, ScrollControls } from "@react-three/drei"
import Model from "./model"

function Loader() {
  const { progress, active } = useProgress()

  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <directionalLight position={[5, 5, 5]} />
    
    {/* Match pages to section height (Try adjusting "pages" if needed) */}
    <ScrollControls pages={2} damping={0.1}>
      <Model />
    </ScrollControls>
  </Canvas>
  )
}
