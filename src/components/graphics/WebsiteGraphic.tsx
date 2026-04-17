"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Craft pass: give the cards actual dimension.
   - MeshPhysicalMaterial (real lighting, reflections)
   - Extruded geometry with bevel (not flat planes)
   - Proper 3-point lighting (key / fill / rim)
   - Contact-style shadows via shadow map
   - Strong perspective so depth reads instantly
*/

function makeRoundedRectShape(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo( hw - r, -hh);
  shape.quadraticCurveTo( hw, -hh,  hw, -hh + r);
  shape.lineTo( hw,  hh - r);
  shape.quadraticCurveTo( hw,  hh,  hw - r,  hh);
  shape.lineTo(-hw + r,  hh);
  shape.quadraticCurveTo(-hw,  hh, -hw,  hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

function Card({
  w, h,
  position,
  rotation,
  tint,
  phase,
}: {
  w: number; h: number;
  position: [number, number, number];
  rotation: [number, number, number];
  tint: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const r = Math.min(w, h) * 0.07;

  const geom = useMemo(() => {
    const shape = makeRoundedRectShape(w, h, r);
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      curveSegments: 18,
    });
    g.center();
    return g;
  }, [w, h, r]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.35 + phase;
    ref.current.position.x = position[0] + Math.sin(t) * 0.04;
    ref.current.position.y = position[1] + Math.cos(t * 0.9) * 0.03;
    ref.current.rotation.x = rotation[0] + Math.sin(t * 0.7) * 0.02;
    ref.current.rotation.y = rotation[1] + Math.cos(t * 0.6) * 0.025;
    ref.current.rotation.z = rotation[2];
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} geometry={geom} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={tint}
        roughness={0.38}
        metalness={0.05}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        reflectivity={0.4}
        sheen={0.5}
        sheenColor={"#fff1dc"}
        sheenRoughness={0.4}
      />
    </mesh>
  );
}

function Scene() {
  const stack = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!stack.current) return;
    const t = state.clock.elapsedTime;
    stack.current.rotation.y = -0.42 + Math.sin(t * 0.18) * 0.08;
    stack.current.rotation.x =  0.14 + Math.cos(t * 0.14) * 0.04;
  });

  return (
    <>
      {/* Key light — warm, top-right */}
      <directionalLight
        position={[4, 5, 4]}
        intensity={1.8}
        color="#fff3dc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Fill — soft warm, front-left */}
      <directionalLight position={[-3, 1, 3]} intensity={0.6} color="#ffcba0" />
      {/* Rim — behind, punches the silhouette */}
      <directionalLight position={[0, -1, -3]} intensity={1.2} color="#ffa06a" />
      {/* Very low ambient so shadows stay deep */}
      <ambientLight intensity={0.25} color="#ffb892" />

      <group ref={stack}>
        {/* Back card — deepest, warmest undertone */}
        <Card
          w={2.1} h={1.35}
          position={[-0.35, 0.25, -0.6]}
          rotation={[0, 0, -0.04]}
          tint="#f89560"
          phase={0}
        />
        {/* Mid card — primary focal */}
        <Card
          w={1.95} h={1.25}
          position={[0.1, -0.05, 0]}
          rotation={[0, 0, 0.02]}
          tint="#ffb88a"
          phase={1.2}
        />
        {/* Front accent — lightest, most forward */}
        <Card
          w={0.6} h={1.0}
          position={[0.95, -0.2, 0.55]}
          rotation={[0, -0.1, 0.05]}
          tint="#ffdfc2"
          phase={2.4}
        />
      </group>
    </>
  );
}

export default function WebsiteGraphic(_: { color?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        padding: "6% 8%",
        boxSizing: "border-box",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0.4, 0.2, 3.2], fov: 42 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
