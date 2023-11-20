import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import intro from "../../../../public/img/intro.png"


export const Intro = () => {
  const meshref = useRef(null)
  let texture = useLoader(THREE.TextureLoader, intro.src)
  texture.encoding = THREE.LinearSRGBColorSpace;

  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime();
  });


  return (
    <>
      <mesh ref={meshref} position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} attach="material" opacity={1} transparent map={texture} />

      </mesh>
    </>
  )
}
