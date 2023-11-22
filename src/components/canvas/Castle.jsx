'use client'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

//Castle model
export const Castle = (props) => {
  const castleRef = useRef()
  const ghostMesh = useRef()
  const { scene } = useGLTF('/castle_light.glb')
  const [outlineObject, setOutlineObject] = useState(null)
  const [selectedObject, setSelectedObject] = useState(null)
  const [zoom, setZoom] = useState(false)
  const positionVec = new THREE.Vector3()
  const lookatVec = new THREE.Vector3()
  const lookAtQuat = new THREE.Quaternion()

  const handleHover = (e) => {
    if (e.object.name === 'chambre1' || e.object.name === 'cuisine1') {
      setOutlineObject(e.object)
    }
  }

  const handleNonHover = () => {
    setOutlineObject(null)
  }

  const zoomToView = (focusRef) => {
    if (props.scene2D.display) return

    if (focusRef.object.name === 'chambre1' || focusRef.object.name === 'cuisine1') {
      setZoom(true)
      setSelectedObject(focusRef.object)
      props.setRotation(false)
      displayScene2D(focusRef)
      props.setScene2D({ name: '', display: true })
    } else {
      setZoom(false)
      setSelectedObject(null)
      props.setRotation(true)
      props.setScene2D({ name: '', display: false })
    }
  }

  useFrame((state) => {
    const step = 0.05

    if (zoom) {
      if (selectedObject.name === 'chambre1') {
        positionVec.set(-0.5, 1, 3)
        lookatVec.set(-0.5, 0.5, -3.2)
      } else {
        positionVec.set(0.7, 1, 3)
        lookatVec.set(0.7, 0.5, -3.2)
      }
    } else {
      positionVec.set(0, 0, 7)
      lookatVec.set(0, 0, 0)
    }

    state.camera.position.lerp(positionVec, step)
    ghostMesh.current.position.lerp(lookatVec, step)

    lookAtQuat.set(lookatVec.x, lookatVec.y, lookatVec.z, 1)

    state.camera.lookAt(ghostMesh.current.position.x, ghostMesh.current.position.y, ghostMesh.current.position.z)
  })

  useEffect(() => {
    scene.translateX(-2)

    if (selectedObject) {
      scene.rotation.set([0, 0, 0])
    }
  }, [])

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
        onPointerMissed={() => setZoom(false)}
      />
      <mesh ref={ghostMesh} />
    </>
  )
}
