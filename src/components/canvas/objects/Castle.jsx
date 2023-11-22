'use client'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import GSAP from 'gsap'

//Castle model
export const Castle = (props) => {
  const castleRef = useRef()
  const ghostMesh = useRef()
  const { scene } = useGLTF('/castle_light.glb')
  const [outlineObject, setOutlineObject] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [zoom, setZoom] = useState(false)
  const positionVec = new THREE.Vector3(0, 0, 6)
  const lookatVec = new THREE.Vector3(0, 0, 0)

  const handleHover = (e) => {
    if (props.scene2D) return

    if (e.object.name === 'chambre1' || e.object.name === 'cuisine1') {
      setOutlineObject(e.object)
    }
  }

  const handleNonHover = () => {
    setOutlineObject(null)
  }

  const zoomToView = (focusRef) => {
    if (props.scene2D) return

    if (focusRef.object.name === 'chambre1' || focusRef.object.name === 'cuisine1') {
      props.setZoom(true)
      setSelectedObject(focusRef.object)
    } else {
      props.setZoom(false)
      setSelectedObject(null)
      props.setScene2D(null)
    }
  }

  const state = useThree((state) => state)

  useEffect(() => {
    if (props.zoom) {
      if (selectedObject.name === 'chambre1') {
        positionVec.set(-0.6, -0.3, 0)
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
        if (props.zoom) props.setScene2D('kitchen')
      },
    })

    props.timeline.add(cameraPosition, 0)
  }, [props.zoom])

  return (
    <>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline
          selection={outlineObject}
          edgeStrength={10.0}
          visibleEdgeColor={0xffff00}
          hiddenEdgeColor={0x101010}
          blur={true}
          kernelSize={KernelSize.SMALL}
        />
      </EffectComposer>
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
