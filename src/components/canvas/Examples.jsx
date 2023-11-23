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
import { Lily } from './objects/Lily'
import { Bedroom } from './Bedroom'
import { Chien } from './objects/Chien'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { Corbeau } from './objects/Corbeau'

//!Scene Output scene
export const Scene = ({ isStarted, isPlaying, setIsStarted }) => {
  const meshref = useRef(null)

  const [explore, setExplore] = useState(false)
  const [scene2D, setScene2D] = useState(false)
  const [zoom, setZoom] = useState(false)

  const [firstClouds, setFirstClouds] = useState(false)
  const [lastClouds, setLastClouds] = useState(false)
  const [isCastle, setIsCastle] = useState(false)
  const [isPostcard, setIsPostcard] = useState(true)
  const [isLily, setIsLily] = useState(false)
  const [isChien, setIsChien] = useState(false)
  const [isPathComplete, setIsPathComplete] = useState([false, false])
  const [isLastScene, setIsLastScene] = useState(false)

  const [outlineObject, setOutlineObject] = useState(null)

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  let timeline = GSAP.timeline()

  useEffect(() => {
    if (isPathComplete[0] && isPathComplete[1]) {
      console.log('le deux scene on été visité', isPathComplete)
      setIsLastScene(true)
    }
  }, [isPathComplete]
  )


  return (
    <>
      <group position={[0, 0, 0]}>
        {isStarted && <Intro />}

        <Sky />

        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            selection={outlineObject}
            edgeStrength={10.0}
            visibleEdgeColor={0xffff00}
            hiddenEdgeColor={0x101010}
            blur={true}
            kernelSize={KernelSize.SMALL}
          />
        </EffectComposer>

        {!isPostcard && (
          <Postcard
            isStarted={isStarted}
            isPlaying={isPlaying}
            setFirstClouds={setFirstClouds}
            setLastClouds={setLastClouds}
            setIsStarted={setIsStarted}
            setIsCastle={setIsCastle}
            setIsPostcard={setIsPostcard}
            setOutlineObject={setOutlineObject}
          />
        )}

        {isCastle && (
          <>
            <Castle
              scale={0.34}
              position={[0, -2, -3.7]}
              rotation={[0.0, 1.5, 0]}
              scene2D={scene2D}
              setScene2D={setScene2D}
              timeline={timeline}
              zoom={zoom}
              setZoom={setZoom}
              setIsLily={setIsLily}
              setIsChien={setIsChien}
              setOutlineObject={setOutlineObject}
              setIsPathComplete={setIsPathComplete}
              isPathComplete={isPathComplete}
            />
            <Lily position={[0, -1.4, 0]} isLily={isLily} args={[0.5, 0.8, 64, 64]} />
            <Chien position={[-0.5, -1.4, 0]} isChien={isChien} args={[0.4, 0.6, 64, 64]} />
          </>
        )}

        {scene2D === 'kitchen' && (
          <Kitchen timeline={timeline} setScene2D={setScene2D} zoom={zoom} setZoom={setZoom} scene2D={scene2D} />
        )}

        {scene2D === 'bedroom' && (
          <Bedroom timeline={timeline} setScene2D={setScene2D} zoom={zoom} setZoom={setZoom} scene2D={scene2D} />
        )}

        {/* //Apparition Nuages */}
        {!firstClouds && (
          <>
            <Cloud image='1' position={[-2.6, -1.7, 1]} size={{ width: 4, height: 2 }} />
            <Cloud image='2' position={[0.1, -2.1, 1]} size={{ width: 3.3, height: 1.8 }} />
            <Cloud image='0' position={[2.1, -1.7, 1]} size={{ width: 2.8, height: 1.6 }} />
          </>
        )}
        {/* Apparition nuages de fond  */}
        {!lastClouds && (
          <>
            {/* middle*/}
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='2'
              position={[-5, -2, -5]}
              size={{ width: 5.83, height: 3 }}
            />
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='1'
              position={[0, -1.4, -5]}
              size={{ width: 6, height: 4 }}
            />
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='0'
              position={[5.4, -2, -5]}
              size={{ width: 5.83, height: 3.8 }}
            />
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='1'
              position={[2.6, -0.65, -5.3]}
              size={{ width: 7, height: 4 }}
            />

            {/* top */}
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='0'
              position={[-5.5, -1, -6]}
              size={{ width: 7.3, height: 4.3 }}
            />
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='2'
              position={[-0.1, -0.3, -5]}
              size={{ width: 8, height: 5 }}
            />

            {/* far*/}
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='2'
              position={[9, 0.4, -13]}
              size={{ width: 8.83, height: 8 }}
            />
            <Cloud
              setIsCastle={setIsCastle}
              isCastle={isCastle}
              second={true}
              image='1'
              position={[-7, 0.8, -9]}
              size={{ width: 5.83, height: 5 }}
            />
          </>
        )}

        {/* //Apparition Corbeau */}
        {isPathComplete[0] && isPathComplete[1] && (
          <Corbeau position={[2, .65, 0]} />
        )}
        <Stats />
      </group>
    </>
  )
}
