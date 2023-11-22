
import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import GSAP from 'gsap'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import carte from "../../../../public/img/carte.png"
import intro from "../../../../public/img/intro.png"

import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/cartepostale.mp3'

//!Postal card model

export const Postcard = ({ isStarted, isPlaying, setFirstClouds, setIsStarted, setLastClouds, setIsCastle, setIsPostcard }) => {
  const meshref = useRef(null)
  const materialref = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [isHover, setIsHover] = useState(null)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const soundref = useRef(null)




  let texture = useLoader(THREE.TextureLoader, carte.src)
  texture.colorSpace = THREE.LinearSRGBColorSpace;

  let texturetwo = useLoader(THREE.TextureLoader, intro.src)
  texturetwo.colorSpace = THREE.LinearSRGBColorSpace;

  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime();
  });

  useEffect(() => {

    //?Timeline animation
    let tl = GSAP.timeline({
      ease: 'sine.inOut',
    });

    if (isFirstTime) {
      meshref.current.scale.set(0.29, 0.29, 0.29)
      meshref.current.rotation.set(0, 0, .45)
      meshref.current.position.set(-.1, 0, 0)

      console.log('first time')
      GSAP.fromTo(materialref.current, {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 8,
        ease: 'expo.inOut',
      })

      setIsFirstTime(false)
    }

    if (isStarted) {
      animateCard()
    }

  }, [isStarted])


  const animateCard = () => {
    let tl = GSAP.timeline({
      ease: 'sine.inOut',
    });

    tl.to(meshref.current.position, {
      delay: 2,
      duration: 2.5,
      z: -3,
    });

    tl.to(meshref.current.rotation, {
      duration: 1.5,
      x: -Math.PI * 0.5,

      onUpdate: () => {
        if (tl.progress() > 0.5) {
          setFirstClouds(true)
        }
      }
    }, "-=1");

    tl.to(meshref.current.position, {
      duration: 2.5,
      y: -2.3,
      ease: "power1.out",

      onUpdate: () => {
        if (tl.progress() > 0.9) {
          setLastClouds(true)
        }

        if (tl.progress() > 0.95) {
          // setIsCastle(true)
        }
      },
      onComplete: () => {
        // setIsPostcard(false)
      }
    }, "-=2");

  }

  //!CLICK EFFECT
  const handleClick = () => {
    console.log('click')


    let tl = GSAP.timeline({
      ease: 'expo.in',
      duration: 1,
    });

    tl.to(meshref.current.position, {
      duration: 1,
      y: 0,
      x: 0,
      z: 0,
    })

    tl.to(meshref.current.rotation, {
      duration: 1,
      z: 0,
    }, "-=1");

    tl.to(meshref.current.scale, {
      duration: 1.5,
      x: 1,
      y: 1,
      z: 1,

      onComplete: () => {
        // setIsStarted(true)
        if (soundref.current) {
          soundref.current.play();
          console.log(soundref.current.buffer.duration)

          let time = soundref.current.buffer.duration.toString().split('.')[0]
          time *= 1000
          console.log(time)

          setTimeout(() => {

            setIsStarted(true)

            console.log('start to move the post card')
          }, time - 30000);

          setTimeout(() => {
            if (soundref.current) {
              soundref.current.stop();
              console.log('stop')

              GSAP.to(meshref.current.material, {
                duration: 1.4,
                opacity: 0,
                onComplete: () => {
                  setIsStarted(false)
                }

              })

            }
          }, time + 1000);
        }

      }
    });
  }

  //!HOVER EFFECT
  const handleHover = (e) => {
    console.log(e)
    setIsHover(e.object)
  }

  const handleNonHover = () => {
    setIsHover(null)
  }

  return (
    <>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={isHover}
          edgeStrength={10.0}
          visibleEdgeColor={0xffff00}
          hiddenEdgeColor={0x101010}
          blur={true}
          kernelSize={KernelSize.SMALL}
        />

      </EffectComposer>
      <mesh onPointerOut={handleNonHover} onPointerOver={(e) => handleHover(e)} onClick={handleClick} ref={meshref} position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />

        <postCardShaderMaterial ref={materialref} side={THREE.DoubleSide} attach="material" opacity={1} transparent uTextureOne={texture} uTextureTwo={texturetwo} isStarted={isStarted} />

        <PositionalAudio
          url={sound}
          distance={100}

          ref={soundref}
        />
      </mesh>
    </>
  )
}



export const PostCardShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uTextureOne: new THREE.Texture(),
  },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;  
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform sampler2D uTextureOne;
    varying vec2 vUv;

  void main() {
  
  vec4 imageOne = texture2D(uTextureOne, vUv);

  gl_FragColor = imageOne;
    }
  `,

)
PostCardShaderMaterial.transparent = true
PostCardShaderMaterial.depthWrite = false
extend({ PostCardShaderMaterial });
