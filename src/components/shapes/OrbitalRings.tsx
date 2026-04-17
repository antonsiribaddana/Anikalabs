"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function OrbitalRings({ color = "#ffffff" }: { color?: string }) {
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

    const group = new THREE.Group();
    scene.add(group);

    // 3 thin rings with different radii and tilts
    const ringConfigs = [
      { radius: 1.0, tilt: [0.4, 0.2, 0.0], speed: 0.15, dir: 1, opacity: 0.45 },
      { radius: 1.4, tilt: [0.15, -0.5, 0.2], speed: 0.1, dir: -1, opacity: 0.32 },
      { radius: 1.8, tilt: [-0.3, 0.3, -0.1], speed: 0.07, dir: 1, opacity: 0.2 },
    ];

    const meshes: { mesh: THREE.Mesh; speed: number; dir: number }[] = [];

    ringConfigs.forEach(cfg => {
      const geom = new THREE.TorusGeometry(cfg.radius, 0.008, 12, 200);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: cfg.opacity,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      group.add(mesh);
      meshes.push({ mesh, speed: cfg.speed, dir: cfg.dir });
    });

    container.appendChild(renderer.domElement);
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      meshes.forEach(({ mesh, speed, dir }) => {
        mesh.rotation.y += speed * dir * dt;
        mesh.rotation.x += speed * 0.3 * dir * dt;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      meshes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
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
