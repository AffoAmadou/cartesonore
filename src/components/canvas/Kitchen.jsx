'use client'

import { useLoader, useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

export const Kitchen = (props) => {
  const texture = useLoader(TextureLoader, "kitchen.png")

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  useEffect(() => {
    let ang_rad = state.camera.fov * Math.PI / 180;
    let fov_y = state.camera.position.z * Math.tan(ang_rad / 2) * 2;

    set({planeGeometry: {args: [fov_y * state.camera.aspect, fov_y, 1, 1]}})
  }, [])


  return (
    <mesh position={[0, 0, 3]}>
      <planeGeometry args={[5, 3, 1, 1]} />
      <meshBasicMaterial attach="material" opacity={1} map={texture} />
    </mesh>
  )
  
}