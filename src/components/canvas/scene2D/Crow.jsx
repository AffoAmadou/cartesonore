'use client'

import * as THREE from 'three'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import GSAP from 'gsap'

import finUn from '../../../../public/sound/finUn.mp3'
import finDeux from '../../../../public/sound/finDeu.mp3'
import finDex from '../../../../public/sound/finDex.mp3'
import finTrois from '../../../../public/sound/victoire.mp3'
import finQuatre from '../../../../public/sound/calin.mp3'

import { PositionalAudio } from '@react-three/drei'

export const Crow = ({ timeline, setIsLast, setScene2D, scene2D, setPaths, paths, setPostScene }) => {
  const geometryRef = useRef()
  const meshSceneRef = useRef()
  const meshNavigationRef = useRef()
  const materialref = useRef(null)

  const [soundIndex, setSoundIndex] = useState(0)
  const [isBtnVisible, setIsBtnVisible] = useState(false)

  const textureCrow = useTexture('../../../../img/corbeauScene.png')
  const destruction = useTexture('../../../../img/destruction.png')
  const bagarre = useTexture('../../../../img/bagarre.png')
  const calin = useTexture('../../../../img/calin.png')
  const win = useTexture('../../../../img/win.png')
  const soeur = useTexture('../../../../img/soeur.png')

  const textureArrowBack = useTexture('../../../../img/arrow-back.svg')

  const sounds = [finUn, finDeux, finDex, finTrois, finQuatre]

  const soundref = useRef(null)

  let textures = [textureCrow, destruction, bagarre, win, calin, soeur]

  textures = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })

  const set = useThree((state) => state.set)
  const state = useThree((state) => state)

  const { getCurrentViewport } = useThree((state) => state.viewport)
  const { width, height } = getCurrentViewport(state.camera, [0, 0, 1.1])
  const [currentTexture, setCurrentTexture] = useState(1)
  const [lastTexture, setLastTexture] = useState(0)

  const [isLastScene, setIsLastScene] = useState(false)

  useFrame(({ clock }) => {
    materialref.current.uTime = clock.getElapsedTime()
  })

  useEffect(() => {
    let ang_rad = (state.camera.fov * Math.PI) / 180
    let fov_y = state.camera.position.z * Math.tan(ang_rad / 2) * 1

    // console.log(meshNavigationRef.current.material.opacity, 'opacity')


    //!Gestion du son de la scene
    if (soundref.current) {
      playSound()
    }

    let scaleMeshScene = GSAP.fromTo(
      meshSceneRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: width,
        y: height,
        z: 1,
        duration: 1,
        ease: 'power2.out',
      },
    )

    // let scaleMeshNavigation = GSAP.to(
    //   meshNavigationRef.current.material,
    //   {
    //     duration: 9,
    //     opacity: 0
    //   }
    // )

    timeline.add(scaleMeshScene, 0)

    let tl = GSAP.timeline({})

    tl.to(materialref.current, {
      duration: 1,
      progress: 1,
      ease: 'power2.out',
    })
  }, [])

  const animateProgress = (bool = true) => {

    console.log(soundIndex, 'soundIndex')

    if (soundIndex === 5) {
      setIsLast(false)
      setPostScene(true)
      setPaths([paths[0], paths[1], "#ff0000"])
      setScene2D(null)
    }
    else {
      GSAP.to(materialref.current, {
        duration: 1,
        uProgress: 1,
        ease: "linear",
        onComplete: () => {
          materialref.current.uProgress = 0;

          if (bool) {
            setLastTexture(currentTexture);
            setCurrentTexture((currentTexture + 1) % textures.length);

            console.log(textures[currentTexture], 'currentTexture bool')
            console.log(textures[lastTexture], 'lastTexture bool')
          }

          if (bool) {
            materialref.current.uTextureOne = textures[currentTexture];
            materialref.current.uTextureTwo = textures[lastTexture];
          }
          else {
            materialref.current.uTextureOne = textures[currentTexture + 1];
            materialref.current.uTextureTwo = textures[currentTexture + 1];
          }
          console.log(textures[currentTexture], 'currentTexture ')
          console.log(textures[lastTexture], 'lastTexture ')

          // setSoundIndex(soundIndex + 1);
          if (bool) {
            // setScene2D(null)
            playSound()
          }

          setIsBtnVisible(false)
        },
      });
    }

    // else {
    //   setScene2D(null)
    // }
  };

  const playSound = () => {
    console.log('play')
    soundref.current.play()
    soundref.current.setRefDistance(2)


    let time = soundref.current.buffer.duration.toString().split('.')[0]
    time *= 1000
    console.log(time, soundIndex)

    setTimeout(() => {
      if (soundIndex === 4) {
        animateProgress(false)
      }
    }, time / 1.5)
    setTimeout(() => {
      if (soundref.current) {
        soundref.current.stop()
        console.log('stop')

        setIsBtnVisible(true)
        setSoundIndex(soundIndex + 1)
      }
    }, time / time)
  }

  return (
    <group>
      {
        isBtnVisible &&
        <mesh
          ref={meshNavigationRef}
          position={[-2.45, 1.1, 2]}
          onPointerDown={() => {
            // setScene2D(null)

            animateProgress()
          }}
        >
          <planeGeometry args={[0.4, 0.4, 24, 24]} />
          <meshBasicMaterial opacity={1} color={0xffffff} map={textureArrowBack} transparent />
        </mesh>
      }

      <mesh ref={meshSceneRef} position={[state.camera.position.x, state.camera.position.y, 1.1]}>
        <planeGeometry ref={geometryRef} />

        <waveShaderMaterial
          ref={materialref}
          attach='material'
          opacity={1}
          uTime={0}
          transparent
          uTextureOne={textures[lastTexture]}
          uTextureTwo={textures[currentTexture]}
        />
      </mesh>


      {soundIndex === 0 && (
        <PositionalAudio url={sounds[soundIndex]} distance={2} ref={soundref} />
      )
      }
      {soundIndex === 1 && (
        <PositionalAudio url={sounds[soundIndex]} distance={2} ref={soundref} />
      )
      }

      {soundIndex === 2 && (
        <PositionalAudio url={sounds[soundIndex]} distance={2} ref={soundref} />
      )
      }

      {soundIndex === 3 && (
        <PositionalAudio url={sounds[soundIndex]} distance={2} ref={soundref} />
      )
      }

      {soundIndex === 4 && (
        <PositionalAudio url={sounds[soundIndex]} distance={2} ref={soundref} />
      )
      }
    </group>
  )
}

