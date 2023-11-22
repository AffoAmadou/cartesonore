'use client'

import { Stats } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import Play from './components/play'
import Lottie from 'react-lottie'
import intros from '../public/intros.json'
import chere from '../public/chere.json'
import GSAP from 'gsap'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const Scene = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Scene), { ssr: false })

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: intros,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const chereOptions = {

  // loop: true,
  autoplay: true,
  animationData: chere,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};


export default function Page() {
  const [isIntroClicked, setIsIntroClicked] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(0)
  const [fogColor, setFogColor] = useState('#ffCBB3')

  // b3c3ff
  //ffCBB3
  //5caeb1
  const colors = ['#b3c3ff', '#ffCBB3', '#5caeb1'];
  const [colorIndex, setColorIndex] = useState(0);
  const handleIntroClick = () => {
    setIsIntroClicked(true)
    setIsStarted(true)
  }

  useEffect(() => {


    //With GSAP every 30 seconds, add 1 to the colorIndex state if its=2 then set it to 0

    const interval = setInterval(() => {
      setColorIndex((colorIndex + 1) % colors.length);
      console.log(colorIndex)
    }
      , 30000);

  });


  return (
    <>
      <div className='scene absolute'>

        <View orbit={false} className='relative h-full  sm:w-full'>
          {/* <fog attach='fog' color="white" near={7} far={10} /> */}
          <Suspense fallback={null}>
            <fog attach='fog' color={colors[colorIndex]} near={6} far={16} />
            <Scene setIsStarted={setIsStarted} isStarted={isStarted} isPlaying={isPlaying} />
            <Common color={'#000000'} />
          </Suspense>
        </View>
      </div>
    </>
  )
}



// {
//   !isIntroClicked &&
//     <div className="intro">
//       <div className="intro__wrapper">
//         <h1>Chere Lily...</h1>
//         <Play />

//         <Lottie
//           options={chereOptions}
//           height={350}
//           width={350}
//         />
//         <button onClick={handleIntroClick}>
//           <Lottie
//             options={defaultOptions}
//             height={350}
//             width={350}
//           />
//         </button>

//       </div>
//     </div>
// }
