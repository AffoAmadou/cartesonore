import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import corbeau from '../../../../public/img/corbeau.png'
import corbeauVolant from '../../../../public/img/corbeauVolant.png'
import { useLoader } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/lily.mp3'
import GSAP from 'gsap'

//!Clouds
export const Corbeau = ({ position, setScene2D }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useLoader(THREE.TextureLoader, corbeauVolant.src)
  const [isHover, setIsHover] = useState(null)
  const soundref = useRef(null)
  const materialref = useRef(null)
  const meshref = useRef(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {}, [])

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
      console.log(soundref.current.buffer.duration)
      const animatable = { distance: soundref.current.distance }

      GSAP.fromTo(
        animatable,
        { distance: soundref.current.distance },
        {
          distance: 0.1,
          duration: 2,
          onUpdate: () => {
            soundref.current.distance = animatable.distance
            soundref.current.stop()
            setScene2D('crow')
          },
          onComplete: () => {
            soundref.current.stop()
            setScene2D('crow')
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
        <planeGeometry args={[0.8, 1.5, 64, 64]} />
        <meshBasicMaterial opacity={1} ref={materialref} side={THREE.DoubleSide} transparent map={texture} />
        <PositionalAudio url={sound} distance={10} ref={soundref} />
      </mesh>
    </>
  )
}
