import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import corbeau from '../../../../public/img/corbeau.png'
import corbeauVolant from '../../../../public/img/corbeauVolant.png'
import { useTexture } from '@react-three/fiber'
import { PositionalAudio } from '@react-three/drei'
import soundCrow from '../../../../public/sound/crow.mp3'
import soundCrow2 from '../../../../public/sound/crow_2.mp3'
import GSAP from 'gsap'

//!Clouds
export const Corbeau = ({ position, setScene2D, scene2D }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useTexture(corbeauVolant.src)
  const [isHover, setIsHover] = useState(null)
  const soundCrowRef = useRef(null)
  const soundCrow2Ref = useRef(null)
  const materialref = useRef(null)
  const meshref = useRef(null)
  const meshCrowAnimated = useRef(null)
  const [opacity, setOpacity] = useState(0)

  const animateCircle = () => {
    const radius = 3
    let angle = 0
    if (meshCrowAnimated.current)
      GSAP.to(meshCrowAnimated.current.position, {
        duration: 1,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          angle += 0.0055

          meshCrowAnimated.current.position.z = Math.cos(angle) * 6.5
          meshCrowAnimated.current.position.x = Math.sin(angle) * radius
          meshCrowAnimated.current.position.y = 0.5
        },
      })
  }

  // useEffect(() => {
  //   if (scene2D) return
  //   if (soundCrow2Ref.current) {
  //     soundCrow2Ref.current.setVolume(5)

  //     soundCrow2Ref.current.play()
  //     animateCircle()
  //   }
  // }, [scene2D])

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
    if (soundCrowRef.current) {
      // soundCrow2Ref.current.stop()
      soundCrowRef.current.play()
      const animatable = { distance: soundCrowRef.current.distance }
      let tl = GSAP.timeline({})
      tl.fromTo(
        animatable,
        { distance: soundCrowRef.current.distance },
        {
          distance: 0.1,
          duration: 2,
          onUpdate: () => {
            if (tl.progress() > 0.5) {
              soundCrowRef.current.distance = animatable.distance
              soundCrowRef.current.stop()
            }
          },
          onComplete: () => {
            soundCrowRef.current.stop()
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
        <PositionalAudio url={soundCrow} distance={5} ref={soundCrowRef} loop />
      </mesh>

      {/* <mesh ref={meshCrowAnimated}>
        <planeGeometry args={[0.2, 0.2, 24, 24]} />
        <meshBasicMaterial color='#ff0000' opacity={0} transparent />
        <PositionalAudio url={soundCrow2} distance={3} ref={soundCrow2Ref} loop />
      </mesh> */}
    </>
  )
}
