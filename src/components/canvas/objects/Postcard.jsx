import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import GSAP from 'gsap'
import carte from '../../../../public/img/carte.png'
import fin from '../../../../public/img/fin.png'

import { PositionalAudio, useTexture } from '@react-three/drei'
import sound from '../../../../public/sound/cartepostale.mp3'

//!Postal card model

export const Postcard = ({
  isStarted,
  isPlaying,
  setFirstClouds,
  setIsStarted,
  setLastClouds,
  setIsCastle,
  setIsPostcard,
  setOutlineObject,
  postScene
}) => {
  const meshref = useRef(null)
  const materialref = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const soundref = useRef(null)
  const [isClicked, setClicked] = useState(false)


  let texture = useTexture(carte.src)
  if (postScene) {
    texture = useTexture(fin.src)
  }
  texture.colorSpace = THREE.SRGBColorSpace



  useFrame(({ clock }) => {
    meshref.current.uTime = clock.getElapsedTime()
  })

  useEffect(() => {
    //?Timeline animation
    let tl = GSAP.timeline({
      ease: 'sine.inOut',
    })

    if (isFirstTime) {
      meshref.current.scale.set(0.29, 0.29, 0.29)
      meshref.current.rotation.set(0, 0, 0.45)
      meshref.current.position.set(-0.1, 0, 0)

      console.log('first time')
      GSAP.fromTo(
        materialref.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 8,
          ease: 'expo.inOut',
        },
      )

      setIsFirstTime(false)
    }



    if (postScene) {
      console.log('post scene')
      meshref.current.scale.set(1, 1, 1)
      meshref.current.rotation.set(0, 0, 0)
      meshref.current.position.set(0, 0, 0.1)
    }
    else if (!postScene && isStarted) {
      animateCard()
    }
  }, [isStarted, postScene])

  const animateCard = () => {
    let tl = GSAP.timeline({
      ease: 'sine.inOut',
    })

    tl.to(meshref.current.position, {
      delay: 2,
      duration: 2.5,
      z: -3,
    })

    tl.to(
      meshref.current.rotation,
      {
        duration: 1.5,
        x: -Math.PI * 0.5,

        onUpdate: () => {
          if (tl.progress() > 0.5) {
            setFirstClouds(true)
          }
        },
      },
      '-=1',
    )

    tl.to(
      meshref.current.position,
      {
        duration: 2.5,
        y: -2.3,
        ease: 'power1.out',

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
        },
      },
      '-=2',
    )

    tl.to(
      meshref.current.position,
      {
        duration: 2.5,
        y: -2.3,
        ease: 'power1.out',

        onUpdate: () => {
          if (tl.progress() > 0.9) {
            setLastClouds(true)
          }

          if (tl.progress() > 0.95) {
            setIsCastle(true)
          }
        },
        onComplete: () => {
          // setIsPostcard(false)
        },
      },
      '-=2',
    )
  }

  //!CLICK EFFECT
  const handleClick = () => {
    console.log('click')

    if (isClicked) return

    setClicked(true)
    setOutlineObject(null)

    let tl = GSAP.timeline({
      ease: 'expo.in',
      duration: 1,
    })

    tl.to(meshref.current.position, {
      duration: 1,
      y: 0,
      x: 0,
      z: 0,
    })

    tl.to(
      meshref.current.rotation,
      {
        duration: 1,
        z: 0,
      },
      '-=1',
    )

    tl.to(meshref.current.scale, {
      duration: 1.5,
      x: 1,
      y: 1,
      z: 1,

      onComplete: () => {
        // setIsStarted(true)
        if (soundref.current) {
          soundref.current.setVolume(0.8)
          soundref.current.play()
          console.log(soundref.current.buffer.duration)

          let time = soundref.current.buffer.duration.toString().split('.')[0]
          time *= 1000
          console.log(time)

          setTimeout(() => {
            setIsStarted(true)

            console.log('start to move the post card')
          }, time - 30000)

          setTimeout(() => {
            if (soundref.current) {
              soundref.current.stop()
              console.log('stop')

              GSAP.to(meshref.current.material, {
                duration: 1.4,
                opacity: 0,
                onComplete: () => {
                  // setIsPostcard(false)
                },
              })
            }
          }, time + 1000)
          // time + 1000
        }
      },
    })
  }

  //!HOVER EFFECT
  const handleHover = (e) => {
    setOutlineObject(e.object)
  }

  const handleNonHover = () => {
    setOutlineObject(null)
  }

  return (
    <>
      <mesh ref={meshref} position={[0, 0, 0]} onClick={handleClick}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />

        <postCardShaderMaterial
          ref={materialref}
          side={THREE.DoubleSide}
          attach='material'
          opacity={1}
          transparent
          uTextureOne={texture}
          isStarted={isStarted}
        />
      </mesh>

      <PositionalAudio url={sound} distance={100} ref={soundref} />

      {!isClicked && (
        <mesh
          rotation={[0, 0, 0.45]}
          scale={[0.3, 0.3, 0.3]}
          position={[-0.098, 0, 0.1]}
          onPointerOut={handleNonHover}
          onPointerOver={(e) => handleHover(e)}
          onClick={handleClick}
        >
          <planeGeometry args={[7.48, 4.15, 64, 64]} />
          <meshBasicMaterial color='#ff0000' opacity={0} transparent />
        </mesh>
      )}
    </>
  )
}

export const PostCardShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uTextureOne: new THREE.Texture(),
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;  
    }
  `,
  // fragment shader
  /*glsl*/ `
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
extend({ PostCardShaderMaterial })
