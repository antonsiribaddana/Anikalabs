"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FractalSingularity() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.015);

    // Camera
    const rect = el.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 1000);
    camera.position.set(0, 10, 50);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
    el.appendChild(renderer.domElement);

    // Circle texture for particles
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx2d = canvas.getContext("2d")!;
    const gradient = ctx2d.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.8, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx2d.fillStyle = gradient;
    ctx2d.fillRect(0, 0, 64, 64);
    const circleTexture = new THREE.CanvasTexture(canvas);

    // Geometry + Material
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.05,
      sizeAttenuation: true,
      map: circleTexture,
      alphaTest: 0.01,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.y = 5;
    scene.add(particles);

    // Generate Nose-Hoover Braid fractal (ODE)
    const pointsCount = 270000;
    const aParam = 0.1, dt = 0.001;
    const rawPositions: number[] = [];

    let x = 1.0, y = 0.0, z = 0.0;
    for (let i = 0; i < pointsCount; i++) {
      const dx = y;
      const dy = -x + y * z;
      const dz = aParam - y * y;
      x += dx * dt; y += dy * dt; z += dz * dt;
      if (isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
      rawPositions.push(x, y, z);
    }

    // Center and scale
    const centroid = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < rawPositions.length; i += 3) {
      centroid.x += rawPositions[i];
      centroid.y += rawPositions[i + 1];
      centroid.z += rawPositions[i + 2];
    }
    centroid.divideScalar(pointsCount);

    let maxDist = 0;
    for (let i = 0; i < rawPositions.length; i += 3) {
      const ddx = rawPositions[i] - centroid.x;
      const ddy = rawPositions[i + 1] - centroid.y;
      const ddz = rawPositions[i + 2] - centroid.z;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
      if (dist > maxDist) maxDist = dist;
    }
    const scaleFactor = 15.0 / (maxDist || 1.0);

    // Alignment rotation (alignX=0.44, alignY=0.13)
    const alignMatrix = new THREE.Matrix4().makeRotationFromEuler(
      new THREE.Euler(0.44, 0.13, 0, "XYZ")
    );
    const m = alignMatrix.elements;

    // Colors: Crystalline Spire palette
    const c1 = new THREE.Color("#7616c5"); // core
    const c2 = new THREE.Color("#7251f5"); // mid
    const c3 = new THREE.Color("#fe8a06"); // edge

    const positions = new Float32Array(rawPositions.length);
    const colors: number[] = [];

    for (let i = 0; i < rawPositions.length; i += 3) {
      const bx = (rawPositions[i] - centroid.x) * scaleFactor;
      const by = (rawPositions[i + 1] - centroid.y) * scaleFactor;
      const bz = (rawPositions[i + 2] - centroid.z) * scaleFactor;

      // Apply alignment rotation
      positions[i] = m[0] * bx + m[4] * by + m[8] * bz;
      positions[i + 1] = m[1] * bx + m[5] * by + m[9] * bz;
      positions[i + 2] = m[2] * bx + m[6] * by + m[10] * bz;

      const distNorm = Math.sqrt(bx * bx + by * by + bz * bz) / 15.0;
      const timeNorm = (i / 3) / pointsCount;
      let t = distNorm * 0.4 + timeNorm * 0.6;
      t = Math.max(0, Math.min(1, t));

      const col = new THREE.Color();
      if (t < 0.5) {
        col.copy(c1).lerp(c2, t * 2.0);
      } else {
        col.copy(c2).lerp(c3, (t - 0.5) * 2.0);
      }
      colors.push(col.r, col.g, col.b);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    // Animation (rotationSpeedX=-0.009, rotationSpeedY=-0.03)
    let raf: number;
    function animate() {
      raf = requestAnimationFrame(animate);
      particles.rotation.y += -0.009;
      particles.rotation.x += -0.03;
      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function onResize() {
      const r = el!.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
      circleTexture.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "-5%",
        right: "3%",
        width: "42%",
        height: "45%",
        pointerEvents: "none",
        zIndex: 3,
        overflow: "hidden",
      }}
    />
  );
}
