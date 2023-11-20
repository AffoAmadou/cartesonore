'use client'

import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useState, useEffect } from 'react'
import { Line, useCursor, MeshDistortMaterial, PositionalAudio } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import GSAP from 'gsap'

import sound from "../../../public/sound/crow.mp3"
import nuage from "../../../public/img/nuages.png"
import nuage1 from "../../../public/img/nuage1.png"
import nuage2 from "../../../public/img/nuage2.png"
import cuisine from "../../../public/img/cuisine.png"
import post from "../../../public/img/post.png"
import carte from "../../../public/img/carte.png"
import intro from "../../../public/img/intro.png"

export const Blob = ({ route = '/', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

export const Logo = ({ route = '/blob', ...props }) => {
  const mesh = useRef(null)
  const router = useRouter()

  const [hovered, hover] = useState(false)
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 4
  })

  return (
    <group ref={mesh} {...props}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, -1]} />
      <mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0} color={hovered ? 'hotpink' : '#1fb2f5'} />
      </mesh>
    </group>
  )
}

export function Duck(props) {
  const { scene } = useGLTF('/duck.glb')

  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}
export function Dog(props) {
  const { scene } = useGLTF('/dog.glb')

  return <primitive object={scene} {...props} />
}


//Castle model
export function Castle(props) {
  const { scene } = useGLTF('/castle.glb')

  return <primitive object={scene} {...props} />
}

//Raven model
export function RavenModel(props) {
  const { scene } = useGLTF('/raven.glb')

  return <primitive object={scene} {...props} />
}

//!Postal card model

export const Postcard = () => {
  const meshref = useRef(null)
  let texture = useLoader(THREE.TextureLoader, carte.src)
  texture.encoding = THREE.LinearSRGBColorSpace;

  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime();
  });

  // useEffect(() => {

  //   //?Timeline animation
  //   let tl = GSAP.timeline({
  //     ease: 'sine.inOut',
  //   });

  //   tl.to(meshref.current.position, {
  //     duration: 2.5,
  //     z: -3,
  //   });

  //   tl.to(meshref.current.rotation, {
  //     duration: 1.5,
  //     x: -Math.PI * 0.5,

  //     onComplete: () => {
  //       // this.setCastle();
  //     }
  //   }, "-=1");

  //   tl.to(meshref.current.position, {
  //     duration: 2.5,
  //     y: -2.3,
  //     ease: "power4.out"
  //   });
  // }, [])



  return (
    <>
      <mesh ref={meshref} position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} attach="material" opacity={1} transparent map={texture} />

      </mesh>
    </>
  )
}

//!Raven 
export const Raven = () => {
  const soundref = useRef(null)

  const playSound = () => {
    if (soundref.current) {
      soundref.current.play();
    }
  };
  return (
    <RavenModel onClick={playSound} position={[-6, 2, -10]}>
      <PositionalAudio
        url={sound}
        distance={1}
        ref={soundref}
      />
    </RavenModel>
  )
}

export const CloudShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTextureOne: new THREE.Texture(),
    fogColor: new THREE.Color(0xff0000),
    fogNear: { type: "f", value: 1 },
    fogFar: { type: "f", value: 10 }
  },
  // vertex shader
  /*glsl*/`
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
  /*glsl*/`
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
extend({ CloudShaderMaterial });

//!Clouds
export const Cloud = ({ image, position, size }) => {
  let texture = useLoader(THREE.TextureLoader, nuage.src)
  let texturetwo = useLoader(THREE.TextureLoader, nuage1.src)
  let texturethree = useLoader(THREE.TextureLoader, nuage2.src)

  let textures = [texture, texturetwo, texturethree]

  textures = textures.map((texture) => {
    texture.encoding = THREE.LinearSRGBColorSpace;
    return texture;
  });

  let meshref = useRef(null)
  useEffect(() => {
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

  }, [])


  return (
    <mesh ref={meshref} position={position}>
      <planeGeometry args={[size.width, size.height, 64, 64]} />
      {/* <cloudShaderMaterial side={THREE.DoubleSide} transparent uTextureOne={textures[image]} /> */}
      <meshBasicMaterial side={THREE.DoubleSide} transparent map={textures[image]} />
    </mesh>
  )
}

export const SkyShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0xD3B1E7),
    uBColor: new THREE.Color(0xFDFFEB),
  },
  // vertex shader
  /*glsl*/`
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
  /*glsl*/`
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
extend({ SkyShaderMaterial });


//!Postal card model

export const Sky = () => {
  const meshref = useRef(null)

  useFrame(({ clock }) => {
  });

  useEffect(() => {


  }, [])



  return (
    <>
      <mesh ref={meshref} position={[0, 0, -15]}>
        <planeGeometry args={[50.86, 20.37, 64, 64]} />
        <skyShaderMaterial />
      </mesh>
    </>
  )
}

export const Intro = () => {
  const meshref = useRef(null)
  let texture = useLoader(THREE.TextureLoader, intro.src)
  texture.encoding = THREE.LinearSRGBColorSpace;

  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime();
  });


  return (
    <>
      <mesh ref={meshref} position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />
        <meshBasicMaterial side={THREE.DoubleSide} attach="material" opacity={1} transparent map={texture} />

      </mesh>
    </>
  )
}



//!Scene Output scene
export const Scene = () => {
  const meshref = useRef(null)

  useFrame(({ clock }) => {
  });

  useEffect(() => {


  }, [])



  return (
    <>
      <group position={[0, 0, 0]}>
        {/* <Postcard /> */}
        <Intro />
        <Sky />
        <Castle scale={.24} position={[0, -2, -3]} rotation={[0.0, 1.5, 0]} />
        <Cloud image="1" position={[-2.6, -1.9, 0]} size={{ width: 4, height: 2 }} />
        <Cloud image="2" position={[.1, -2.2, 0]} size={{ width: 3.3, height: 1.8 }} />
        <Cloud image="0" position={[2, -1.6, 1]} size={{ width: 2.8, height: 1.6 }} />

        {/* middle*/}
        <Cloud image="2" position={[-5, -2, -4]} size={{ width: 5.83, height: 3 }} />
        <Cloud image="1" position={[0, -1.4, -4]} size={{ width: 6, height: 4 }} />
        <Cloud image="0" position={[5.4, -2, -4]} size={{ width: 5.83, height: 3.8 }} />
        <Cloud image="1" position={[2.6, -.65, -4.3]} size={{ width: 7, height: 4 }} />


        {/* top */}
        <Cloud image="0" position={[-5.5, -1, -6]} size={{ width: 7.3, height: 4.3 }} />
        <Cloud image="2" position={[-.1, -.3, -5]} size={{ width: 8, height: 5 }} />


        {/* far*/}
        <Cloud image="2" position={[9, .4, -13]} size={{ width: 8.83, height: 8 }} />
        <Cloud image="1" position={[-7, .8, -9]} size={{ width: 5.83, height: 5 }} />

      </group >
    </>
  )
}
