/**
 * Flyover Camera Animation
 * Animates camera in a cinematic arc around the farm after preset load
 */

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface FlyoverCameraProps {
  active: boolean;
  farmCenter?: [number, number, number];
  farmRadius?: number;
  duration?: number; // seconds
  onComplete?: () => void;
}

export function FlyoverCamera({
  active,
  farmCenter = [0, 0, 0],
  farmRadius = 50,
  duration = 4,
  onComplete,
}: FlyoverCameraProps) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const completedRef = useRef(false);
  
  // Reset when active changes
  useEffect(() => {
    if (active) {
      timeRef.current = 0;
      completedRef.current = false;
    }
  }, [active]);
  
  useFrame((state, delta) => {
    if (!active || completedRef.current) return;
    
    timeRef.current += delta;
    const t = Math.min(timeRef.current / duration, 1);
    
    if (t >= 1) {
      // Animation complete
      completedRef.current = true;
      onComplete?.();
      return;
    }
    
    // Ease in-out cubic
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    // Start position: high bird's eye view
    const startHeight = farmRadius * 2.5;
    const startDist = farmRadius * 1.8;
    
    // End position: comfortable viewing angle
    const endHeight = farmRadius * 0.8;
    const endDist = farmRadius * 1.5;
    
    // Interpolate height and distance
    const height = startHeight + (endHeight - startHeight) * eased;
    const dist = startDist + (endDist - startDist) * eased;
    
    // Rotate 360° around farm
    const angle = eased * Math.PI * 2;
    
    // Position camera
    const x = farmCenter[0] + Math.cos(angle) * dist;
    const z = farmCenter[2] + Math.sin(angle) * dist;
    const y = farmCenter[1] + height;
    
    camera.position.set(x, y, z);
    camera.lookAt(new Vector3(...farmCenter));
  });
  
  return null;
}
