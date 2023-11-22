import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import lily from "../../../../public/img/lily.png"
import { useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/lily.mp3'
import GSAP from 'gsap'

import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'

//!Clouds
export const Lily = ({ position }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useLoader(THREE.TextureLoader, lily.src)
  const [isHover, setIsHover] = useState(null)
  const soundref = useRef(null)

  let meshref = useRef(null)
  useEffect(() => {

  })


  //!HOVER EFFECT
  const handleHover = (e) => {
    console.log(e, 'lily')
    setIsHover(e.object)

    let tl = GSAP.timeline({})
    tl.to(e.object.scale, {
      duration: .5,
      x: 1.1,
      y: 1.1,
      z: 1.1,
    });
  }

  const handleNonHover = () => {
    setIsHover(null)

    let tl = GSAP.timeline({})
    tl.to(meshref.current.scale, {
      duration: .5,
      x: 1,
      y: 1,
      z: 1,
    });
  }

  const playSound = () => {
    if (soundref.current) {
      soundref.current.play();
      const animatable = { distance: soundref.current.distance };

      GSAP.fromTo(
        animatable,
        { distance: soundref.current.distance },
        {
          distance: 0.1,
          duration: 6,
          onUpdate: () => {
            soundref.current.distance = animatable.distance;
            console.log('update', soundref.current.distance);
          },
          onComplete: () => {
            soundref.current.stop();
            console.log('stop', soundref.current.distance);
          }
        }
      );

    }
  };
  return (
    <>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={isHover}
          edgeStrength={10.0}
          visibleEdgeColor={0xffff00}
          hiddenEdgeColor={0x101010}
          blur={true}
          kernelSize={KernelSize.SMALL}
        />

      </EffectComposer>
      <mesh ref={meshref} position={position} onPointerOut={handleNonHover} onPointerOver={(e) => handleHover(e)} onClick={playSound}>
        <planeGeometry args={[.5, .8, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} transparent map={texture} />
        <PositionalAudio
          url={sound}
          distance={10}
          ref={soundref}
        />
      </mesh>
    </>
  )
}
