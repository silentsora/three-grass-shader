import glsl from 'glslify'
import * as THREE from 'three'

export const GrassMaterial = new THREE.ShaderMaterial({
  uniforms: { 
      time: { value: 0 }, 
      map: { value: null }
  },
  // vertex shader
  vertexShader: glsl`
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

      float range = 0.04 * sin(time + modelPosition.x + modelPosition.z) * pow((1.0 + position.y), 2.0);
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

export const InstancedGrassMaterial = new THREE.ShaderMaterial({
  uniforms: { 
      time: { value: 0 }, 
      map: { value: null }
  },
  // vertex shader
  vertexShader: glsl`
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec4 modelPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);

      float range = 0.04 * sin(time + modelPosition.x + modelPosition.z) * pow((1.0 + position.y), 2.0);
      vUv = uv;
      vec3 newPosition = vec3(position.x + range, position.y, position.z);
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(newPosition, 1.0);
    }
  `,
  // fragment shader
  fragmentShader: glsl`
    uniform float time;
    uniform sampler2D map;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(map, vUv);
      if ( color.a < 0.5 ) discard; // alpha test to fix depth render problem
      gl_FragColor = vec4(color.rgb, 1.0); 
    }
  `
})