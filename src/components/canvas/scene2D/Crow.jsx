'use client'

import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import GSAP from 'gsap'

import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/scene_corbeau_voix_off.mp3'

export const Crow = ({ timeline, setScene2D, scene2D }) => {
  const geometryRef = useRef()
  const meshSceneRef = useRef()
  const meshNavigationRef = useRef()
  const textureCrow = useTexture('../../../../img/corbeauScene.png')

  const soundref = useRef(null)

  let textures = [textureCrow]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  const { getCurrentViewport } = useThree((state) => state.viewport)
  const { width, height } = getCurrentViewport(state.camera, [0, 0, 1.1])

  useFrame(({ clock }) => {
    meshSceneRef.current.uTime = clock.getElapsedTime()
  })

  useEffect(() => {
    let ang_rad = (state.camera.fov * Math.PI) / 180
    let fov_y = state.camera.position.z * Math.tan(ang_rad / 2) * 1

    //!Gestion du son de la scene
    if (soundref.current) {
      soundref.current.play()
      soundref.current.setRefDistance(2)

      console.log(soundref.current.buffer.duration)

      let time = soundref.current.buffer.duration.toString().split('.')[0]
      time *= 1000
      console.log(time)

      setTimeout(() => {
        if (soundref.current) {
          soundref.current.stop()
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
      },
    )

    timeline.add(scaleMeshScene, 0).add(scaleMeshNavigation, 1)
  }, [])

  return (
    <group>
      <mesh
        ref={meshNavigationRef}
        position={[-2.45, 1.1, 2]}
        onPointerDown={() => {
          setScene2D(null)
        }}
      >
        <planeGeometry args={[0.4, 0.4, 24, 24]} />
        <meshBasicMaterial opacity={1} color={0x00ffff} />
      </mesh>

      <mesh ref={meshSceneRef} position={[state.camera.position.x, state.camera.position.y, 1.1]}>
        <planeGeometry ref={geometryRef} />
        {/* <meshBasicMaterial attach='material' map={textureCrow} /> */}
        <postCardShaderMaterial
          attach='material'
          uTextureOne={textureCrow}
          uTextureTwo={textureCrow}
          transparent
          uTime={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <PositionalAudio url={sound} distance={2} ref={soundref} />
    </group>
  )
}


export const PostCardShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uTextureOne: new THREE.Texture(),
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;  
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform sampler2D uTextureOne;
    varying vec2 vUv;

  void main() {
  
  vec4 imageOne = texture2D(uTextureOne, vUv);

  gl_FragColor = imageOne;
    }
  `,
)
PostCardShaderMaterial.transparent = true
PostCardShaderMaterial.depthWrite = false
extend({ PostCardShaderMaterial })
