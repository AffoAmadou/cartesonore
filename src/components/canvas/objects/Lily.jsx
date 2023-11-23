import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import lily from '../../../../public/img/lily.png'
import { useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/lily.mp3'
import GSAP from 'gsap'

//!Clouds
export const Lily = ({ position, isLily, args }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useLoader(THREE.TextureLoader, lily.src)
  const [isHover, setIsHover] = useState(null)
  const soundref = useRef(null)
  const materialref = useRef(null)
  const meshref = useRef(null)
  const [opacity, setOpacity] = useState(0)
  let soundProgress = 0

  useEffect(() => {
    if (isLily) {
      GSAP.to(meshref.current.material, {
        delay: 1,
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
  }, [isLily])

  //!HOVER EFFECT
  const handleHover = (e) => {
    let tl = GSAP.timeline({})
    tl.to(e.object.scale, {
      duration: 0.5,
      x: 1.1,
      y: 1.1,
      z: 1.1,
    })
  }

  const handleNonHover = () => {
    let tl = GSAP.timeline({})
    tl.to(meshref.current.scale, {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
    })
  }

  const playSound = () => {
    if (soundref.current) {
      soundref.current.setVolume(0.5)
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
      >
        <planeGeometry args={args} />
        <meshBasicMaterial opacity={0} ref={materialref} side={THREE.DoubleSide} transparent map={texture} />
        <PositionalAudio url={sound} distance={10} ref={soundref} />
      </mesh>
    </>
  )
}
