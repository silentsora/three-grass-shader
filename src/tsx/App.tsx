import { useState, useEffect, useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import type { Camera } from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Instances, OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei';
import { Perf } from 'r3f-perf'

import { GrassMaterial, InstancedGrassMaterial } from './shaders/grass'
import { WaterMaterialDom } from './shaders/water'
// import grassTexUrl from '../img/tex/grass.png';
// @ts-ignore
import grassTexUrl from '../img/tex/mc_grass.png';
// @ts-ignore
import meadowTexUrl from '../img/tex/mc_meadow.jpg';
// @ts-ignore
import skyTexUrl from '../img/skybox/rural_landscape_4k.jpg';

const planeBufferGeometry = new THREE.PlaneBufferGeometry(1, 1);

function Plane (props: JSX.IntrinsicElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!)

    return (
        <mesh
            {...props}
            ref={ref}
            geometry={planeBufferGeometry}
        >
            {/* <planeBufferGeometry args={[1, 1]} /> */}
        </mesh>
  )
}

function InstancedPlane (props: JSX.IntrinsicElements['instancedMesh']) {
    const ref = useRef<THREE.InstancedMesh>()

    // const num = 6000;
    // const maxDis = 20;

    const num = 10000;
    const maxDis = 100;

    extend({ InstancedGrassMaterial })
    const grassTex = useTexture(grassTexUrl)
    // const [time, useTime] = useState(Math.random() * 10);

    const grassMat = useMemo(() => {
        let mat = InstancedGrassMaterial;
        mat.side = THREE.DoubleSide;
        mat.uniforms.map.value = grassTex;
        // mat.transparent = true;
        // mat.depthTest = false;
        // mat.depthWrite = true;
        // mat.alphaTest = 1;
        return mat
    }, [])

    useFrame((state, delta) => {
        grassMat.uniforms.time.value += delta;
    })

    useEffect(() => {
        if (!ref || !ref.current) return;

        let count = 0;
        const tempObject3d = new THREE.Object3D();
        
        for (let i = 0; i < num; i++) {
            let randomX = (Math.random() - 0.5) * maxDis
            let randomZ = (Math.random() - 0.5) * maxDis

            for (let j = 0; j < 2; j++) {
                let id = count++;

                // let geo = new THREE.InstancedBufferGeometry().copy(planeBufferGeometry)

                tempObject3d.position.set(randomX, 0, randomZ);
                if (j === 1) {
                    tempObject3d.rotation.set(0, Math.PI / 2, 0);
                } else {
                    tempObject3d.rotation.set(0, 0, 0);
                }
                tempObject3d.updateMatrix();
                // // console.log(tempObject3d.matrix)
                ref.current.setMatrixAt(id, tempObject3d.matrix);
                // geo.applyMatrix4(tempObject3d.matrix);
            }
        }
    
        ref.current.instanceMatrix.needsUpdate = true
        console.log('use effect', ref.current);
    })

    const grassMat2 = new THREE.MeshPhongMaterial({
        map: grassTex
    })
    grassMat2.side = THREE.DoubleSide;
    grassMat2.depthTest = false;
    grassMat2.depthWrite = true;
    grassMat2.transparent = true;

    return (
        <instancedMesh
            {...props}
            ref={ref}
            args={[planeBufferGeometry, grassMat, num]}
        >
        </instancedMesh>
  )
}

function Grass () {
    extend({ GrassMaterial })
    const grassTex = useTexture(grassTexUrl)
    // const [time, useTime] = useState(Math.random() * 10);

    const grassMat = useMemo(() => {
        let mat = GrassMaterial;
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
    const num = 500;
    const maxDis = 5;
    for (let i = 0; i < num; i++) {
        let randomX = (Math.random() - 0.5) * maxDis
        let randomZ = (Math.random() - 0.5) * maxDis
        posArray.push(new THREE.Vector3(randomX, 0, randomZ))
        grassArray.push(
            <Suspense fallback={null} key={i}>
                <Plane position={posArray[i]} material={grassMat}/>
                <Plane position={posArray[i]} material={grassMat} rotation={[0, Math.PI/2, 0]} />
            </Suspense>
        )
    }

    return (<group>
        {grassArray}
    </group>)
}

function Ground () {
    const meadowTex = useTexture(meadowTexUrl, (tex) => {
        if (tex instanceof THREE.Texture) {
            let repeat = 80;
            tex.repeat.set(repeat, repeat);
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
        }
    })
    return (
        <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={[1, 1, 1]} side={THREE.DoubleSide} map={meadowTex}/>
            <planeBufferGeometry args={[100, 100]}/>
        </mesh>
    )
}

function Sky () {
    const skyTex = useTexture(skyTexUrl, tex => {
        if (tex instanceof THREE.Texture) {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.encoding = THREE.sRGBEncoding;
        }
    })

    return (<mesh>
        <sphereBufferGeometry args={[50, 32]}/>
        <meshBasicMaterial map={skyTex} side={THREE.BackSide}/>
    </mesh>)
}

function Water () {
    const skyTex = useTexture(skyTexUrl, tex => {
        if (tex instanceof THREE.Texture) {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            tex.encoding = THREE.sRGBEncoding;
        }
    })

    // const matArgs = {
    //     thickness: 1.4,
    //     transmission: 1,
    //     roughness: 0,
    //     envMap: skyTex,
    //     // color: 0xcccccc
    //     // reflectivity: 0.5
    // }

    // const mat: any = composeMaterial();
    // mat.envMap = skyTex;
    // mat.transmission = 1;
    // mat.thickness = 1.4;
    // mat.roughness = 0;

    // useFrame((state, delta) => {
    //     WaterMaterial.uniforms.time.value += delta;
    // })

    // useEffect(() => {
    //     WaterMaterial.transparent = true;
    //     WaterMaterial.envMap = skyTex;
    //     WaterMaterial.color = 0xff0000;
    // })
  
    return (
        // <mesh position={[0, 1, 0]} material={WaterMaterial}>
        <mesh position={[0, -1.0, 0]}>
            {/* <meshPhysicalMaterial {...matArgs} /> */}
            <WaterMaterialDom envMap={skyTex}/>
            <boxGeometry args={[100, 0.5, 100, 500, 1, 500]}/>
        </mesh>
    )
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
                        <hemisphereLight intensity={0.6} color={0xffffff} groundColor={0x888888}/>
                        <directionalLight intensity={1} color={0xffffff} position={[-1, 1, 1]}/>
                        <PerspectiveCamera name="FBO Camera" ref={virtualCamera} position={[0, 0, 5]} />
                        <OrbitControls camera={virtualCamera.current} {...args} />
                        <Suspense fallback={null}>
                            <Sky></Sky>
                            {/* <Grass /> */}
                            <Ground></Ground>
                            <Water></Water>
                            <InstancedPlane />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </div>
    )
}
  
export default App
  