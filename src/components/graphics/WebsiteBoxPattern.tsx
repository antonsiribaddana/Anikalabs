"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Websites box background — WebGL fragment shader.
 * Continuous flowing domain-warped noise, warm-tinted to read as texture on the orange card.
 * Always smooth: GPU animated, no DOM layout thrash.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Hash + value noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // Aspect-correct
    vec2 p = uv;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.12;

    // Domain warping — fluid-like flow
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t * 0.8)));
    vec2 r = vec2(
      fbm(p + q * 1.8 + vec2(1.7 + t * 0.6, 9.2)),
      fbm(p + q * 1.8 + vec2(8.3 - t * 0.4, 2.8))
    );
    float f = fbm(p + r * 2.2);

    // Warm palette — cream -> peach -> deep orange
    vec3 cream = vec3(1.0, 0.945, 0.866);
    vec3 peach = vec3(1.0, 0.78, 0.55);
    vec3 orange = vec3(0.91, 0.36, 0.18);

    vec3 col = mix(orange, peach, smoothstep(0.15, 0.55, f));
    col = mix(col, cream, smoothstep(0.45, 0.8, f + 0.2 * r.x));

    // Brighter highlight bands from the warp vector
    float band = smoothstep(0.3, 0.6, length(r));
    col += vec3(1.0, 0.92, 0.8) * band * 0.35;

    // Secondary specular-style highlight on the crests
    float crest = smoothstep(0.72, 0.95, f);
    col += vec3(1.0, 0.96, 0.88) * crest * 0.4;

    // Lighter edge vignette so the pattern stays visible near the corners
    vec2 cv = vUv - 0.5;
    float vig = smoothstep(0.85, 0.45, length(cv));
    col = mix(orange, col, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame(({ clock, size }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function WebsiteBoxPattern() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Canvas
        orthographic
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
