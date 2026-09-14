import { useRef, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import { MeshStandardMaterial, Color } from "three"

export default function Model() {
  const group = useRef()
  const { scene, materials } = useGLTF("/3Dmodel/robot.glb")

  

  return (
    <group ref={group} scale={1}>
      <primitive object={scene} />
    </group>
  )
}