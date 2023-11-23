'use client'

import { Stats } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState, useRef } from 'react'
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
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const chereOptions = {
  // loop: true,
  autoplay: true,
  animationData: chere,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

export default function Page() {
  const [isIntroClicked, setIsIntroClicked] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(0)
  // const [fogColor, setFogColor] = useState('#ffCBB3')

  // const colors = ['#b3c3ff', '#ffCBB3', '#5caeb1'];
  // const [colorIndex, setColorIndex] = useState(0);

  const handleIntroClick = () => {
    setIsIntroClicked(true)
    setIsStarted(true)
  }

  //useEffect(() => {

  //With GSAP every 30 seconds, add 1 to the colorIndex state if its=2 then set it to 0

  // const interval = setInterval(() => {
  //   setColorIndex((colorIndex + 1) % colors.length);
  //   console.log(colorIndex)
  // }
  //   , 30000);
  // });

  const [fogColor, setFogColor] = useState('#ffCBB3')
  const colors = ['#b3c3ff', '#ffCBB3', '#5caeb1']
  // colors = ['#3B274F', '#202227', '#27344F']
  const colorIndexRef = useRef(0)

  useEffect(() => {
    const getNextIndex = () => (colorIndexRef.current + 1) % colors.length

    const animateColorTransition = () => {
      const nextIndex = getNextIndex()

      GSAP.to(
        {},
        {
          delay: 1,
          duration: 5,
          onUpdate: function () {
            const newColor = GSAP.utils.interpolate(colors[colorIndexRef.current], colors[nextIndex], this.progress())
            setFogColor(newColor)
          },
          onComplete: () => {
            colorIndexRef.current = nextIndex
            animateColorTransition()
          },
        },
      )
    }

    animateColorTransition()
  }, [])
  return (
    <>
      <div className='scene absolute'>
        <View orbit={false} className='relative h-full  sm:w-full'>
          <Suspense fallback={null}>
            <fog attach='fog' color={fogColor} near={8} far={16} />
            <Scene setIsStarted={setIsStarted} isStarted={isStarted} isPlaying={isPlaying} />
            <Common color={'#000000'} />
          </Suspense>
        </View>
      </div>
    </>
  )
}
