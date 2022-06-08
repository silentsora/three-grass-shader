/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import modelUrl from './model.glb'

type GLTFResult = GLTF & {
  nodes: {
    平面: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(modelUrl) as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.平面.geometry} material={materials.Material} scale={10} />
    </group>
  )
}

useGLTF.preload(modelUrl)