'use client'

import { useGLTF, shaderMaterial, Stats } from '@react-three/drei'
import { useFrame, useLoader, extend, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { PositionalAudio } from '@react-three/drei'
import GSAP from 'gsap'

import sound from '../../../public/sound/crow.mp3'

import { Postcard } from './objects/Postcard'
import { Sky } from './objects/Sky'
import { Castle } from './objects/Castle'
import { Intro } from './objects/Intro'
import { Cloud } from './objects/Cloud'
import { Kitchen } from './Kitchen'

//Castle model

//Raven model
// export function RavenModel(props) {
//   const { scene } = useGLTF('/raven.glb')

//   return <primitive object={scene} {...props} />
// }

// //!Raven
// export const Raven = () => {
//   const soundref = useRef(null)

//   const playSound = () => {
//     if (soundref.current) {
//       soundref.current.play();
//     }
//   };
//   return (
//     <RavenModel onClick={playSound} position={[-6, 2, -10]}>
//       <PositionalAudio
//         url={sound}
//         distance={1}
//         ref={soundref}
//       />
//     </RavenModel>
//   )
// }

//!Scene Output scene
export const Scene = () => {
  const meshref = useRef(null)

  const [explore, setExplore] = useState(false)
  const [scene2D, setScene2D] = useState(false)
  const [zoom, setZoom] = useState(false)

  useFrame(({ clock }) => {})

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  let timeline = GSAP.timeline()

  return (
    <>
      <group position={[0, 0, 0]}>
        {/* <Postcard /> */}
        {/* <Intro /> */}
        <Sky />

        {scene2D === 'kitchen' && (
          <Kitchen timeline={timeline} explore={scene2D} setScene2D={setScene2D} zoom={zoom} setZoom={setZoom} />
        )}

        <Castle
          scale={0.24}
          position={[0, -2, -3]}
          rotation={[0.0, 1.5, 0]}
          scene2D={scene2D}
          setScene2D={setScene2D}
          explore={explore}
          setExplore={setExplore}
          timeline={timeline}
          zoom={zoom}
          setZoom={setZoom}
        />

        <Cloud image='1' position={[-2.6, -1.9, 0]} size={{ width: 4, height: 2 }} />
        <Cloud image='2' position={[0.1, -2.2, 0]} size={{ width: 3.3, height: 1.8 }} />
        <Cloud image='0' position={[2, -1.6, 1]} size={{ width: 2.8, height: 1.6 }} />

        {/* middle*/}
        <Cloud image='2' position={[-5, -2, -4]} size={{ width: 5.83, height: 3 }} />
        <Cloud image='1' position={[0, -1.4, -4]} size={{ width: 6, height: 4 }} />
        <Cloud image='0' position={[5.4, -2, -4]} size={{ width: 5.83, height: 3.8 }} />
        <Cloud image='1' position={[2.6, -0.65, -4.3]} size={{ width: 7, height: 4 }} />

        {/* top */}
        <Cloud image='0' position={[-5.5, -1, -6]} size={{ width: 7.3, height: 4.3 }} />
        <Cloud image='2' position={[-0.1, -0.3, -5]} size={{ width: 8, height: 5 }} />

        {/* far*/}
        <Cloud image='2' position={[9, 0.4, -13]} size={{ width: 8.83, height: 8 }} />
        <Cloud image='1' position={[-7, 0.8, -9]} size={{ width: 5.83, height: 5 }} />

        <Stats />
      </group>
    </>
  )
}
