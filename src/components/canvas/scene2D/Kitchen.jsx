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
import soundKitchen from '../../../../public/sound/cuisine.mp3'

import soundBubblingCauldron from '../../../../public/sound/kitchen/bubbling-cauldron.mp3'
import soundFoodSizzling from '../../../../public/sound/kitchen/food-sizzling.mp3'
import soundSpatula from '../../../../public/sound/kitchen/moving-spatula.mp3'
import soundOven from '../../../../public/sound/kitchen/oven.mp3'

export const Kitchen = (props) => {
  const depthMaterial = useRef()
  const geometryRef = useRef()
  const meshSceneRef = useRef()
  const meshNavigationRef = useRef()
  const soundref = useRef(null)
  const soundBubblingCauldronRef = useRef(null)
  const soundOvenRef = useRef(null)
  const soundMovingSpatulaRef = useRef(null)
  const soundFoodSizzlingRef = useRef(null)

  const textureKitchen = useTexture('../../../../img/kitchen/kitchen.png')
  const textureDepthMapKitchen = useTexture('../../../../img/kitchen/kitchen_depthmap.png')

  const [isLily, setIsLily] = useState(false)
  const [isChien, setIsChien] = useState(false)

  const sounds = [soundBubblingCauldron, soundFoodSizzling, soundSpatula, soundOven]

  /*   const sounds = [
    {
      sound: soundBubblingCauldron,
      position: [],
    },
  ] */

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

    if (soundref.current) {
      soundref.current.play()
      console.log(soundref.current.buffer.duration)

      let time = soundref.current.buffer.duration.toString().split('.')[0]
      time *= 1000
      console.log(time)

      setTimeout(() => {
        if (soundref.current) {
          soundref.current.stop()
          meshNavigationRef.current.material.opacity = 1
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

    const playSounds = () => {
      if (soundBubblingCauldronRef.current) {
        soundBubblingCauldronRef.current.play()
      }

      if (soundOvenRef.current) {
        soundOvenRef.current.play()

        setTimeout(() => {
          soundOvenRef.current.stop()
        }, 8000)
      }

      if (soundMovingSpatulaRef.current) {
        soundMovingSpatulaRef.current.play()
      }

      if (soundFoodSizzlingRef.current) {
        soundFoodSizzlingRef.current.play()
      }
    }

    /* let moveSoundMovingSpatula = GSAP.utils.interpolate(
      soundMovingSpatulaRef.current.position,
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
    ) */

    props.timeline.add(scaleMeshScene, 0).add(scaleMeshNavigation, 1).add(playSounds, 2)
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
        position={[state.camera.position.x / 1.6, state.camera.position.y / 1.9, -0.5]}
        onPointerDown={() => {
          props.setScene2D(null)
          props.setZoom(false)
        }}
        scale={[1, 1, 1]}
      >
        <planeGeometry args={[0.05, 0.05, 24, 24]} />
        <meshBasicMaterial opacity={0} color={0x00ffff} />
      </mesh>

      <mesh ref={meshSceneRef} position={[state.camera.position.x, state.camera.position.y, -0.83]} scale={[1, 1, 1]}>
        <planeGeometry ref={geometryRef} />
        <pseudo3DShaderMaterial
          ref={depthMaterial}
          attach='material'
          uImage={textureKitchen}
          uDepthMap={textureDepthMapKitchen}
        />
        {/* <PositionalAudio url={soundKitchen} distance={10} ref={soundref} /> */}
      </mesh>

      <mesh rotation={[0, 0, 0.45]} scale={[0.3, 0.3, 0.3]} position={[-0.098, 0, 0.1]}>
        <planeGeometry args={[7.48, 4.15, 64, 64]} />
        <meshBasicMaterial color='#ff0000' opacity={0} transparent />
      </mesh>

      <mesh position={[0, 0, -7]}>
        <PositionalAudio url={sounds[0]} distance={1} ref={soundBubblingCauldronRef} />
      </mesh>

      <mesh position={[-5, 0, 0]}>
        <PositionalAudio url={sounds[3]} distance={3} ref={soundOvenRef} />
      </mesh>

      <mesh position={[2, 0, 0]}>
        <PositionalAudio url={sounds[2]} distance={2} ref={soundMovingSpatulaRef} />
      </mesh>

      <mesh position={[-7, 2, 0]}>
        <PositionalAudio url={sounds[1]} distance={2} ref={soundFoodSizzlingRef} />
      </mesh>
    </group>
  )
}
