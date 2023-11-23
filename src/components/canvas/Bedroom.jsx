'use client'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Pseudo3DShaderMaterial } from './Pseudo3DShaderMaterial'
import GSAP from 'gsap'

import { PositionalAudio } from '@react-three/drei'
import sound from '../../../public/sound/chambre.mp3'

export const Bedroom = (props) => {
  const depthMaterial = useRef()
  const geometryRef = useRef()
  const meshSceneRef = useRef()
  const meshNavigationRef = useRef()
  const textureKitchen = useTexture('../../../img/bedroom/bedroom.png')
  const textureDepthMapKitchen = useTexture('../../../img/bedroom/bedroom_depthmap.png')

  const soundref = useRef(null)

  let textures = [textureKitchen, textureDepthMapKitchen]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  const { getCurrentViewport } = useThree((state) => state.viewport)
  const { width, height } = getCurrentViewport(state.camera, [0, 0, 0])
  const { gl } = useThree()

  useFrame((state) => (depthMaterial.current.uMouse = [state.pointer.x * 0.01, state.pointer.y * 0.01]))

  useEffect(() => {
    let ang_rad = (state.camera.fov * Math.PI) / 180
    let fov_y = state.camera.position.z * Math.tan(ang_rad / 2) * 1

    if (soundref.current) {
      soundref.current.play()
      console.log(soundref.current.buffer.duration)
    }
    let scaleMeshScene = GSAP.fromTo(
      meshSceneRef.current.scale,
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

    let scaleMeshNavigation = GSAP.fromTo(
      meshNavigationRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power2.out',
      },
    )

    props.timeline.add(scaleMeshScene, 0).add(scaleMeshNavigation, 1)
  }, [])

  return (
    <group>
      <mesh
        ref={meshNavigationRef}
        position={[state.camera.position.x / 0.728, state.camera.position.y / 4.6, -0.5]}
        onPointerDown={() => {
          props.setScene2D(null)
          props.setZoom(false)
        }}
      >
        <planeGeometry args={[0.05, 0.05, 24, 24]} />
        <meshBasicMaterial color={0x00ffff} />
      </mesh>

      <mesh ref={meshSceneRef} position={[state.camera.position.x, state.camera.position.y, -0.83]}>
        <planeGeometry ref={geometryRef} />
        <pseudo3DShaderMaterial
          ref={depthMaterial}
          attach='material'
          uImage={textureKitchen}
          uDepthMap={textureDepthMapKitchen}
        />
        <PositionalAudio url={sound} distance={10} ref={soundref} />
      </mesh>
    </group>
  )
}
