'use client'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Pseudo3DShaderMaterial } from './Pseudo3DShaderMaterial'
import GSAP from 'gsap'

export const Kitchen = (props) => {
  const depthMaterial = useRef()
  const geometryRef = useRef()
  const meshRef = useRef()
  const textureKitchen = useTexture('../../../img/kitchen/kitchen.png')
  const textureDepthMapKitchen = useTexture('../../../img/kitchen/kitchen_depthmap.png')

  let textures = [textureKitchen, textureDepthMapKitchen]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  let meshScale = new THREE.Vector3(0, 0, 1)

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  const { getCurrentViewport } = useThree((state) => state.viewport)
  const { width, height } = getCurrentViewport(state.camera, [0, 0, 0])

  useFrame((state) => (depthMaterial.current.uMouse = [state.pointer.x * 0.01, state.pointer.y * 0.01]))

  useEffect(() => {
    let ang_rad = (state.camera.fov * Math.PI) / 180
    let fov_y = state.camera.position.z * Math.tan(ang_rad / 2) * 1

    let scaleMesh = GSAP.fromTo(
      meshRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: width,
        y: height,
        z: 1,
        duration: 1,
        ease: 'power2.out',
      },
    )

    props.timeline.add(scaleMesh, 0)
  }, [])

  return (
    <group>
      <mesh
        position={[state.camera.position.x / 1.52, state.camera.position.y / 1.32, -0.5]}
        onPointerDown={() => {
          props.setScene2D(null)
          props.setZoom(false)
        }}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[0.05, 0.05, 24, 24]} />
        <meshBasicMaterial color={0x00ffff} />
      </mesh>

      <mesh ref={meshRef} position={[state.camera.position.x, state.camera.position.y, -0.83]} scale={[1, 1, 1]}>
        <planeGeometry ref={geometryRef} />
        <pseudo3DShaderMaterial
          ref={depthMaterial}
          attach='material'
          uImage={textureKitchen}
          uDepthMap={textureDepthMapKitchen}
        />
      </mesh>
    </group>
  )
}
