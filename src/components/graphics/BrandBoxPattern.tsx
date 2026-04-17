"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Brand card background — water-ripple WebGL shader.
 * Concentric radial ripples emitted from a moving source, layered over a
 * purple palette that matches the Brand card (#5d4bf0 → #3f2fc7).
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

  // Cheap hash for noise-jittered ripple centers
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Ripple pattern — each source emits concentric rings traveling outward.
  float ripple(vec2 p, vec2 src, float t, float speed, float freq) {
    float d = distance(p, src);
    // Outgoing wave — phase moves outward over time, amplitude decays with distance
    float phase = d * freq - t * speed;
    float amp = exp(-d * 2.2);
    return sin(phase) * amp;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv;
    // Aspect correct
    p.x *= uResolution.x / uResolution.y;

    float t = uTime;

    // Three moving ripple sources — slow parametric drift so the pattern never loops obviously
    vec2 s1 = vec2(0.35 + 0.12 * sin(t * 0.27), 0.42 + 0.09 * cos(t * 0.31));
    vec2 s2 = vec2(0.72 + 0.10 * sin(t * 0.19 + 1.7), 0.58 + 0.11 * cos(t * 0.23 + 0.8));
    vec2 s3 = vec2(0.50 + 0.18 * sin(t * 0.13 + 3.2), 0.80 + 0.07 * cos(t * 0.35 + 2.1));
    s1.x *= uResolution.x / uResolution.y;
    s2.x *= uResolution.x / uResolution.y;
    s3.x *= uResolution.x / uResolution.y;

    float w = 0.0;
    w += ripple(p, s1, t, 2.4, 42.0);
    w += ripple(p, s2, t, 2.1, 38.0) * 0.9;
    w += ripple(p, s3, t, 2.7, 46.0) * 0.85;
    w *= 0.5;

    // Brand card palette
    vec3 deep = vec3(0.247, 0.184, 0.780); // #3f2fc7
    vec3 mid  = vec3(0.365, 0.294, 0.941); // #5d4bf0
    vec3 soft = vec3(0.745, 0.690, 1.000); // lavender

    // Base gradient across the canvas
    vec3 base = mix(deep, mid, smoothstep(0.0, 1.0, uv.y));

    // Very subtle wave shading on top of the base — not the dominant signal
    vec3 col = base;
    col = mix(col, soft, smoothstep(-0.05, 0.4, w) * 0.18);
    col = mix(col, deep, smoothstep(0.1, -0.35, w) * 0.18);

    // Tiny crest highlight (was 0.45)
    float crest = smoothstep(0.22, 0.38, w);
    col += vec3(1.0, 0.95, 1.0) * crest * 0.08;

    // Edge vignette
    vec2 cv = vUv - 0.5;
    float vig = smoothstep(0.85, 0.4, length(cv));
    col = mix(deep, col, vig);

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

export default function BrandBoxPattern() {
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
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
