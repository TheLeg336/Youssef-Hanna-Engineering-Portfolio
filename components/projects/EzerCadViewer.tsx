'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface EzerCadViewerProps {
  isPaused?: boolean;
  onUserInteractionChange?: (interacting: boolean) => void;
  filletProgress?: number; // 0 = sharp cube, 1 = filleted with R0.2 in
  showBadges?: boolean;
}

function createCadGeometry(filletProgress: number) {
  const p = Math.max(0, Math.min(1, filletProgress));
  const b = 0.02 + 0.18 * p;
  const s = 1.0 - b;
  const r = p * 0.20;

  const shape = new THREE.Shape();
  if (r <= 0.005) {
    shape.moveTo(-s, -s);
    shape.lineTo(s, -s);
    shape.lineTo(s, s);
    shape.lineTo(-s, s);
    shape.closePath();
  } else {
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s);
    shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r);
    shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s);
    shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r);
    shape.quadraticCurveTo(-s, -s, -s + r, -s);
    shape.closePath();
  }

  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.5 + b, 0, Math.PI * 2, true);
  shape.holes = [hole];

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 2.0 - 2 * b,
    bevelEnabled: true,
    bevelSegments: Math.max(3, Math.round(2 + 8 * p)),
    steps: 1,
    bevelSize: b,
    bevelThickness: b,
  });
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

export function EzerCadViewer({
  isPaused = false,
  onUserInteractionChange,
  filletProgress = 0,
  showBadges = false,
}: EzerCadViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(isPaused);
  const onInteractionChangeRef = useRef(onUserInteractionChange);

  const initialFilletProgressRef = useRef(filletProgress);
  const cadMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const lastPRef = useRef<number>(-1);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    onInteractionChangeRef.current = onUserInteractionChange;
  }, [onUserInteractionChange]);

  // Dynamic geometry update when filletProgress changes
  useEffect(() => {
    const roundedP = Math.round(filletProgress * 30) / 30;
    if (roundedP === lastPRef.current) return;
    lastPRef.current = roundedP;

    if (!cadMeshRef.current || !wireframeRef.current) return;

    const newGeom = createCadGeometry(roundedP);
    const newEdges = new THREE.EdgesGeometry(newGeom, 22);

    const oldGeom = cadMeshRef.current.geometry;
    const oldEdges = wireframeRef.current.geometry;

    cadMeshRef.current.geometry = newGeom;
    wireframeRef.current.geometry = newEdges;

    oldGeom.dispose();
    oldEdges.dispose();
  }, [filletProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.45);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    // Ground Blueprint Grid
    const grid = new THREE.GridHelper(6, 12, 0x94a3b8, 0xcbd5e1);
    grid.position.y = -1.15;
    scene.add(grid);

    // Soft Contact Shadow Receiver plane
    const shadowGeo = new THREE.PlaneGeometry(4, 4);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -1.14;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 2 x 2 x 2 inch Extruded Cube with Ø 1 inch Centered Through-Hole
    const geom = createCadGeometry(initialFilletProgressRef.current);
    lastPRef.current = Math.round(initialFilletProgressRef.current * 50) / 50;

    // Material: Bead-Blasted Aluminum
    const material = new THREE.MeshStandardMaterial({
      color: 0xd9e2ec,
      roughness: 0.28,
      metalness: 0.78,
    });
    const cadMesh = new THREE.Mesh(geom, material);
    cadMesh.castShadow = true;
    cadMesh.receiveShadow = true;
    scene.add(cadMesh);
    cadMeshRef.current = cadMesh;

    // Edge wireframe accent
    const edgesGeom = new THREE.EdgesGeometry(geom, 22);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 });
    const wireframe = new THREE.LineSegments(edgesGeom, lineMaterial);
    cadMesh.add(wireframe);
    wireframeRef.current = wireframe;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 2.4;
    controls.maxDistance = 6.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = !isPausedRef.current;
    controls.autoRotateSpeed = 2.0;

    let resumeTimer: NodeJS.Timeout | null = null;
    let wheelTimer: NodeJS.Timeout | null = null;

    controls.addEventListener('start', () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.autoRotate = false;
      if (onInteractionChangeRef.current) {
        onInteractionChangeRef.current(true);
      }
    });

    controls.addEventListener('end', () => {
      if (onInteractionChangeRef.current) {
        onInteractionChangeRef.current(false);
      }
      if (isPausedRef.current) return;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        if (!isPausedRef.current) {
          controls.autoRotate = true;
        }
      }, 3000);
    });

    // Capture direct clicks / taps on the 3D canvas
    const handlePointerDown = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.autoRotate = false;
      if (onInteractionChangeRef.current) {
        onInteractionChangeRef.current(true);
      }
    };

    const handlePointerUp = () => {
      if (onInteractionChangeRef.current) {
        onInteractionChangeRef.current(false);
      }
    };

    const handleWheel = () => {
      if (resumeTimer) clearTimeout(resumeTimer);
      controls.autoRotate = false;
      if (onInteractionChangeRef.current) {
        onInteractionChangeRef.current(true);
      }
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        if (onInteractionChangeRef.current) {
          onInteractionChangeRef.current(false);
        }
      }, 600);
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isPausedRef.current) {
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    // Resize Handler
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
          renderer.render(scene, camera);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (wheelTimer) clearTimeout(wheelTimer);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      controls.dispose();
      cadMesh.geometry.dispose();
      wireframe.geometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
      cadMeshRef.current = null;
      wireframeRef.current = null;
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const hasFillet = filletProgress > 0.6;

  return (
    <div
      className="relative w-full h-[360px] sm:h-[400px] bg-gradient-to-b from-[#FAFBFD] to-[#EEF2F6] rounded-xl overflow-hidden border border-[#CBD5E1] select-none"
      role="img"
      aria-label="Interactive 3D model of a 2 inch cube with a centered 1 inch diameter through-hole."
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Viewport Badges (hidden by default when parent renders HUD) */}
      {showBadges && (
        <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 z-10">
          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur border border-[#178BFF]/25 text-[10px] font-mono text-[#0864C7] font-semibold flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#178BFF]" />
            SOLID CAD SYNTHESIS · 2&quot; × 2&quot; × 2&quot;
            {hasFillet && <span className="text-[#059669] font-bold">· FILLETED (R0.200&quot;)</span>}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/80 backdrop-blur text-[10px] font-mono text-[#647184] border border-black/5">
            Ø 1.000&quot; Centered Through-Hole {hasFillet && '· R0.200" Hole Edge Fillets'}
          </span>
        </div>
      )}

      <div className="absolute bottom-3 right-3 pointer-events-none z-10 hidden sm:block">
        <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur border border-black/5 text-[10px] font-mono text-[#647184] shadow-xs">
          Drag to Rotate · Scroll to Zoom
        </span>
      </div>
    </div>
  );
}

export default EzerCadViewer;
