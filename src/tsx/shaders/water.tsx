// @ts-ignore
import glsl from 'glslify'
import * as THREE from 'three'
// import { extendMaterial } from '../../lib/ExtendMaterial.module.js'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber'
// @ts-ignore
import { patchShaders } from 'gl-noise/build/glNoise.m'

export function WaterMaterialDom (props: JSX.IntrinsicElements['meshPhysicalMaterial']) {
    const ref = useRef<THREE.ShaderMaterial>();

    useFrame((state, delta) => {
        if (ref.current) {
            // ref.current.uniforms.uTime.value += delta;
            ref.current.uniforms.uTime.value = -state.clock.elapsedTime / 20;
        }
    })

    return (<CustomShaderMaterial 
        ref={ref}
        {...props}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={patchShaders(`
            uniform float uTime;
            varying float vHeight;

            vec3 displace(vec3 point) {
                vec3 p = point;
                float uHeight = 0.2;

                p.z += uTime * 2.0;

                gln_tFBMOpts fbmOpts = gln_tFBMOpts(1.0, 0.4, 2.3, 0.4, 1.0, 5, false, false);

                gln_tGerstnerWaveOpts A = gln_tGerstnerWaveOpts(vec2(0.0, -1.0), 0.5, 2.0);
                gln_tGerstnerWaveOpts B = gln_tGerstnerWaveOpts(vec2(0.0, 1.0), 0.25, 4.0);
                gln_tGerstnerWaveOpts C = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.15, 6.0);
                gln_tGerstnerWaveOpts D = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.4, 2.0);

                vec3 n = vec3(0.0);

                if(p.y >= uHeight / 2.0) {
                    n.y += gln_normalize(gln_pfbm(p.xz + (uTime * 0.5), fbmOpts));
                    n += gln_GerstnerWave(p, A, uTime).xyz;
                    n += gln_GerstnerWave(p, B, uTime).xyz * 0.5;
                    n += gln_GerstnerWave(p, C, uTime).xyz * 0.25;
                    n += gln_GerstnerWave(p, D, uTime).xyz * 0.2;
                }

                vHeight = n.y;

                return point + n;
            }  

            // vec3 orthogonal(vec3 v) {
            //     return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
            //     : vec3(0.0, -v.z, v.y));
            // }

            vec3 orthogonal(vec3 v) {
                return normalize(abs(v.x) > abs(v.y) ? vec3(-v.z, 0.0, v.x)
                : vec3(0.0, -v.z, v.y));
            }
              
            vec3 recalcNormals(vec3 newPos) {
                float offset = 0.001;
                vec3 tangent = orthogonal(normal);
                vec3 bitangent = normalize(cross(normal, tangent));
                vec3 neighbour1 = position + tangent * offset;
                vec3 neighbour2 = position + bitangent * offset;
              
                vec3 displacedNeighbour1 = displace(neighbour1);
                vec3 displacedNeighbour2 = displace(neighbour2);
              
                vec3 displacedTangent = displacedNeighbour1 - newPos;
                vec3 displacedBitangent = displacedNeighbour2 - newPos;
              
                return normalize(cross(displacedTangent, displacedBitangent));
            }

            void main() {
                csm_Position = displace(position);
                csm_Normal = recalcNormals(csm_Position);
            }
        `)}
        fragmentShader={`
           
        `}
        // vertexShader={`
        //     uniform float uTime;

        //     vec3 displace(vec3 point) {
        //         float waveLength = 1.0;
        //         float waveHeight = 0.2;
        //         float freq = 1.0;
        //         float theta = sin(1.0 / waveLength * (point.x + freq * uTime)) * waveHeight;
        //         vec3 p = point;
        //         p.y += theta;
        //         return p;
        //     }  

        //     vec3 orthogonal(vec3 v) {
        //         return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        //         : vec3(0.0, -v.z, v.y));
        //     }

        //     vec3 recalcNormals(vec3 newPos) {
        //         float offset = 0.001;
        //         vec3 tangent = orthogonal(normal);
        //         vec3 bitangent = normalize(cross(normal, tangent));
        //         vec3 neighbour1 = position + tangent * offset;
        //         vec3 neighbour2 = position + bitangent * offset;
                
        //         vec3 displacedNeighbour1 = displace(neighbour1);
        //         vec3 displacedNeighbour2 = displace(neighbour2);
                
        //         vec3 displacedTangent = displacedNeighbour1 - newPos;
        //         vec3 displacedBitangent = displacedNeighbour2 - newPos;
                
        //         return normalize(cross(displacedTangent, displacedBitangent));
        //     }

        //     void main() {
        //         csm_Position = displace(position);
        //         csm_Normal = recalcNormals(csm_Position);
        //     }
        // `}
        uniforms={{
            uTime: {
                value: 0
            }
        }}
        roughness={0}
        // wireframe={true}
        transmission={1}
        thickness={0}
        color={0xcccccc}
        side={THREE.DoubleSide}
    />)
} 

// export const WaterMaterial = extendMaterial(THREE.MeshStandardMaterial, {
//     header: `
//         uniform float time;
//     `,
//     vertex: {
//         'transformEnd': `
//             float theta = sin( time + position.x) / 5.0;
//             // float c = cos( theta );
//             // float s = sin( theta );
//             // mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
//             // transformed = vec3( position ) * m;
//             transformed.y += theta;
//             // vNormal = vNormal * m;
//         `
//     },
//     //  transformed.y += 0.1 * sin(time) * (transformed.x);
//     uniforms: {
//         time: { value: 0 },
//         opacity: 0.5,
//         transparent: true,
//         roughness: 0,
//         metalness: 0.5,
//         side: THREE.FrontSide,
//         envMap: null
//     }
// })

// export function composeMaterial () {
//     const material = new THREE.MeshPhysicalMaterial();
//     material.onBeforeCompile = function ( shader ) {

//         shader.uniforms.time = { value: 0 };

//         shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
//         shader.vertexShader = shader.vertexShader.replace(
//             '#include <begin_vertex>',
//             [
//                 `float theta = sin( time + position.y ) / 10.0;`,
//                 'float c = cos( theta );',
//                 'float s = sin( theta );',
//                 'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
//                 'vec3 transformed = vec3( position ) * m;',
//                 'vNormal = vNormal * m;'
//             ].join( '\n' )
//         );

//         material.userData.shader = shader;

//     };

//     return material;
// }

// export const WaterMaterialTemp = new THREE.ShaderMaterial({
//   uniforms: { 
//       time: { value: 0 }, 
//   },
//   // vertex shader
//   vertexShader: glsl`
//     uniform float time;
//     varying vec2 vUv;

//     void main() {
//       vUv = uv;

//       vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
//       float range = 0.04 * sin(time + modelPosition.x + modelPosition.z) * pow((1.0 + position.y), 2.0);
//       vec3 newPosition = vec3(position.x, position.y + range, position.z);

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//     }
//   `,
//   // fragment shader
//   fragmentShader: glsl`
//     uniform float time;
//     varying vec2 vUv;

//     void main() {
//       gl_FragColor = vec4(1.0);
//     }
//   `
// })