export const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTextureOne: new THREE.Texture(),
    uTextureTwo: new THREE.Texture(),
    uProgress: 0,
    uGrayscale: 1.0
  },
  // vertex shader
  /*glsl*/`
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;

  // noise
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
    {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //   x0 = x0 - 0.0 + 0.0 * C.xxx;
      //   x1 = x0 - i1  + 1.0 * C.xxx;
      //   x2 = x0 - i2  + 2.0 * C.xxx;
      //   x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
  }
    //END noise

  void main() {
    vUv = uv;

    vec3 pos = position;
    float noiseFreq = 1.;
    float noiseAmp = .425;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.z += snoise(noisePos*0.2) * noiseAmp;
    vWave = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // fragment shader
  /*glsl*/`
  uniform vec3 uColor;
  uniform float uTime;
  uniform sampler2D uTextureOne;
  uniform sampler2D uTextureTwo;
  uniform float uProgress;
  uniform bool uMouseOver;

  varying vec2 vUv;
  varying float vWave;



void main() {
  float wave = vWave * 2.03;
  vec4 imageOne = texture2D(uTextureOne, vUv + wave);
  vec4 imageTwo = texture2D(uTextureTwo, vUv + wave);

  float x = uProgress;
  vec2 p = vUv;
  x = smoothstep(.0,1.0,(x*2.+p.y-1.0));
  vec4 f = mix(
    texture2D(uTextureOne, (p-.5)*(1.-x)+.5), 
    texture2D(uTextureTwo, (p-.5)*x+.5), 
    x);


  gl_FragColor = f;
  gl_FragColor = linearToOutputTexel( gl_FragColor );
}
  `
)
WaveShaderMaterial.transparent = true
WaveShaderMaterial.depthWrite = false
extend({ WaveShaderMaterial });
