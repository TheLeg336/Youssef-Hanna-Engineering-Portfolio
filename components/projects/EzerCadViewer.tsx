'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface EzerCadViewerProps {
  isPaused?: boolean;
  onUserInteractionChange?: (interacting: boolean) => void;
  filletProgress?: number; // 0 = sharp cube, 1 = filleted with R0.2 in
  highlightEdges?: boolean; // Highlight vertical edges in cyan during refinement
  isWireframeOnly?: boolean; // Wireframe construction phase
  showCallouts?: boolean; // Show refined CAD callouts & result bar
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
  highlightEdges = false,
  isWireframeOnly = false,
  showCallouts = true,
}: EzerCadViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(isPaused);
  const onInteractionChangeRef = useRef(onUserInteractionChange);

  const initialFilletProgressRef = useRef(filletProgress);
  const cadMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const highlightedWireframeRef = useRef<THREE.LineSegments | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial | null>(null);
  const lastPRef = useRef<number>(-1);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    onInteractionChangeRef.current = onUserInteractionChange;
  }, [onUserInteractionChange]);

  // Dynamic geometry update when filletProgress changes
  useEffect(() => {
    const roundedP = Math.round(filletProgress * 50) / 50;
    if (roundedP === lastPRef.current) return;
    lastPRef.current = roundedP;

    if (!cadMeshRef.current || !wireframeRef.current) return;

    const newGeom = createCadGeometry(roundedP);
    const newEdges = new THREE.EdgesGeometry(newGeom, 22);

    const oldGeom = cadMeshRef.current.geometry;
    const oldEdges = wireframeRef.current.geometry;

    cadMeshRef.current.geometry = newGeom;
    wireframeRef.current.geometry = newEdges;

    if (highlightedWireframeRef.current) {
      highlightedWireframeRef.current.geometry = newEdges;
    }

    oldGeom.dispose();
    oldEdges.dispose();
  }, [filletProgress]);

  // Wireframe vs Solid visibility
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.wireframe = isWireframeOnly;
    materialRef.current.opacity = isWireframeOnly ? 0.35 : 1.0;
  }, [isWireframeOnly]);

  // Highlight edges in cyan during refinement
  useEffect(() => {
    if (!lineMatRef.current) return;
    if (highlightEdges) {
      lineMatRef.current.color.setHex(0x22c7f2);
      lineMatRef.current.opacity = 0.95;
    } else {
      lineMatRef.current.color.setHex(0x8fdfff);
      lineMatRef.current.opacity = 0.35;
    }
  }, [highlightEdges]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.9, 2.1, 3.4);

    // Renderer: transparent for seamless integration with dark viewport #0B1220
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Studio Lighting tuned for dark #0B1220 viewport
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    fillLight.position.set(-5, 2, -4);
    scene.add(fillLight);

    const topAccentLight = new THREE.DirectionalLight(0x8fdfff, 0.4);
    topAccentLight.position.set(0, 6, 0);
    scene.add(topAccentLight);

    // Subtle dark ground grid
    const grid = new THREE.GridHelper(6, 12, 0x22c7f2, 0x1e293b);
    grid.position.y = -1.15;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    scene.add(grid);

    // Contact Shadow Receiver plane
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.4 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -1.14;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 2 x 2 x 2 inch Extruded Cube with Ø 1 inch Centered Through-Hole
    const geom = createCadGeometry(initialFilletProgressRef.current);
    lastPRef.current = Math.round(initialFilletProgressRef.current * 50) / 50;

    // Material: Bead-Blasted SolidWorks Aluminum
    const material = new THREE.MeshStandardMaterial({
      color: 0xd0d7de,
      roughness: 0.32,
      metalness: 0.82,
      wireframe: isWireframeOnly,
      transparent: true,
      opacity: isWireframeOnly ? 0.35 : 1.0,
    });
    materialRef.current = material;

    const cadMesh = new THREE.Mesh(geom, material);
    cadMesh.castShadow = true;
    cadMesh.receiveShadow = true;
    scene.add(cadMesh);
    cadMeshRef.current = cadMesh;

    // Edge wireframe accent
    const edgesGeom = new THREE.EdgesGeometry(geom, 22);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: highlightEdges ? 0x22c7f2 : 0x8fdfff,
      transparent: true,
      opacity: highlightEdges ? 0.95 : 0.35,
    });
    lineMatRef.current = lineMaterial;

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
    controls.autoRotateSpeed = 1.0; // ~20 seconds per full revolution

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
      }, 1500);
    });

    // Touch & Pointer handling
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
      highlightedWireframeRef.current = null;
      materialRef.current = null;
      lineMatRef.current = null;
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const hasFillet = filletProgress > 0.6;

  return (
    <div
      className="relative w-full h-full select-none"
      role="img"
      aria-label="Interactive 3D model of a 2 inch cube with a centered 1 inch diameter through-hole in SolidWorks CAD."
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 2–3 Refined CAD Callouts */}
      {showCallouts && (
        <>
          {/* Callout 1: 2.00 in cube */}
          <div className="absolute top-6 left-6 pointer-events-none flex items-center gap-2 z-20">
            <div className="px-2.5 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-md border border-[rgba(143,223,255,0.22)] shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C7F2]" />
              <span className="text-[11px] font-mono font-semibold text-[#E5F0FF] tracking-tight">
                2.00 in cube
              </span>
              {hasFillet && (
                <span className="text-[10px] font-mono font-bold text-[#10B981] ml-1 bg-[#10B981]/15 px-1.5 py-0.2 rounded">
                  R0.200&quot;
                </span>
              )}
            </div>
            <div className="w-6 h-[1px] bg-[#22C7F2]/40 hidden sm:block" />
          </div>

          {/* Callout 2: Ø1.00 in through-hole */}
          <div className="absolute top-16 right-6 sm:right-10 pointer-events-none flex items-center gap-2 z-20">
            <div className="w-6 h-[1px] bg-[#22C7F2]/40 hidden sm:block" />
            <div className="px-2.5 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-md border border-[rgba(143,223,255,0.22)] shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FDFFF]" />
              <span className="text-[11px] font-mono font-medium text-[#E5F0FF]">
                Ø1.00 in through-hole
              </span>
            </div>
          </div>

          {/* Callout 3: Centered feature */}
          <div className="absolute bottom-14 left-6 pointer-events-none hidden sm:flex items-center gap-2 z-20">
            <div className="px-2.5 py-1 rounded-full bg-[#0B1220]/80 backdrop-blur-md border border-[rgba(143,223,255,0.18)] shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2F80FF]" />
              <span className="text-[10.5px] font-mono text-[#E5F0FF]/80">
                Centered feature
              </span>
            </div>
          </div>

          {/* Drag instruction micro-hint */}
          <div className="absolute top-6 right-6 pointer-events-none z-20 hidden md:block">
            <span className="text-[10px] font-mono text-white/40 tracking-wider">
              DRAG TO ROTATE
            </span>
          </div>

          {/* Result Bar at Bottom of Viewport */}
          <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-20 pointer-events-none flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#0B1220]/85 backdrop-blur-md border border-[rgba(143,223,255,0.16)] text-[10px] sm:text-[11px] font-mono text-[#E5F0FF]">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="font-semibold text-[#8FDFFF] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Geometry generated
              </span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className="text-white/70 hidden sm:inline">Base solid: cube</span>
              <span className="text-white/20 hidden md:inline">|</span>
              <span className="text-white/70 hidden md:inline">Feature: through-hole</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-semibold text-[10px] shrink-0">
              <span>Status: valid</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EzerCadViewer;
