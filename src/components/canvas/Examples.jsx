'use client'

import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
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

// export const SkyShaderMaterial = shaderMaterial(
//   {
//     uTime: 0.0,
//     uColor: new THREE.Color(0xD3B1E7),
//     uBColor: new THREE.Color(0xFDFFEB),
//   },
//   // vertex shader
//   /*glsl*/`
//   varying vec2 vUv;
//     varying float vWave;

//     uniform float uTime;

//     void main() {
//       vUv = uv;
//       vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//       gl_Position = projectionMatrix * viewMatrix * worldPosition;
//     }
//   `,
//   // fragment shader
//   /*glsl*/`
//   uniform vec3 uColor;
//     uniform float uTime;
//     uniform sampler2D uTextureOne;
// uniform vec3 uBColor;
//     varying vec2 vUv;
//     varying float vWave;

//     void main() {

// // vec3 color = mix(uColor, uBColor, vUv.y);
//  vec3 color = mix(uColor, uBColor,vUv.y);
//       gl_FragColor = vec4(color, 1.0);
// }
//   `,

// )
// SkyShaderMaterial.transparent = true
// SkyShaderMaterial.depthWrite = false
// extend({ SkyShaderMaterial });

//!Scene Output scene
export const Scene = () => {
  const meshref = useRef(null)

  const [rotation, setRotation] = useState(true)
  const [scene2D, setScene2D] = useState({ display: false, name: '' })

  useFrame(({ clock }) => {})

  useEffect(() => {}, [])

  return (
    <>
      <group position={[0, 0, 0]}>
        {/* <Postcard /> */}
        {/* <Intro /> */}
        {/* <Sky /> */}

        {scene2D.display && (
          <mesh position={[1, 1, 0.5]} onClick={() => setScene2D({ name: 'kitchen', display: true })}>
            <planeGeometry args={[1, 0.5, 64, 64]} />
            <meshBasicMaterial attach='material' opacity={1} transparent color={0xffff00} />
          </mesh>
        )}

        {scene2D.display && scene2D.name === 'kitchen' && <Kitchen />}

        <Castle scale={0.24} position={[0, -2, -3]} rotation={[0.0, 1.5, 0]} />
        {/* <Castle
          scale={0.24}
          position={[0, -2, -3]}
          rotation={[0.0, 1.5, 0]}
          setRotation={setRotation}
          scene2D={scene2D}
          setScene2D={setScene2D}
        /> */}
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
      </group>
    </>
  )
}
