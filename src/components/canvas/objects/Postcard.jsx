
import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'

import carte from "../../../../public/img/carte.png"

//!Postal card model

export const Postcard = () => {
  const meshref = useRef(null)
  let texture = useLoader(THREE.TextureLoader, carte.src)
  texture.encoding = THREE.LinearSRGBColorSpace;

  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime();
  });

  // useEffect(() => {

  //   //?Timeline animation
  //   let tl = GSAP.timeline({
  //     ease: 'sine.inOut',
  //   });

  //   tl.to(meshref.current.position, {
  //     duration: 2.5,
  //     z: -3,
  //   });

  //   tl.to(meshref.current.rotation, {
  //     duration: 1.5,
  //     x: -Math.PI * 0.5,

  //     onComplete: () => {
  //       // this.setCastle();
  //     }
  //   }, "-=1");

  //   tl.to(meshref.current.position, {
  //     duration: 2.5,
  //     y: -2.3,
  //     ease: "power4.out"
  //   });
  // }, [])



  return (
    <>
      <mesh ref={meshref} position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} attach="material" opacity={1} transparent map={texture} />

      </mesh>
    </>
  )
}
