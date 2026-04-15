"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 iResolution;
  uniform float iTime;
  uniform float uSpeed;
  uniform float uScaleX;
  uniform float uScaleY;
  uniform float uColorOffset;
  uniform float uIterLimit;
  uniform float uRoundness;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  out vec4 fragColor;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void mainImage(out vec4 O, vec2 I) {
    float i = 0.0, z = 0.0, d = 0.0;
    O = vec4(0.0);

    for(O *= i; i++ < uIterLimit;) {
      vec3 p = z * normalize(vec3(I + I, 0.0) - iResolution.xyy);
      vec3 v;

      p.x += sin(p.x + iTime * uSpeed * 0.5) + cos(p.y + iTime * uSpeed * 0.3);
      p.y += cos(p.x - iTime * uSpeed * 0.4) + sin(p.y + iTime * uSpeed * 0.6);
      p.z += sin(iTime * uSpeed * 0.2) * 1.5;

      p.x *= uScaleX;
      p.y *= uScaleY;

      v = cos(p) - sin(p).yzx;

      vec3 shape = mix(max(v, v.yzx * 0.2), v, uRoundness);
      z += d = 1e-4 + 0.5 * length(shape);

      vec3 weights = abs(cos(p));
      weights /= dot(weights, vec3(1.0));

      vec3 customColor = uColor1 * weights.x + uColor2 * weights.y + uColor3 * weights.z;
      O.rgb += (customColor * uColorOffset) / d;
    }

    O /= O + 300.0;

    float luminance = dot(O.rgb, vec3(0.299, 0.587, 0.114));
    O.rgb = mix(vec3(luminance), O.rgb, 1.6);

    O.rgb += (random(I) - 0.5) / 128.0;
    O.a = 1.0;
  }

  void main() {
    mainImage(fragColor, gl_FragCoord.xy);
  }
`;

export default function NebulaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const pixelScale = Math.min(window.devicePixelRatio || 1, 0.7);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    const rect = el.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(pixelScale);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
    el.appendChild(renderer.domElement);

    // Anika Labs colors: deep orange, dark navy, warm amber
    const uniforms = {
      iTime: { value: 0.0 },
      iResolution: { value: new THREE.Vector3(rect.width * pixelScale, rect.height * pixelScale, 1.0) },
      uSpeed: { value: 0.4 },
      uScaleX: { value: 0.1 },
      uScaleY: { value: 2.0 },
      uColorOffset: { value: 3.585 },
      uIterLimit: { value: 10.0 },
      uRoundness: { value: 0.889 },
      uColor1: { value: new THREE.Color("#9e30a6") },
      uColor2: { value: new THREE.Color("#260877") },
      uColor3: { value: new THREE.Color("#0b14fe") },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      glslVersion: THREE.GLSL3,
      depthWrite: false,
      depthTest: false,
    });

    const geo = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geo, mat);
    scene.add(quad);

    const clock = new THREE.Clock();
    let raf: number;

    function tick() {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function onResize() {
      const r = el!.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      uniforms.iResolution.value.set(r.width * pixelScale, r.height * pixelScale, 1.0);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mat.dispose();
      geo.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 1,
      }}
    />
  );
}
