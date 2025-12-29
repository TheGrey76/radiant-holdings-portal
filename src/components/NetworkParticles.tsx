import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

function ParticleField({ count = 200 }: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate random positions for particles
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      // Random velocities for organic movement
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    
    return { positions, velocities };
  }, [count]);

  // Create line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * count * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const positionAttr = ref.current.geometry.attributes.position;
    const posArray = positionAttr.array as Float32Array;
    
    // Animate particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Add subtle wave motion
      posArray[i3] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.001;
      posArray[i3 + 1] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.001;
      
      // Boundary check - wrap around
      const dist = Math.sqrt(posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2);
      if (dist > 6) {
        const scale = 3 / dist;
        posArray[i3] *= scale;
        posArray[i3 + 1] *= scale;
        posArray[i3 + 2] *= scale;
      }
    }
    
    positionAttr.needsUpdate = true;

    // Update connection lines
    if (linesRef.current) {
      const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
      let lineIndex = 0;
      const maxDistance = 1.5;
      
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (dist < maxDistance && lineIndex < linePositions.length - 6) {
            linePositions[lineIndex++] = posArray[i3];
            linePositions[lineIndex++] = posArray[i3 + 1];
            linePositions[lineIndex++] = posArray[i3 + 2];
            linePositions[lineIndex++] = posArray[j3];
            linePositions[lineIndex++] = posArray[j3 + 1];
            linePositions[lineIndex++] = posArray[j3 + 2];
          }
        }
      }
      
      // Clear remaining lines
      for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }
      
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Slow rotation
    ref.current.rotation.y += 0.0005;
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f97316"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#f97316"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function NetworkParticles() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <ParticleField count={150} />
      </Canvas>
    </div>
  );
}
