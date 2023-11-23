import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import chien from '../../../../public/img/chien.png'
import { useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/dog-pant.mp3'
import GSAP from 'gsap'

//!Clouds
export const Chien = ({ position, isChien, args }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useLoader(THREE.TextureLoader, chien.src)
  const soundref = useRef(null)
  const materialref = useRef(null)
  const meshref = useRef(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (isChien) {
      GSAP.to(meshref.current.material, {
        delay: 1.5,
        duration: 2,
        opacity: 1,
        ease: 'linear',
        // onUpdate: () => {
        //   if (meshref.current) {
        //     setOpacity(meshref.current.material.opacity)
        //   }
        // },
      })
    }
  }, [isChien])

  //!HOVER EFFECT
  const handleHover = (e) => {
    let tl = GSAP.timeline({})
    tl.to(e.object.scale, {
      duration: 0.5,
      x: 0.9,
      y: 0.9,
      z: 0.9,
    })
  }

  const handleNonHover = () => {
    let tl = GSAP.timeline({})
    tl.to(meshref.current.scale, {
      duration: 0.5,
      x: 0.8,
      y: 0.8,
      z: 0.8,
    })
  }

  const playSound = () => {
    if (soundref.current) {
      soundref.current.setVolume(5)
      soundref.current.play()

      setTimeout(() => {
        soundref.current.stop()
      }, 5000)
    }
  }
  return (
    <>
      <mesh
        ref={meshref}
        position={position}
        onPointerOut={handleNonHover}
        onPointerOver={(e) => handleHover(e)}
        onClick={playSound}
        scale={[0.8, 0.8, 0.8]}
      >
        <planeGeometry args={args} />
        <meshBasicMaterial opacity={0} ref={materialref} side={THREE.DoubleSide} transparent map={texture} />
        <PositionalAudio url={sound} distance={10} ref={soundref} />
      </mesh>
    </>
  )
}
