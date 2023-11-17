'use client'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useRef, useState } from 'react'
import GSAP from 'gsap'
import { useFrame, useThree } from '@react-three/fiber'


//Castle model
export const Castle = (props) => {
  const castleRef = useRef();
  const ghostMesh = useRef();
  const { scene } = useGLTF('/castle_light.glb');
  const [outlineObject, setOutlineObject] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(false);
  const positionVec = new THREE.Vector3();
  const lookatVec = new THREE.Vector3();
  const lookAtQuat = new THREE.Quaternion();
  const [focus, setFocus] = useState(new THREE.Vector3());

  const handleHover = (e) => {
    if (e.object.name === "chambre1" || e.object.name === "cuisine1") {
      setOutlineObject(e.object)
    }
  }

  const handleNonHover = () => {
    setOutlineObject(null)
  }

  const displayMiniScene = () => {

  }

  const zoomToView = (focusRef) => {
    setZoom(!zoom);

    if (focusRef.object.name === "chambre1" || focusRef.object.name === "cuisine1") {
      setSelectedObject(focusRef.object)
    }
  }
  
  useFrame((state) => {
    const step = 0.05

    if (selectedObject) {
        /* zoom
          ? positionVec.set(selectedObject.name === "chambre1" ?   -2 : 3, selectedObject.name === "chambre1" ? 1.5 : 1.5,  1)
          : positionVec.set(0, 0.5, 6);
        zoom
          ? lookatVec.set( selectedObject.name === "chambre1" ?  -1 : 1.5, selectedObject.name === "chambre1" ?  0.5 : 0.5, -1.2)
          : lookatVec.set(0, 0, 0); */

        zoom
          ? positionVec.set(selectedObject.name === "chambre1" ? -0.5 : 0.7, 1, 1)
          : positionVec.set(0, 0.5, 6);
        zoom
          ? lookatVec.set(selectedObject.name === "chambre1" ? -0.5 : 0.7, 0.5, -1.2)
          : lookatVec.set(0, 0, 0);
      
        state.camera.position.lerp(positionVec, step);
        ghostMesh.current.position.lerp(lookatVec, step);

        lookAtQuat.set(lookatVec.x, lookatVec.y, lookatVec.z, 1);

        state.camera.lookAt(
          ghostMesh.current.position.x,
          ghostMesh.current.position.y,
          ghostMesh.current.position.z
        ); 
    }
  })
  

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
      <primitive ref={castleRef} object={scene} {...props} onPointerOver={(e) => handleHover(e)} onPointerOut={handleNonHover} onClick={(e) => { zoomToView(e) }}/>
      <mesh ref={ghostMesh} />
    </>
  )
}