import { useGLTF, shaderMaterial, useTexture } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import * as THREE from 'three'

import { useRef, useEffect, useState } from 'react'
import nuage from "../../../../public/img/nuages.png"
import nuage1 from "../../../../public/img/nuage1.png"
import nuage2 from "../../../../public/img/nuage2.png"

import GSAP from 'gsap'


//!Clouds
export const Cloud = ({ image, position, size, second = false, setIsCastle = null, isCastle = null }) => {
  const [isCreated, setIsCreated] = useState(false)
  let texture = useTexture(nuage.src)
  let texturetwo = useTexture(nuage1.src)
  let texturethree = useTexture(nuage2.src)

  let textures = [texture, texturetwo, texturethree]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.LinearSRGBColorSpace;
    return texture;
  });

  let meshref = useRef(null)
  useEffect(() => {
    if (!isCreated) {
      if (second) {
        let meshcurrentZ = meshref.current.position.z
        let tl = GSAP.timeline({
          ease: "expo.out"
        });

        meshref.current.position.z = -.5;

        tl.fromTo(meshref.current.material, {
          opacity: 0,
        },
          {
            duration: 2,
            opacity: 1,

            ease: "expo.out",
            onComplete: () => {
              if (!isCastle) {
                setIsCastle(true)
              }
            }
          });

        tl.to(meshref.current.position, {
          duration: 3,
          z: meshcurrentZ,
          onComplete: () => {
            setIsCreated(true)
          }
        })
      }
      else {
        GSAP.fromTo(meshref.current.scale, {
          duration: 1,
          x: 0.2,
          y: 0.2,
          z: 0.2,
        }, {
          duration: 1,
          x: 1,
          y: 1,
          z: 1,
          onComplete: () => {
            setIsCreated(true)
          }
        });
      }
    }
    else {
      let tl = GSAP.timeline({
        ease: 'ease.in',
        repeat: -1,
      });

      // Scale up
      tl.to(meshref.current.scale, {
        duration: 4.5,
        x: 1.3,
        y: 1.3,
        z: 1.3,
      });

      // Scale down
      tl.to(meshref.current.scale, {
        duration: 4.5,
        x: 1,
        y: 1,
        z: 1,
      },);
    }
  }, [isCreated])


  return (
    <mesh ref={meshref} position={position}>
      <planeGeometry args={[size.width, size.height, 64, 64]} />
      {/* <cloudShaderMaterial side={THREE.DoubleSide} transparent uTextureOne={textures[image]} /> */}
      <meshBasicMaterial
        side={THREE.DoubleSide}
        transparent
        map={textures[image]}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

export const CloudShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTextureOne: new THREE.Texture(),
    fogColor: new THREE.Color(0xff0000),
    fogNear: { type: 'f', value: 1 },
    fogFar: { type: 'f', value: 10 },
  },
  // vertex shader
  /*glsl*/ `
  varying vec2 vUv;
    varying float vWave;
    varying float fogDepth;

    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      fogDepth = -worldPosition.z;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;  
    }
  `,
  // fragment shader
  /*glsl*/ `
  uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTextureOne;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;

    varying vec2 vUv;
    varying float vWave;
    varying float fogDepth;

    void main() {
      float wave = vWave * 2.03;
      vec4 imageOne = texture2D(uTextureOne, vUv + wave);
      vec4 baseColor = imageOne;

      // Calculate fog factor
      float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
      vec3 foggedColor = mix(baseColor.rgb, fogColor, fogFactor);

      gl_FragColor = vec4(foggedColor, baseColor.a);
}
  `,
)
CloudShaderMaterial.transparent = true
CloudShaderMaterial.depthWrite = false

CloudShaderMaterial.alphaTest = 0.5
extend({ CloudShaderMaterial });
