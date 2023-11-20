
import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { PositionalAudio } from '@react-three/drei'
import GSAP from 'gsap'

export const Sky = () => {
  const meshref = useRef(null)

  useFrame(({ clock }) => {
  });

  useEffect(() => {


  }, [])



  return (
    <>
      <mesh ref={meshref} position={[0, 0, -15]}>
        <planeGeometry args={[50.86, 20.37, 64, 64]} />
        <skyShaderMaterial />
      </mesh>
    </>
  )
}
