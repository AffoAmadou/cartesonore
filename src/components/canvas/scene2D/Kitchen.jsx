'use client'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Pseudo3DShaderMaterial } from '../Pseudo3DShaderMaterial'

import GSAP from 'gsap'

import { Lily } from '../objects/Lily'

import { PositionalAudio } from '@react-three/drei'

import { Chien } from '../objects/Chien'
import soundKitchen from '../../../../public/sound/cuisine_final.mp3'

export const Kitchen = (props) => {
  const depthMaterial = useRef()
  const geometryRef = useRef()
  const meshSceneRef = useRef()
  const meshNavigationRef = useRef()
  const soundref = useRef(null)

  const textureKitchen = useTexture('../../../../img/kitchen/kitchen.png')
  const textureDepthMapKitchen = useTexture('../../../../img/kitchen/kitchen_depthmap.png')
  const textureArrowBack = useTexture('../../../../img/arrow-back.svg')

  const [isLily, setIsLily] = useState(false)
  const [isChien, setIsChien] = useState(false)

  let textures = [textureKitchen, textureDepthMapKitchen]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const state = useThree((state) => state)

  const { getCurrentViewport } = useThree((state) => state.viewport)
  const { width, height } = getCurrentViewport(state.camera, [0, 0, 0])

  useFrame((state) => (depthMaterial.current.uMouse = [state.pointer.x * 0.01, state.pointer.y * 0.01]))

  useEffect(() => {
    if (soundref.current) {
      soundref.current.setVolume(0.3)
      soundref.current.play()
      console.log(soundref.current.buffer.duration)

      let time = soundref.current.buffer.duration.toString().split('.')[0]
      time *= 1000
      console.log(time)

      setTimeout(() => {
        if (soundref.current) {
          soundref.current.stop()
          meshNavigationRef.current.material.opacity = 1
          GSAP.fromTo(
            meshNavigationRef.current.scale,
            { x: 0.5, y: 0.5, z: 0.5 },
            {
              x: 1,
              y: 1,
              z: 1,
              duration: 1,
              repeat: -1,
              yoyo: true,
              ease: 'power2.out',
            },
          )
          console.log('stop')
        }
      }, time + 1000)
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
        onComplete: () => {
          setIsLily(true)
          setIsChien(true)
        },
      },
    )

    props.timeline.add(scaleMeshScene, 0).add(scaleMeshNavigation, 1)
  }, [])

  return (
    <group>
      <Lily
        position={[state.camera.position.x / 1.2, state.camera.position.y / 0.77, -0.5]}
        isLily={isLily}
        args={[0.16, 0.25, 64, 64]}
      />
      <Chien
        position={[state.camera.position.x / 1.8, state.camera.position.y / 0.57, -0.8]}
        isChien={isChien}
        args={[0.17, 0.24, 64, 64]}
      />
      <mesh
        ref={meshNavigationRef}
        position={[state.camera.position.x / 1.5, state.camera.position.y / 1.9, -0.5]}
        onPointerDown={() => {
          props.setScene2D(null)
          props.setZoom(false)
        }}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[0.05, 0.05, 24, 24]} />
        <meshBasicMaterial opacity={0} color={0xffffff} transparent map={textureArrowBack} />
      </mesh>

      <mesh ref={meshSceneRef} position={[state.camera.position.x, state.camera.position.y, -0.83]} scale={[1, 1, 1]}>
        <planeGeometry ref={geometryRef} />
        <pseudo3DShaderMaterial
          ref={depthMaterial}
          attach='material'
          uImage={textureKitchen}
          uDepthMap={textureDepthMapKitchen}
        />
      </mesh>

      <PositionalAudio url={soundKitchen} distance={1} ref={soundref} />
    </group>
  )
}
