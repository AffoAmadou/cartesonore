import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { PositionalAudio } from '@react-three/drei'
import GSAP from 'gsap'

export const Sky = () => {
  const meshref = useRef(null)

  useFrame(({ clock }) => {})

  useEffect(() => {}, [])

  return (
    <>
      <mesh ref={meshref} position={[0, 0, -15]}>
        <planeGeometry args={[50.86, 20.37, 64, 64]} />
        <skyShaderMaterial />
      </mesh>
    </>
  )
}

export const SkyShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0xd3b1e7),
    uBColor: new THREE.Color(0xfdffeb),
  },
  // vertex shader
  /*glsl*/ `
  varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  // fragment shader
  /*glsl*/ `
  uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTextureOne;
uniform vec3 uBColor;
    varying vec2 vUv;
    varying float vWave;

    void main() {

// vec3 color = mix(uColor, uBColor, vUv.y);
 vec3 color = mix(uColor, uBColor,vUv.y);
      gl_FragColor = vec4(color, 1.0);
}
  `,
)
SkyShaderMaterial.transparent = true
SkyShaderMaterial.depthWrite = false
extend({ SkyShaderMaterial })
