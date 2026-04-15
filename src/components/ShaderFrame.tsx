"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Shared velocity proxy — one ScrollTrigger drives all frames ── */
const velocityProxy = { v: 0, s: 0 };
const clampVel = gsap.utils.clamp(-2000, 2000);
let stCreated = false;

function ensureVelocityST() {
  if (stCreated) return;
  stCreated = true;

  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate(self) {
      const raw = clampVel(self.getVelocity());
      const norm = raw / 1000;
      const strength = Math.min(1, Math.abs(norm));

      if (Math.abs(strength) > Math.abs(velocityProxy.s)) {
        velocityProxy.v = norm;
        velocityProxy.s = strength;
        gsap.to(velocityProxy, {
          v: 0,
          s: 0,
          duration: 0.8,
          ease: "sine.inOut",
          overwrite: true,
        });
      }
    },
  });
}

/* ── Shaders ── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vUvCover;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;

  void main() {
    vUv = uv;
    float texR = uTextureSize.x / uTextureSize.y;
    float quadR = uQuadSize.x / uQuadSize.y;
    vec2 s = vec2(1.0);
    if (quadR > texR) { s.y = texR / quadR; } else { s.x = quadR / texR; }
    vUvCover = vUv * s + (1.0 - s) * 0.5;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uTextureSize;
  uniform vec2 uQuadSize;
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uVelocityStrength;

  varying vec2 vUv;
  varying vec2 vUvCover;

  void main() {
    vec2 texCoords = vUvCover;

    float amt = 0.03 * uVelocityStrength;

    float t = uTime * 0.8;
    texCoords.y += sin((texCoords.x * 8.0) + t) * amt;
    texCoords.x += cos((texCoords.y * 6.0) - t * 0.8) * amt * 0.6;

    float dir = sign(uScrollVelocity);
    vec2 tc = texCoords;

    float r = texture2D(uTexture, tc + vec2( amt * 0.50 * dir, 0.0)).r;
    float g = texture2D(uTexture, tc + vec2( amt * 0.25 * dir, 0.0)).g;
    float b = texture2D(uTexture, tc + vec2(-amt * 0.35 * dir, 0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

/* ── Component ── */
export default function ShaderFrame({
  src,
  alt,
  style,
  className,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    ensureVelocityST();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    el.appendChild(renderer.domElement);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Style the canvas to fill the container
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geom = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uTextureSize: { value: new THREE.Vector2(1, 1) },
      uQuadSize: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uVelocityStrength: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTexture.value = tex;
      uniforms.uTextureSize.value.set(tex.image.width, tex.image.height);
      layout();
    });

    function layout() {
      const { width, height } = el!.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      uniforms.uQuadSize.value.set(width, height);
    }

    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) * 0.001;
      last = now;
      uniforms.uTime.value += dt;
      uniforms.uScrollVelocity.value = velocityProxy.v;
      uniforms.uVelocityStrength.value = velocityProxy.s;
      renderer.render(scene, camera);
    }

    gsap.ticker.add(tick);
    window.addEventListener("resize", layout);

    cleanupRef.current = () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", layout);
      renderer.dispose();
      mat.dispose();
      geom.dispose();
      if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };

    return () => {
      cleanupRef.current?.();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      aria-label={alt}
    />
  );
}
