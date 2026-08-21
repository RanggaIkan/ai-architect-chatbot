import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Architectural3DViewer = () => {
  const mountRef = useRef(null);
  const [activeMode, setActiveMode] = useState('SOLID');
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const modelRef = useRef(null);
  const originalMaterials = useRef(new Map());

  // Function untuk apply mode shading ke semua mesh & array material
  const applyRenderMode = (mode) => {
    if (!modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (!child.isMesh) return;

      const origMat = originalMaterials.current.get(child.uuid);
      if (!origMat) return;

      if (mode === 'SOLID') {
        child.material = origMat;
      } else if (mode === 'FEA WIREFRAME') {
        child.material = new THREE.MeshBasicMaterial({
          color: 0xd97706, // Amber/orange FEA color
          wireframe: true,
        });
      } else if (mode === 'STRESS HEATMAP') {
        // Gradient vertikal / posisi simulasi tegangan finite element
        const posY = child.position.y;
        const heatColor = posY > 1.2 ? 0xef4444 : posY > 0.4 ? 0xf59e0b : 0x3b82f6;
        child.material = new THREE.MeshStandardMaterial({
          color: heatColor,
          roughness: 0.25,
          metalness: 0.1,
          wireframe: false,
        });
      } else if (mode === 'X-RAY GLASS') {
        child.material = new THREE.MeshPhysicalMaterial({
          color: 0x93c5fd,
          transmission: 0.9,
          opacity: 0.45,
          transparent: true,
          roughness: 0.1,
          ior: 1.45,
          depthWrite: false,
        });
      }
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#faf8f5');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // 3. Lighting (Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff7ea, 2.0);
    mainLight.position.set(15, 25, 15);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.8);
    fillLight.position.set(-15, 10, -15);
    scene.add(fillLight);

    // 4. Grid Helper
    const grid = new THREE.GridHelper(30, 30, 0xd4af37, 0xe5e7eb);
    grid.position.y = -0.01;
    scene.add(grid);

    // 5. Load GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/appartement.glb',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        // Auto-center & Scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 8 / (maxDim || 1);
        model.scale.setScalar(scale);

        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -box.min.y;
        model.position.z = -center.z;

        // Simpan semua material asli ke Map
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            originalMaterials.current.set(child.uuid, child.material);
          }
        });

        scene.add(model);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Gagal memuat model:', err);
        setLoading(false);
      }
    );

    // 6. Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isPaused) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPaused]);

  // Handle Switch Mode saat state activeMode berubah
  useEffect(() => {
    applyRenderMode(activeMode);
  }, [activeMode]);

  return (
    <div className="relative w-full h-[560px] bg-[#faf8f5] rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-stone-50/90 backdrop-blur-xs font-mono text-xs text-stone-500 uppercase tracking-widest">
          Loading 3D BIM Structural Model...
        </div>
      )}

      {/* Control Buttons Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs border border-stone-200 p-1 rounded-xl pointer-events-auto shadow-xs">
          {['SOLID', 'FEA WIREFRAME', 'STRESS HEATMAP', 'X-RAY GLASS'].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setActiveMode(mode);
                applyRenderMode(mode);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg transition-all ${
                activeMode === mode
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-3.5 py-1.5 text-xs font-mono bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-xl pointer-events-auto shadow-xs transition"
        >
          {isPaused ? '▶ Resume Orbit' : '❚❚ Pause Orbit'}
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default Architectural3DViewer;