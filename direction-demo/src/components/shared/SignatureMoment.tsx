import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Edges } from '@react-three/drei'
import * as THREE from 'three'

interface SignatureMomentProps {
  theme: 'levantamiento' | 'patrimonio'
}

export default function SignatureMoment({ theme }: SignatureMomentProps) {
  return (
    <div className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      <Canvas
        camera={{ position: [4, 3, 6], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={1.5} damping={0.25}>
            <Scene theme={theme} />
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Etiqueta flotante */}
      <div className="pointer-events-none absolute bottom-6 left-6 md:bottom-10 md:left-10 text-[10px] uppercase tracking-[0.25em] opacity-60">
        {theme === 'levantamiento' ? 'Polígono · volumen edificable' : 'Terreno · desarrollo'}
      </div>
    </div>
  )
}

function Scene({ theme }: { theme: 'levantamiento' | 'patrimonio' }) {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = scroll.offset
    // El polígono se eleva y se subdivide en volumen
    groupRef.current.position.y = -0.5 + t * 2.5
    // Sutil rotación según scroll
    groupRef.current.rotation.y = t * Math.PI * 0.5
  })

  const isLev = theme === 'levantamiento'

  return (
    <group ref={groupRef}>
      <ambientLight intensity={isLev ? 0.9 : 0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={isLev ? 0.4 : 1.2}
        color={isLev ? '#ffffff' : '#fff4d6'}
      />
      <directionalLight
        position={[-5, 4, -3]}
        intensity={isLev ? 0.2 : 0.5}
        color={isLev ? '#a8b5c4' : '#b08d3a'}
      />

      {/* Polígono base (terreno) */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 2.6, 12, 12]} />
        {isLev ? (
          <meshBasicMaterial
            color="#1a2332"
            wireframe
            transparent
            opacity={0.35}
          />
        ) : (
          <meshStandardMaterial
            color="#1f3a2e"
            roughness={0.9}
            metalness={0.1}
          />
        )}
      </mesh>

      {/* Bloque de volumen que crece al hacer scroll */}
      <group position={[0, 0.3, 0]}>
        {/* Edificio principal */}
        <mesh position={[-0.6, 0.2, 0]}>
          <boxGeometry args={[1, 1.2, 0.8]} />
          {isLev ? (
            <meshBasicMaterial color="#1a2332" transparent opacity={0.06} />
          ) : (
            <meshStandardMaterial
              color="#b08d3a"
              roughness={0.35}
              metalness={0.65}
            />
          )}
          <Edges
            color={isLev ? '#1a2332' : '#1f3a2e'}
            linewidth={isLev ? 1 : 1.5}
            threshold={15}
          />
        </mesh>

        {/* Segundo volumen (escalonado) */}
        <mesh position={[0.5, 0.6, 0.2]}>
          <boxGeometry args={[0.7, 1.6, 0.7]} />
          {isLev ? (
            <meshBasicMaterial color="#1a2332" transparent opacity={0.05} />
          ) : (
            <meshStandardMaterial
              color="#3a5547"
              roughness={0.5}
              metalness={0.3}
            />
          )}
          <Edges
            color={isLev ? '#1a2332' : '#1f3a2e'}
            linewidth={isLev ? 1 : 1.5}
            threshold={15}
          />
        </mesh>

        {/* Tercer volumen (casa) */}
        <mesh position={[0.4, -0.3, -0.7]}>
          <boxGeometry args={[1.1, 0.5, 0.9]} />
          {isLev ? (
            <meshBasicMaterial color="#1a2332" transparent opacity={0.04} />
          ) : (
            <meshStandardMaterial
              color="#1f3a2e"
              roughness={0.6}
              metalness={0.2}
            />
          )}
          <Edges
            color={isLev ? '#1a2332' : '#b08d3a'}
            linewidth={isLev ? 1 : 1.5}
            threshold={15}
          />
        </mesh>
      </group>

      {/* Líneas de retícula para levantamiento */}
      {isLev && <GridLines />}
    </group>
  )
}

function GridLines() {
  const lines: JSX.Element[] = []
  for (let i = -3; i <= 3; i++) {
    lines.push(
      <line key={`x-${i}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([-3, -1, i * 0.5, 3, -1, i * 5]),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1a2332" transparent opacity={0.15} />
      </line>
    )
  }
  return <>{lines}</>
}
