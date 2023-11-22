'use client'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import GSAP from 'gsap'
import { is } from '@react-spring/shared'

//Castle model
export const Castle = (props) => {
  const castleRef = useRef()
  const { scene } = useGLTF('/castle_light.glb')
  const [selectedObject, setSelectedObject] = useState(null)
  const positionVec = new THREE.Vector3(0, 0, 6)

  const handleHover = (e) => {
    if (props.scene2D) return

    if (e.object.name === 'chambre1' || e.object.name === 'cuisine1') {
      props.setOutlineObject(e.object)
    }
  }

  const handleNonHover = () => {
    props.setOutlineObject(null)
  }

  const zoomToView = (focusRef) => {
    if (props.scene2D) return

    if (focusRef.object.name === 'chambre1') {
      console.log('chambre1')
      props.setZoom(true)
      setSelectedObject(focusRef.object)
    } else if (focusRef.object.name === 'cuisine1') {
      console.log('cuisine1')
      props.setZoom(true)
      setSelectedObject(focusRef.object)
    }
    else {
      console.log('nope')
      props.setZoom(false)
      setSelectedObject(null)
      props.setScene2D(null)
    }
  }

  const state = useThree((state) => state)

  useEffect(() => {
    props.setIsLily(true)
    props.setIsChien(true)

    console.log('ispathComplete', props.isPathComplete)
    console.log('setisPathComplete', props.setIsPathComplete)

    if (props.zoom) {
      if (selectedObject.name === 'chambre1') {
        positionVec.set(-0.6, -0.6, 0)
      } else {
        positionVec.set(0.6, -0.6, 0)
      }
    } else {
      positionVec.set(0, 0, 6)
    }

    let cameraPosition = GSAP.to(state.camera.position, {
      x: positionVec.x,
      y: positionVec.y,
      z: positionVec.z,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        if (props.zoom) {
          selectedObject.name === 'chambre1' ? props.setScene2D('bedroom') : props.setScene2D('kitchen')

          if (selectedObject.name === 'chambre1') {
            props.setIsPathComplete([true, props.isPathComplete[1]])
            console.log('isPathc', props.isPathComplete)
          }
          else {
            props.setIsPathComplete([props.isPathComplete[0], true])
            console.log('isPathc', props.isPathComplete)
          }
        }
      },
    })

    props.timeline.add(cameraPosition, 0)
  }, [props.zoom])

  return (
    <>
      <primitive
        ref={castleRef}
        object={scene}
        {...props}
        onPointerOver={(e) => handleHover(e)}
        onPointerOut={handleNonHover}
        onClick={(e) => {
          zoomToView(e)
        }}
      />
    </>
  )
}
