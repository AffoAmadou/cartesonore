import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import lily from '../../../../public/img/lily.png'
import { useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/lily.mp3'
import GSAP from 'gsap'

//!Clouds
export const Lily = ({ position, isLily, setOutlineObject }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useLoader(THREE.TextureLoader, lily.src)
  const [isHover, setIsHover] = useState(null)
  const soundref = useRef(null)
  const materialref = useRef(null)
  const meshref = useRef(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (isLily) {
      GSAP.to(meshref.current.material, {
        delay: 1,
        duration: 2,
        opacity: 1,
        ease: 'linear',
        onUpdate: () => {
          if (meshref.current) {
            setOpacity(meshref.current.material.opacity)
          }
        },
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
      soundref.current.play()
      const animatable = { distance: soundref.current.distance }

      GSAP.fromTo(
        animatable,
        { distance: soundref.current.distance },
        {
          distance: 0.1,
          duration: 6,
          onUpdate: () => {
            soundref.current.distance = animatable.distance
            console.log('update', soundref.current.distance)
          },
          onComplete: () => {
            soundref.current.stop()
            console.log('stop', soundref.current.distance)
          },
        },
      )
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
        <planeGeometry args={[0.5, 0.8, 64, 64]} />
        <meshBasicMaterial opacity={0} ref={materialref} side={THREE.DoubleSide} transparent map={texture} />
        <PositionalAudio url={sound} distance={10} ref={soundref} />
      </mesh>
    </>
  )
}
