import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import type { Camera } from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf'

import { GrassMaterial, GrassMaterialVanilla } from './shaders/grass'
import grassTexUrl from '../img/tex/grass.png';

function Plane (props: JSX.IntrinsicElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={ref}
        >
            <planeBufferGeometry args={[1, 1]} />
        </mesh>
  )
}

function Grass () {
    extend({ GrassMaterial })
    const grassTex = useTexture(grassTexUrl)
    // const [time, useTime] = useState(Math.random() * 10);

    const grassMat = useMemo(() => {
        let mat = GrassMaterialVanilla;
        mat.side = THREE.DoubleSide;
        mat.uniforms.map.value = grassTex;
        mat.depthTest = false;
        mat.depthWrite = true;
        mat.transparent = true;
        return mat
    }, [])

    useFrame((state, delta) => {
        grassMat.uniforms.time.value += delta;
    })

    const posArray = [];
    const grassArray = [];
    const num = 300;
    const maxDis = 5;
    for (let i = 0; i < num; i++) {
        let randomX = (Math.random() - 0.5) * maxDis
        let randomZ = (Math.random() - 0.5) * maxDis
        posArray.push(new THREE.Vector3(randomX, 0, randomZ))
        grassArray.push(
            <Suspense fallback={null} key={i}>
                {<Plane position={posArray[i]} material={grassMat}/>}
                {<Plane position={posArray[i]} material={grassMat} rotation={[0, Math.PI/2, 0]} />}
            </Suspense>
        )
    }

    return (<group>
        {grassArray}
    </group>)
}

function App() {
    const [count, setCount] = useState(0)
    const virtualCamera = useRef<Camera>()
    const args = {
        enableDamping: true,
        enablePan: true,
        enableRotate: true,
        enableZoom: true,
        reverseOrbit: false,
    }

    return (
        <div className="m-index">
            <div className="m-horizontal">
                <div className="m-wrap">
                    <Canvas className='m-index'>
                        <Perf />
                        <hemisphereLight intensity={1} color={0xffffff} groundColor={0x888888}/>
                        <PerspectiveCamera name="FBO Camera" ref={virtualCamera} position={[0, 0, 5]} />
                        <OrbitControls camera={virtualCamera.current} {...args} />
                        <Suspense fallback={null}>
                            <Grass />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}
  
export default App
  