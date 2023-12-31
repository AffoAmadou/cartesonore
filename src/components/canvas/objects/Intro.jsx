import { useGLTF, shaderMaterial } from '@react-three/drei'
import { useFrame, useLoader, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import boite from "../../../../public/img/boite.png"
import blanc from "../../../../public/img/blanc.png"
import disp from "../../../../public/img/disp.jpg"
import GSAP from 'gsap'
import { PositionalAudio } from '@react-three/drei'
import sound from '../../../../public/sound/intro.mp3'


export const Intro = () => {
  const meshref = useRef(null)
  const soundref = useRef(null)

  let texture = useLoader(THREE.TextureLoader, blanc.src)
  texture.colorSpace = THREE.LinearSRGBColorSpace;

  let texturetwo = useLoader(THREE.TextureLoader, boite.src)
  texturetwo.colorSpace = THREE.LinearSRGBColorSpace;

  let texturethree = useLoader(THREE.TextureLoader, disp.src)
  texturethree.colorSpace = THREE.LinearSRGBColorSpace;

  let textures = [texture, texturetwo]

  useFrame(({ clock }) => {
    meshref.current.time = clock.getElapsedTime();
  });

  useEffect(() => {
    if (soundref.current) {
      soundref.current.play()
    }
    let tl = GSAP.timeline({
      ease: 'sin.inOut',
    });

    tl.to(meshref.current, {
      duration: 6.5,
      progress: 1,
      onComplete: () => {
        // console.log(textures[1])
        // if (textures[1])
        //   meshref.current.uTextureOne = textures[1];
      }
    });


  },)

  return (
    <>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[7.86, 4.37, 64, 64]} />

        <introShaderMaterial ref={meshref} side={THREE.DoubleSide} attach="material" opacity={1} transparent uTextureOne={textures[0]} uTextureTwo={textures[1]} displacement={texturethree} />

        <PositionalAudio
          url={sound}
          distance={1}
          ref={soundref}
          loopEnd={1}
        />
      </mesh>
    </>
  )
}





export const IntroShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTextureOne: new THREE.Texture(),
    uTextureTwo: new THREE.Texture(),
    fogColor: new THREE.Color(0xff0000),
    fogNear: { type: "f", value: 1 },
    fogFar: { type: "f", value: 10 },
    progress: 0.0,
    isPlaying: 0.0
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
    uniform sampler2D uTextureTwo;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    uniform float progress;
    uniform float isPlaying;

    varying vec2 vUv;
    varying float vWave;
    varying float fogDepth;

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
  //     vec4 imageOne = texture2D(uTextureOne, vUv);
  // vec4 imageTwo = texture2D(uTextureTwo, vUv);

  // float noise = (snoise(vec3(vUv * 35.0, uTime))+1.0)*0.5;
  // float transition = smoothstep(progress, 1.0, noise );

  // vec4 mixedImage = mix(imageOne,imageTwo, transition );

  // gl_FragColor = mixedImage;

  vec4 imageOne = texture2D(uTextureOne, vUv);
  vec4 imageTwo = texture2D(uTextureTwo, vUv);

  float noise = (snoise(vec3((vUv-.5) * 5., 1.) + .1 ) + 1.0)*.5;

  float transitionStart = 0.5;
  float newProgress = .2+progress + (snoise(vec3((vUv.xy-.5)*50., uTime) + .1 ) + 1.0)*.05;
  float transition = smoothstep(newProgress-.25,newProgress,noise);

  vec4 mixedImage = mix( imageTwo,imageOne, transition);

  gl_FragColor = mixedImage;
    }
  `,

)
IntroShaderMaterial.transparent = true
IntroShaderMaterial.depthWrite = false
extend({ IntroShaderMaterial });
