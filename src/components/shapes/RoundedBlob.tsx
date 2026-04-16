"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RoundedBlob({ color = "#c9a4ff" }: { color?: string }) {
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

    // Subtly distorted blob
    const geometry = new THREE.IcosahedronGeometry(1.2, 6);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const d =
        Math.sin(n.x * 2.1) * 0.06 +
        Math.cos(n.y * 1.8) * 0.05 +
        Math.sin(n.z * 2.4) * 0.05;
      v.addScaledVector(n, d);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.95,
      metalness: 0.0,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0.4;
    scene.add(mesh);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(2, 2, 3);
    scene.add(dir);

    container.appendChild(renderer.domElement);
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.y = t * 0.12;
      mesh.rotation.x = Math.sin(t * 0.15) * 0.15;
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
