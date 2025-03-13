import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useAnimations, useGLTF, useScroll } from "@react-three/drei"

export default function Model() {
  const group = useRef()
  const { scene, animations } = useGLTF("/3Dmodel/grabfigur.glb")
  const { actions } = useAnimations(animations, scene)
  const scroll = useScroll()

  useEffect(() => {
    if (actions["Experiment"]) {
      actions["Experiment"].play().paused = true
    }
  }, [actions])

  useFrame(() => {
    if (actions["Experiment"]) {
      actions["Experiment"].time =
        actions["Experiment"].getClip().duration * scroll.offset
    }

    // Example: Move the model vertically within the scrollable section
    group.current.position.y = scroll.offset * 3 - 1.5
  })

  return (
    <group ref={group} scale={2}>
      <primitive object={scene} />
    </group>
  )
}
