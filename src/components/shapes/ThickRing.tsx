"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThickRing({ color = "#b89cff" }: { color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // Chunky thick ring
    const geometry = new THREE.TorusGeometry(1.3, 0.55, 48, 128);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.85,
      metalness: 0.0,
      transparent: true,
      opacity: 0.92,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Position so part of it is cropped on the right edge
    mesh.position.x = 1.4;
    mesh.position.y = -0.1;
    mesh.rotation.x = 0.4;
    mesh.rotation.y = -0.3;
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(-2, 2, 3);
    scene.add(dir);

    container.appendChild(renderer.domElement);
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const baseY = mesh.position.y;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.position.y = baseY + Math.sin(t * 0.5) * 0.12;
      mesh.rotation.z = Math.sin(t * 0.3) * 0.08;
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
