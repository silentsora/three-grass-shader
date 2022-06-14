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
            ref.current.uniforms.uTime.value += delta;
            // ref.current.uniforms.uTime.value = -state.clock.elapsedTime / 20;
        }
    })

    return (<CustomShaderMaterial 
        ref={ref}
        {...props}
        baseMaterial={THREE.MeshPhysicalMaterial}
        // vertexShader={patchShaders(`
        //     uniform float uTime;
        //     varying float vHeight;

        //     vec3 displace(vec3 point) {
        //         vec3 p = point;
        //         float uHeight = 0.2;

        //         p.z += uTime * 2.0;

        //         gln_tFBMOpts fbmOpts = gln_tFBMOpts(1.0, 0.4, 2.3, 0.4, 1.0, 5, false, false);

        //         gln_tGerstnerWaveOpts A = gln_tGerstnerWaveOpts(vec2(0.0, -1.0), 0.5, 2.0);
        //         gln_tGerstnerWaveOpts B = gln_tGerstnerWaveOpts(vec2(0.0, 1.0), 0.25, 4.0);
        //         gln_tGerstnerWaveOpts C = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.15, 6.0);
        //         gln_tGerstnerWaveOpts D = gln_tGerstnerWaveOpts(vec2(1.0, 1.0), 0.4, 2.0);

        //         vec3 n = vec3(0.0);

        //         if(p.y >= uHeight / 2.0) {
        //             n.y += gln_normalize(gln_pfbm(p.xz + (uTime * 0.5), fbmOpts));
        //             n += gln_GerstnerWave(p, A, uTime).xyz;
        //             n += gln_GerstnerWave(p, B, uTime).xyz * 0.5;
        //             n += gln_GerstnerWave(p, C, uTime).xyz * 0.25;
        //             n += gln_GerstnerWave(p, D, uTime).xyz * 0.2;
        //         }

        //         vHeight = n.y;

        //         return point + n;
        //     }  

        //     // vec3 orthogonal(vec3 v) {
        //     //     return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        //     //     : vec3(0.0, -v.z, v.y));
        //     // }

        //     vec3 orthogonal(vec3 v) {
        //         return normalize(abs(v.x) > abs(v.y) ? vec3(-v.z, 0.0, v.x)
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
        // `)}
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
        vertexShader={`
            uniform float uTime;

            vec3 displace (vec3 point, vec2 dir, float waveLen, float steepness) {
                float k = 2.0 * 3.14159 / waveLen;
                float waveHeight = steepness / k;
                float speed = sqrt(9.8 / k);
                float f = k * (dot(dir, point.xz) - speed * uTime);
                
                point.x += dir.x * waveHeight * cos(f);
                point.y += waveHeight * sin(f);
                point.z += dir.y * waveHeight * cos(f);
                return point;
            }

            vec3 calcNormals (vec3 point, vec2 dir, float waveLen, float steepness) {
                float k = 2.0 * 3.14159 / waveLen;
                float waveHeight = steepness / k;
                float speed = sqrt(9.8 / k);
                float f = k * (dot(dir, point.xz) - speed * uTime);

                vec3 tangent = normalize(vec3(
                    1.0 - dir.x * dir.x * steepness * sin(f), 
                    dir.x * steepness * cos(f), 
                    -dir.y * dir.x * steepness * sin(f)
                    ));
                vec3 binormal = normalize(vec3(
                    -dir.x * dir.y * steepness * sin(f), 
                    dir.y * steepness * cos(f), 
                    1.0 - dir.y * dir.y * steepness * sin(f)
                    ));

                vec3 nor = normalize(cross(binormal, tangent));
                return nor;
            }

            void main () {
                vec2 dir = normalize(vec2(0.5, 0.5));
                float waveLen = 5.0;
                float steepness = 0.1;

                csm_Position = displace(position, dir, waveLen, steepness);

                dir = normalize(vec2(0.3, 0.7));
                waveLen = 3.0;
                // steepness = 0.1;
                csm_Position += displace(csm_Position, dir, waveLen, steepness);
                csm_Normal = calcNormals(csm_Position, dir, waveLen, steepness);
            }
        `}
        uniforms={{
            uTime: {
                value: 0
            }
        }}
        roughness={0}
        // wireframe={true}
        transmission={1}
        thickness={0.3}
        // reflectivity={1}
        // transparent={true}
        // opacity={0.8}
        // ior={0.98}
        color={0x99bbcc}
        side={THREE.FrontSide}
    />)
} 
