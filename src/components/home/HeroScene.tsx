"use client";

import { useEffect, useRef } from "react";
import type * as ThreeTypes from "three";

export default function HeroScene({
  onReady,
  className = "",
}: {
  onReady?: () => void;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const noWebGL =
      typeof WebGLRenderingContext === "undefined" ||
      (() => {
        try {
          const c = document.createElement("canvas");
          return !(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
          return true;
        }
      })();

    if (reduce || small || noWebGL) return;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      try {
        const THREE = await import("three");
        if (disposed || !mount) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.18;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 12.5);

        const root = new THREE.Group();
        root.position.set(0, 0.15, 0);
        root.rotation.y = -0.24;
        scene.add(root);

        /* ---------- Garment silhouette ---------- */
        const coat = new THREE.Shape();
        coat.moveTo(0, 2.6);
        coat.lineTo(-0.55, 2.48);
        coat.lineTo(-0.9, 2.3);
        coat.lineTo(-1.58, 2.02);
        coat.lineTo(-2.04, 0.94);
        coat.lineTo(-1.82, 0.7);
        coat.lineTo(-1.44, 1.26);
        coat.lineTo(-1.34, 0.68);
        coat.lineTo(-1.56, -2.18);
        coat.lineTo(-0.05, -2.34);
        coat.lineTo(0.05, -2.34);
        coat.lineTo(1.56, -2.18);
        coat.lineTo(1.34, 0.68);
        coat.lineTo(1.44, 1.26);
        coat.lineTo(1.82, 0.7);
        coat.lineTo(2.04, 0.94);
        coat.lineTo(1.58, 2.02);
        coat.lineTo(0.9, 2.3);
        coat.lineTo(0.55, 2.48);
        coat.closePath();

        const coatGeo = new THREE.ExtrudeGeometry(coat, {
          depth: 0.46,
          bevelEnabled: true,
          bevelThickness: 0.055,
          bevelSize: 0.055,
          bevelSegments: 3,
          curveSegments: 8,
        });
        coatGeo.translate(0, 0, -0.23);

        const coatMat = new THREE.MeshPhysicalMaterial({
          color: 0x100c18,
          metalness: 0.82,
          roughness: 0.3,
          clearcoat: 0.9,
          clearcoatRoughness: 0.25,
          emissive: 0x210535,
          emissiveIntensity: 0.55,
          side: THREE.DoubleSide,
        });
        const coatMesh = new THREE.Mesh(coatGeo, coatMat);
        root.add(coatMesh);

        // Edge + wireframe overlays
        const edgeGeo = new THREE.EdgesGeometry(coatGeo, 26);
        const edgeMat = new THREE.LineBasicMaterial({
          color: 0xc084fc,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const edges = new THREE.LineSegments(edgeGeo, edgeMat);
        root.add(edges);

        const wireGeo = new THREE.WireframeGeometry(coatGeo);
        const wireMat = new THREE.LineBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.09,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        wire.scale.setScalar(1.002);
        root.add(wire);

        /* ---------- Trousers ---------- */
        function legShape(sign: 1 | -1) {
          const s = new THREE.Shape();
          s.moveTo(sign * 0.08, -1.9);
          s.lineTo(sign * 0.98, -1.98);
          s.lineTo(sign * 1.08, -3.2);
          s.lineTo(sign * 0.92, -4.32);
          s.lineTo(sign * 0.34, -4.36);
          s.lineTo(sign * 0.16, -2.9);
          s.closePath();
          return s;
        }
        const pantsMat = new THREE.MeshPhysicalMaterial({
          color: 0x08070b,
          metalness: 0.55,
          roughness: 0.5,
          clearcoat: 0.4,
          emissive: 0x160324,
          emissiveIntensity: 0.35,
        });
        const pantsGeos: ThreeTypes.BufferGeometry[] = [];
        ([-1, 1] as const).forEach((sign) => {
          const geo = new THREE.ExtrudeGeometry(legShape(sign), {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.04,
            bevelSize: 0.04,
            bevelSegments: 2,
          });
          geo.translate(0, 0, -0.34);
          pantsGeos.push(geo);
          const mesh = new THREE.Mesh(geo, pantsMat);
          root.add(mesh);
          const legEdges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo, 28),
            new THREE.LineBasicMaterial({
              color: 0xa855f7,
              transparent: true,
              opacity: 0.34,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            })
          );
          root.add(legEdges);
        });

        /* ---------- Halo + orbit rings ---------- */
        const ringGroup = new THREE.Group();
        ringGroup.position.y = -0.55;
        root.add(ringGroup);

        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: 0.34,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const chromeMat = new THREE.MeshBasicMaterial({
          color: 0xc9cbd4,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const halo = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.012, 8, 180), ringMat);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = -1.6;
        ringGroup.add(halo);

        const orbitA = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.008, 8, 160), ringMat.clone());
        orbitA.rotation.x = Math.PI / 2.3;
        orbitA.rotation.y = 0.35;
        ringGroup.add(orbitA);

        const orbitB = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.005, 8, 160), chromeMat);
        orbitB.rotation.x = Math.PI / 1.9;
        orbitB.rotation.z = -0.5;
        ringGroup.add(orbitB);

        const orbitC = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 8, 140), ringMat.clone());
        orbitC.rotation.x = Math.PI / 2;
        orbitC.position.y = 0.55;
        (orbitC.material as ThreeTypes.MeshBasicMaterial).opacity = 0.16;
        ringGroup.add(orbitC);

        // Orbiting nodes
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xe8e9ee, transparent: true, opacity: 0.8 });
        const nodeGeo = new THREE.SphereGeometry(0.035, 10, 10);
        const nodes: ThreeTypes.Mesh[] = [];
        for (let i = 0; i < 4; i++) {
          const node = new THREE.Mesh(nodeGeo, i === 0 ? nodeMat : ringMat);
          ringGroup.add(node);
          nodes.push(node);
        }

        /* ---------- Particles ---------- */
        const count = 260;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const r = 2.2 + Math.random() * 3.4;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
          positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0xc084fc,
          size: 0.028,
          transparent: true,
          opacity: 0.72,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        root.add(particles);

        /* ---------- Floor grid ---------- */
        const grid = new THREE.GridHelper(18, 32, 0x6d28d9, 0x241a33);
        grid.position.y = -4.9;
        (grid.material as ThreeTypes.Material).transparent = true;
        (grid.material as ThreeTypes.Material).opacity = 0.32;
        scene.add(grid);

        /* ---------- Lights ---------- */
        scene.add(new THREE.HemisphereLight(0x9f7aea, 0x050506, 0.9));
        const key = new THREE.DirectionalLight(0xf1f2f6, 2.4);
        key.position.set(4.5, 6, 6);
        scene.add(key);
        const violet = new THREE.PointLight(0xa855f7, 22, 16, 2);
        violet.position.set(-3.5, 1.5, 4.5);
        scene.add(violet);
        const deep = new THREE.PointLight(0x6d28d9, 16, 14, 2);
        deep.position.set(3.5, -2, 3.5);
        scene.add(deep);
        const rim = new THREE.DirectionalLight(0xc084fc, 1.2);
        rim.position.set(-4, 2, -5);
        scene.add(rim);

        /* ---------- Interaction ---------- */
        const pointer = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const onPointer = (e: PointerEvent) => {
          target.x = (e.clientX / window.innerWidth) * 2 - 1;
          target.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        const resize = () => {
          if (!mount) return;
          const w = mount.clientWidth || 1;
          const h = mount.clientHeight || 1;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);

        const clock = new THREE.Clock();
        let firstFrame = true;

        const animate = () => {
          raf = requestAnimationFrame(animate);
          const t = clock.getElapsedTime();
          pointer.x += (target.x - pointer.x) * 0.045;
          pointer.y += (target.y - pointer.y) * 0.045;

          root.rotation.y = -0.24 + Math.sin(t * 0.22) * 0.09 + pointer.x * 0.18;
          root.rotation.x = pointer.y * 0.055;
          root.position.y = 0.15 + Math.sin(t * 0.6) * 0.055;

          ringGroup.rotation.y = t * 0.16;
          orbitA.rotation.z = t * 0.25;
          orbitB.rotation.z = -t * 0.18;
          orbitC.rotation.z = t * 0.35;

          nodes.forEach((node, i) => {
            const angle = t * (0.35 + i * 0.05) + (i * Math.PI) / 2;
            const radius = 2.85;
            node.position.set(Math.cos(angle) * radius, -1.6, Math.sin(angle) * radius);
          });

          particles.rotation.y = t * 0.025;
          grid.rotation.y = t * 0.01;

          camera.position.x += (pointer.x * 0.42 - camera.position.x) * 0.04;
          camera.position.y += (-pointer.y * 0.24 - camera.position.y) * 0.04;
          camera.lookAt(0, -0.35, 0);

          renderer.render(scene, camera);
          if (firstFrame) {
            firstFrame = false;
            readyRef.current?.();
          }
        };
        animate();

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onPointer);
          resizeObserver?.disconnect();
          scene.traverse((obj) => {
            const mesh = obj as ThreeTypes.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            const mat = mesh.material as ThreeTypes.Material | ThreeTypes.Material[] | undefined;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          });
          pantsGeos.forEach((g) => g.dispose());
          renderer.dispose();
          if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
        };
      } catch {
        // fallback art remains visible
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
