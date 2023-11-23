'use client'

import { Stats } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState, useRef } from 'react'
import Play from './components/play'
import Lottie from 'react-lottie'
import intros from '../public/intros.json'
import chere from '../public/chere.json'
import GSAP from 'gsap'
import loading from '../public/img/loading.gif'
import fin from '../public/img/fin.gif'
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
  const [isIntro, setIsIntro] = useState(true)
  const [paths, setPaths] = useState(["#ffffff", "#ffffff", "#000000"])




  const handleIntroClick = () => {
    // setIsIntroClicked(true)
    // setIsStarted(true)

    setIsIntro(false)
  }



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

      // GSAP.to(["#first", "#second", "#third"], {
      //   fill: "#ffffff"
      // })
    }


    animateColorTransition()
    console.log(paths, 'loading')
  }, [])

  useEffect(() => {
  }, [paths])
  return (
    <>
      <div className='scene absolute'>
        {!isIntro &&

          <svg id="Livello_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000">
            <path d="m1006.42,745.61c8.66,41.49,11.23,83.95,18.68,125.52,1.25,6.81,2.64,13.59,4.6,20.12,1.53,4.8,3.13,9.72,6.51,13.48,1.15,1.28,2.6,2.2,4.32,2.64-1.85.43-3.87.02-5.61-.77-10.85-5.66-17.2-21.56-21.22-32.43-13.15-39.44-15.55-87.94-7.29-128.57h0Z" fill="#f2dcb1" stroke-width="0" />

            <path d="m1016.8,1162.12c8.66,41.49,11.23,83.95,18.68,125.52,1.25,6.81,2.64,13.59,4.6,20.12,1.53,4.8,3.13,9.72,6.51,13.48,1.15,1.28,2.6,2.2,4.32,2.64-1.85.43-3.87.02-5.61-.77-10.85-5.66-17.2-21.56-21.22-32.43-13.15-39.44-15.55-87.94-7.29-128.57h0Z" fill="#f2dcb1" stroke-width="0" /><g id="first"><circle cx="1009.81" cy="620.18" r="125.12" fill={paths[0]} stroke-width="0" />

              <path d="m1035.21,496.65c49.59,9.98,95.9,46.97,106.18,98.24,20.87,100.74-90.71,180.97-182.88,146.88-79.35-28.86-110.16-128.81-60.32-197.22,30.39-42.56,87.35-58.63,137.01-47.9h0Zm-.4,1.96c-48.35-10.17-95.56,16.05-120.58,56.82-43.66,70.32-8.29,159.93,71.47,181.94,30.7,8.44,64.96,2.87,91.16-15.4,39.33-26.84,55.09-78.27,47.12-123.72-7.8-47.15-40.49-90.16-89.17-99.64h0Z" fill="#7b6a58" stroke-width="0" /></g><g id="second">
              <circle cx="1023.48" cy="1038.69" r="125.12" fill={paths[1]} stroke-width="0" />

              <path d="m1128.8,969.31c28.01,42.12,34.6,101.02,5.61,144.55-58.2,88.2-198.08,62.46-235.78-31.4-30.63-75.79,18.35-163.45,99.41-176.16,51.59-8.61,103.22,20.31,130.75,63.01h0Zm-1.67,1.1c-26.99-41.38-78.92-56.22-125.43-45.08-80.6,18.85-118.95,107.22-78.12,179.19,15.74,27.67,43.91,47.97,75.35,53.57,46.79,8.83,94.3-16.39,120.8-54.17,27.82-38.85,35.12-92.38,7.4-133.51h0Z" fill="#ca9e67" stroke-width="0" /></g><g id="third">
              <circle cx="1023.48" cy="1448.21" r="125.12" fill={paths[2]} stroke-width="0" />

              <path d="m1149,1435.95c5.13,50.33-16.51,105.5-62.45,130.48-92.62,50.88-204.35-37.12-193.92-137.74,8.25-81.33,92.46-136.03,170.09-109.47,49.65,16.44,81.84,66.1,86.28,116.72h0Zm-1.99.19c-4.58-49.19-43.59-86.54-89.93-98.38-80.09-20.91-155.22,39.38-152.67,122.08,1.02,31.82,16.47,62.91,41.67,82.53,37.27,29.64,91.06,29.47,132.12,8.42,42.73-21.39,74.15-65.34,68.81-114.65h0Z" fill="#936037" stroke-width="0" /></g></svg>
        }
        {
          isIntro &&
          <img onClick={handleIntroClick} className='load' src={loading.src} />
        }
        {!isIntro &&

          <View orbit={false} className='relative h-full  sm:w-full'>
            <Suspense fallback={null}>
              <fog attach='fog' color={fogColor} near={8} far={16} />
              <Scene paths={paths} setPaths={setPaths} setIsStarted={setIsStarted} isStarted={isStarted} isPlaying={isPlaying} />
              <Common color={'#ffffff'} />
            </Suspense>
          </View>
        }
      </div>
    </>
  )
}
