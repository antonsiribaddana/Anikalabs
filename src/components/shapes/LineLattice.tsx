"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LineLattice({ color = "#ffffff" }: { color?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.LineBasicMaterial[] = [];

    const radius = 1.6;
    const segments = 180;
    const baseColor = new THREE.Color(color);

    // Longitudinal rings (meridians) — tilted around Y axis
    const meridianCount = 24;
    for (let r = 0; r < meridianCount; r++) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.55,
      });
      const line = new THREE.Line(geom, mat);
      line.rotation.y = (r / meridianCount) * Math.PI;
      group.add(line);
      geometries.push(geom);
      materials.push(mat);
    }

    // Latitudinal rings (parallels) — horizontal circles at different heights
    const parallelCount = 12;
    for (let p = 1; p < parallelCount; p++) {
      const t = p / parallelCount;
      const y = (t - 0.5) * 2 * radius;
      const ringR = Math.sqrt(Math.max(0, radius * radius - y * y));
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * ringR, y, Math.sin(a) * ringR));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.4,
      });
      group.add(new THREE.Line(geom, mat));
      geometries.push(geom);
      materials.push(mat);
    }

    group.rotation.x = 0.25;
    scene.add(group);

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += 0.0035;
      group.rotation.x = 0.25 + Math.sin(t * 0.25) * 0.1;

      // Subtle opacity pulse for depth — fade lines based on facing angle
      const camDir = new THREE.Vector3();
      camera.getWorldDirection(camDir);
      group.children.forEach((child) => {
        const line = child as THREE.Line;
        const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(line.getWorldQuaternion(new THREE.Quaternion()));
        const dot = Math.abs(normal.dot(camDir));
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.25 + dot * 0.55;
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [color]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    />
  );
}
