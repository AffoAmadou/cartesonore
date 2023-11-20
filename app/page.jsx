'use client'

import { Stats } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import play from '../public/img/play.png'

const Logo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Logo), { ssr: false })
const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const Castle = dynamic(() => import('@/components/canvas/Castle').then((mod) => mod.Castle), { ssr: false })
const Duck = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Duck), { ssr: false })
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

const Postcard = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Postcard), { ssr: false })

const Kitchen = dynamic(() => import('@/components/canvas/Kitchen').then((mod) => mod.Kitchen), { ssr: false })

const Raven = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Raven), { ssr: false })

const Cloud = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Cloud), { ssr: false })
const Sky = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Sky), { ssr: false })

const Scene = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Scene), { ssr: false })

export default function Page() {
  return (
    <>
      <div className='scene absolute'>
        {/* <div className="intro">
          <div className="intro__wrapper">
            <h1>Chere Lily...</h1>
            <button>
              <img src={play.src} alt="" />
            </button>
          </div>
        </div> */}
        <View orbit={false} className='relative h-full  sm:w-full'>
          {/* <fog attach='fog' color="white" near={7} far={10} /> */}
          <Suspense fallback={null}>
            <fog attach='fog' color='#D4CBB3' near={6} far={16} />

            {/*<Castle scale={.24} position={[0, -2, -3]} rotation={[0.0, 1.5, 0]} />  */}
            {/* <Postcard /> */}
            {/* <Raven /> */}
            <Scene />
            {/* <Sky /> */}
            {/* bas */}
            {/* <Cloud image="1" position={[-2.6, -1.9, 0]} size={{ width: 4, height: 2 }} />
            <Cloud image="2" position={[.1, -2.2, 0]} size={{ width: 3.3, height: 1.8 }} />
            <Cloud image="0" position={[2, -1.6, 1]} size={{ width: 2.8, height: 1.6 }} /> */}

            {/* middle*/}
            {/* <Cloud image="2" position={[-5, -2, -4]} size={{ width: 5.83, height: 3 }} />
            <Cloud image="1" position={[0, -1.4, -4]} size={{ width: 6, height: 4 }} />
            <Cloud image="0" position={[5.4, -2, -4]} size={{ width: 5.83, height: 3.8 }} />
            <Cloud image="1" position={[2.6, -.65, -4.3]} size={{ width: 7, height: 4 }} /> */}

            {/* top */}
            {/* <Cloud image="0" position={[-5.5, -1, -6]} size={{ width: 7.3, height: 4.3 }} />
            <Cloud image="2" position={[-.1, -.3, -5]} size={{ width: 8, height: 5 }} />
 */}

            {/* far*/}
            {/* <Cloud image="2" position={[9, .4, -13]} size={{ width: 8.83, height: 8 }} />
            <Cloud image="1" position={[-7, .8, -9]} size={{ width: 5.83, height: 5 }} /> */}

            <Common color={'#a05dcf'} />
          </Suspense>
        </View>
      </div>
    </>
  )
}
