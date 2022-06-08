import glsl from 'glslify'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'


export const GrassMaterial = shaderMaterial(
    { 
        time: 0, 
        map: null
    },
    // vertex shader
    glsl`
      uniform float time;
      varying vec2 vUv;

      void main() {
        float range = 0.04 * sin(time) * pow((1.0 + position.y), 2.0);
        vUv = uv;
        vec3 newPosition = vec3(position.x + range, position.y, position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    // fragment shader
    glsl`
      uniform float time;
      uniform sampler2D map;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);
        gl_FragColor = color;
      }
    `
  )
  
  export const GrassMaterialVanilla = new THREE.ShaderMaterial({
    uniforms: { 
        time: { value: 0 }, 
        map: { value: null }
    },
    // vertex shader
    vertexShader: glsl`
      uniform float time;
      varying vec2 vUv;

      void main() {
        float range = 0.04 * sin(time) * pow((1.0 + position.y), 2.0);
        vUv = uv;
        vec3 newPosition = vec3(position.x + range, position.y, position.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    // fragment shader
    fragmentShader: glsl`
      uniform float time;
      uniform sampler2D map;
      varying vec2 vUv;

      void main() {
        vec4 color = texture2D(map, vUv);
        gl_FragColor = color;
      }
    `
    })