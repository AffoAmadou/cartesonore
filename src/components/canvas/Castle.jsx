'use client'
import { useGLTF } from '@react-three/drei'
import { EffectComposer, Outline } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { useState } from 'react'

//Castle model
export function Castle(props) {
  const { scene } = useGLTF('/castle.glb')
  const [selectedObject, setSelectedObject] = useState([]);

  const handleHover = (e) => {
    if (e.object.name === "interaction1" || e.object.name === "interaction002") {
      setSelectedObject([...selectedObject, e.object])
    }
  }

  const handleNonHover = () => {
    setSelectedObject([])
  }

  const zoomInteraction = (e) => {

  }

  const displayMiniScene = () => {

  }

  const handleClick = (e) => {
    zoomInteraction(e)
  }
  
  return (
    <>
      <EffectComposer multisampling={8} autoClear={false}>
        <Outline 
          selection={selectedObject}
          edgeStrength={10.0} 
          visibleEdgeColor={0xffff00}
          hiddenEdgeColor={0x101010}
          blur={true}
          kernelSize={KernelSize.SMALL}
        />

      </EffectComposer>
      <primitive object={scene} {...props} onPointerOver={(e) => handleHover(e)} onPointerOut={handleNonHover} onClick={(e) => {handleClick(e)}} />
    </>
  )
}