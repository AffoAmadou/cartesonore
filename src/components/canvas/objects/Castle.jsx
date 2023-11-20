import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { PositionalAudio } from '@react-three/drei'
import GSAP from 'gsap'

export function Castle(props) {
  const { scene } = useGLTF('/castle.glb')

  return <primitive object={scene} {...props} />
}
