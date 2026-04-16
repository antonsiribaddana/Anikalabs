"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SoftWaveBlock({ color = "#a98bff" }: { color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // Soft curved plane — subdivided for smooth curvature
    const geometry = new THREE.PlaneGeometry(2.6, 2.6, 64, 64);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const basePositions = new Float32Array(pos.array.length);
    basePositions.set(pos.array);

    // Apply a gentle curve bend
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Curved surface — bends forward with a soft wave
      const z =
        Math.sin(x * 0.9) * 0.25 +
        Math.cos(y * 0.7) * 0.18 -
        (x * x + y * y) * 0.05;
      pos.setZ(i, z);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.3;
    mesh.rotation.y = 0.45;
    mesh.position.x = 0.3;
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 3, 2);
    scene.add(dir);

    container.appendChild(renderer.domElement);
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const baseRotX = mesh.rotation.x;
    const baseRotY = mesh.rotation.y;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // Very subtle motion — almost still
      mesh.rotation.x = baseRotX + Math.sin(t * 0.25) * 0.04;
      mesh.rotation.y = baseRotY + Math.cos(t * 0.2) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
