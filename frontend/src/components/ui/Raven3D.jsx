import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────────
 * Low-poly raven, built procedurally from Three.js primitives.
 * Monochrome: faceted dark body + thin white wireframe edges, to
 * match the Raven-style black/white aesthetic. No external asset.
 * ────────────────────────────────────────────────────────────── */

const BODY = '#161616';
const EDGE = '#ffffff';

/* A faceted dark mesh with a subtle white wireframe overlay. */
function Faceted({ geometry, edgeOpacity = 0.26, ...props }) {
  return (
    <group {...props}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={BODY} flatShading metalness={0.15} roughness={0.55} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={EDGE} transparent opacity={edgeOpacity} />
      </lineSegments>
    </group>
  );
}

/* Build a swept-back wing as a flat, double-sided low-poly shape. */
function useWingGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.2);
    shape.lineTo(1.7, 0.7);
    shape.lineTo(3.7, 0.42);
    shape.lineTo(3.4, -0.08);
    shape.lineTo(2.0, -0.28);
    shape.lineTo(0.8, -0.6);
    shape.lineTo(0, -0.3);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape, 2);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function useTailGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.18);
    shape.lineTo(-1.6, 0.5);
    shape.lineTo(-1.9, 0);
    shape.lineTo(-1.6, -0.5);
    shape.lineTo(0, -0.18);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape, 2);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Wing({ side, geometry, flapRef }) {
  // side: +1 = right, -1 = left (mirrored)
  return (
    <group ref={flapRef} position={[0.35 * side, 0.1, 0]} rotation={[0, 0, 0]}>
      <group scale={[side, 1, 1]} rotation={[0, 0, side === 1 ? -0.1 : 0.1]}>
        <mesh geometry={geometry} rotation={[Math.PI / 2.05, 0, 0]}>
          <meshStandardMaterial color={BODY} flatShading metalness={0.15} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments rotation={[Math.PI / 2.05, 0, 0]}>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color={EDGE} transparent opacity={0.28} />
        </lineSegments>
      </group>
    </group>
  );
}

function Raven() {
  const root = useRef();
  const leftWing = useRef();
  const rightWing = useRef();

  const bodyGeo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.62, 0);
    g.scale(1.0, 0.78, 1.9); // elongate fore-aft (z = forward)
    return g;
  }, []);
  const headGeo = useMemo(() => new THREE.OctahedronGeometry(0.4, 0), []);
  const beakGeo = useMemo(() => new THREE.ConeGeometry(0.14, 0.62, 4), []);
  const wingGeo = useWingGeometry();
  const tailGeo = useTailGeometry();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (root.current) {
      // gentle bob + sway, plus mouse parallax
      root.current.position.y = Math.sin(t * 0.9) * 0.12;
      root.current.rotation.y = -0.4 + Math.sin(t * 0.25) * 0.25 + state.pointer.x * 0.4;
      root.current.rotation.x = 0.12 + state.pointer.y * -0.25;
      root.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    }
    const flap = Math.sin(t * 2.6) * 0.6 + 0.15;
    if (rightWing.current) rightWing.current.rotation.z = -flap;
    if (leftWing.current) leftWing.current.rotation.z = flap;
  });

  return (
    <group ref={root} scale={1.5}>
      {/* Body */}
      <Faceted geometry={bodyGeo} />

      {/* Head (forward = +z) */}
      <Faceted geometry={headGeo} position={[0, 0.4, 1.2]} edgeOpacity={0.3} />

      {/* Beak */}
      <mesh geometry={beakGeo} position={[0, 0.36, 1.62]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={'#0c0c0c'} flatShading metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Wings */}
      <Wing side={1} geometry={wingGeo} flapRef={rightWing} />
      <Wing side={-1} geometry={wingGeo} flapRef={leftWing} />

      {/* Tail */}
      <group position={[0, 0, -1.1]}>
        <mesh geometry={tailGeo} rotation={[Math.PI / 2.05, 0, 0]}>
          <meshStandardMaterial color={BODY} flatShading metalness={0.15} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments rotation={[Math.PI / 2.05, 0, 0]}>
          <edgesGeometry args={[tailGeo]} />
          <lineBasicMaterial color={EDGE} transparent opacity={0.16} />
        </lineSegments>
      </group>
    </group>
  );
}

export function Raven3D({ className = '' }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0.2, 0.5, 6.4], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Monochrome lighting — key + rim for faceted grayscale */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-5, 2, -4]} intensity={0.9} color="#9aa0aa" />
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#ffffff" />
        <Suspense fallback={null}>
          <Raven />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Raven3D;
