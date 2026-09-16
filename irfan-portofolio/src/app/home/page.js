"use client";
import { useEffect, useRef, useState, useMemo, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Braces,
  Database,
  Cloud,
  Smartphone,
  Wrench,
  BrainCircuit,
  Code2,
  Network,
  CreditCard,
  Blocks,
  FileCode2,
  Globe2,
  Award,
  BookOpenCheck,
  Presentation,
  Languages,
} from "lucide-react";
import {
  SiReact,
  SiAngular,
  SiNextdotjs,
  SiNodedotjs,
  SiSpringboot,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiGit,
  SiLinux,
  SiSap,
  SiSolidity,
  SiPolygon,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPhp,
  SiCplusplus,
} from "react-icons/si";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Stage } from "@react-three/drei";
import Lenis from "lenis";
import { projects } from "@/lib/projects";

function Irfan3DModel() {
  const { scene } = useGLTF("/3Dmodel/irfan3d.glb");
  return <primitive object={scene} />;
}
useGLTF.preload("/3Dmodel/irfan3d.glb");

const heroWords = [
  { text: "Irfan", className: "hero-word--blue" },
  { text: "Rahmanindra", className: "" },
];

// Parallax Stars Component
function ParallaxStars({ count = 2000, scrollYRef }) {
  const pointsRef = useRef();
  
  // Initialize positions immediately with useMemo
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (pointsRef.current && scrollYRef.current !== undefined) {
      pointsRef.current.position.y = scrollYRef.current * 0.002;
      pointsRef.current.rotation.y = scrollYRef.current * 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4a9eff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Floating Geometric Shapes
function FloatingShapes({ scrollYRef }) {
  const group = useRef();
  const shapes = useRef([]);

  useEffect(() => {
    shapes.current = Array.from({ length: 15 }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    if (group.current && scrollYRef.current !== undefined) {
      group.current.position.y = scrollYRef.current * 0.003;
      group.current.children.forEach((mesh, i) => {
        const shape = shapes.current[i];
        if (shape) {
          mesh.rotation.x += 0.005 * shape.speed;
          mesh.rotation.y += 0.003 * shape.speed;
          mesh.position.y += Math.sin(state.clock.elapsedTime + i) * 0.001;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {shapes.current.map((shape, i) => (
        <mesh key={i} position={shape.position} rotation={shape.rotation}>
          {i % 3 === 0 ? (
            <boxGeometry args={[0.5, 0.5, 0.5]} />
          ) : i % 3 === 1 ? (
            <octahedronGeometry args={[0.3]} />
          ) : (
            <torusGeometry args={[0.3, 0.1, 16, 100]} />
          )}
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1e90ff" : "#00ffff"}
            wireframe={i % 4 === 0}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Parallax Layers Component
function ParallaxLayers({ scrollYRef }) {
  return (
    <>
      <ParallaxStars count={2000} scrollYRef={scrollYRef} />
    </>
  );
}


// ─── Big-Bang Three.js canvas ─────────────────────────────────────────────────
// Uses WebGL + bloom post-processing — 20,000 particles from a singularity point.
// Postprocessing modules are async-imported so they don't bloat the initial bundle.
function BigBangCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let running = true;
    let animId = null;
    let disposeAll = null;

    const init = async () => {
      // Dynamic imports — keeps Three.js postprocessing out of the main chunk
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] =
        await Promise.all([
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
        ]);
      if (!running) return; // component unmounted during async import

      const W = window.innerWidth;
      const H = window.innerHeight;

      // ── Scene setup ───────────────────────────────────────
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 10000);
      camera.position.set(0, 0, 200);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lights
      scene.add(new THREE.AmbientLight(0x404040, 1.5));
      const pLight = new THREE.PointLight(0xffffff, 2, 1000);
      pLight.position.set(0, 0, 0);
      scene.add(pLight);

      // ── Bloom post-processing ────────────────────────────
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 2, 0.5, 0);
      composer.addPass(bloom);

      // ── 20,000-particle system ────────────────────────────
      // All start at the singularity (origin) with random outward velocities.
      const COUNT = 20000;
      const posArr = new Float32Array(COUNT * 3); // all zeros → at origin
      const velArr = new Float32Array(COUNT * 3);
      const colArr = new Float32Array(COUNT * 3);

      // Particle color palette (rgb 0–1 range)
      const PALETTE = [
        [1.0, 1.0, 1.0],     // white
        [0.29, 0.61, 1.0],   // blue
        [0.48, 0.42, 0.98],  // purple
        [0.94, 0.42, 0.42],  // red
        [0.22, 0.85, 0.96],  // cyan
        [0.77, 0.71, 0.99],  // lavender
        [1.0, 0.56, 0.64],   // pink
      ];

      for (let i = 0; i < COUNT; i++) {
        // Uniform-sphere velocity distribution
        const theta = Math.random() * 2 * Math.PI;
        const phi   = Math.acos(Math.random() * 2 - 1);
        const speed = Math.random() * 0.5 + 0.5; // 0.5–1.0
        velArr[i * 3]     = speed * Math.sin(phi) * Math.cos(theta);
        velArr[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
        velArr[i * 3 + 2] = speed * Math.cos(phi);
        // Assign color
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        colArr[i * 3] = c[0]; colArr[i * 3 + 1] = c[1]; colArr[i * 3 + 2] = c[2];
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3));

      // Soft radial-gradient sprite for each particle
      const sc = document.createElement('canvas');
      sc.width = sc.height = 64;
      const sCtx = sc.getContext('2d');
      const sg = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      sg.addColorStop(0,   'rgba(255,255,255,1)');
      sg.addColorStop(0.2, 'rgba(200,210,255,0.8)');
      sg.addColorStop(0.5, 'rgba(100,140,255,0.4)');
      sg.addColorStop(1,   'rgba(0,0,0,0)');
      sCtx.fillStyle = sg;
      sCtx.fillRect(0, 0, 64, 64);

      const mat = new THREE.PointsMaterial({
        size: 2,
        map: new THREE.CanvasTexture(sc),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0,
        vertexColors: true,
      });

      const pts = new THREE.Points(geo, mat);
      scene.add(pts);

      // ── Galaxy cluster ────────────────────────────────────
      // Appears at 0.7 s — simulates structure forming after the bang.
      let galaxyPts = null;
      const createGalaxy = () => {
        const GC = 3000;
        const gPos = new Float32Array(GC * 3);
        for (let i = 0; i < GC; i++) {
          gPos[i * 3]     = (Math.random() - 0.5) * 500;
          gPos[i * 3 + 1] = (Math.random() - 0.5) * 500;
          gPos[i * 3 + 2] = (Math.random() - 0.5) * 500;
        }
        const gGeo = new THREE.BufferGeometry();
        gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
        galaxyPts = new THREE.Points(gGeo, new THREE.PointsMaterial({
          size: 1.2,
          color: 0xaaaadd,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0,
          depthTest: false,
        }));
        scene.add(galaxyPts);
      };

      // ── Nebula ────────────────────────────────────────────
      // Appears at 1.0 s — the glowing gas cloud surrounding the explosion.
      let nebulaMesh = null;
      const createNebula = () => {
        const nc = document.createElement('canvas');
        nc.width = nc.height = 512;
        const nCtx = nc.getContext('2d');
        const ng = nCtx.createRadialGradient(256, 256, 64, 256, 256, 256);
        ng.addColorStop(0,   'rgba(50, 0, 100, 0.8)');
        ng.addColorStop(0.5, 'rgba(10, 0,  50, 0.3)');
        ng.addColorStop(1,   'rgba(0,  0,   0, 0.0)');
        nCtx.fillStyle = ng;
        nCtx.fillRect(0, 0, 512, 512);
        // Random noise stars
        for (let i = 0; i < 1000; i++) {
          nCtx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.08).toFixed(3)})`;
          nCtx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
        }
        nebulaMesh = new THREE.Mesh(
          new THREE.SphereGeometry(450, 32, 32),
          new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(nc),
            side: THREE.BackSide,
            transparent: true,
            opacity: 0,
          })
        );
        scene.add(nebulaMesh);
      };

      // ── Resize handler ───────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // ── Main animation loop ──────────────────────────────
      const clock = new THREE.Clock();
      const INITIAL_SPEED = 200; // units/second — starts fast
      const BURST_AT = 1.0;      // seconds until particles start flying
      // To create the seamless starry background, particles decelerate exponentially!

      const tick = () => {
        if (!running) return;
        animId = requestAnimationFrame(tick);

        const delta   = clock.getDelta();
        const elapsed = clock.elapsedTime;

        // — Singularity (0 → BURST_AT) —
        if (elapsed < BURST_AT) {
          mat.opacity = Math.min(0.85, (elapsed / BURST_AT) * 0.85);

        // — Explosion and Star Formation (BURST_AT → ∞) —
        } else {
          mat.opacity = 0.85;
          const timeSinceBurst = elapsed - BURST_AT;
          // Exponential decay for speed so they slow down and stop like stars
          const currentSpeed = INITIAL_SPEED * Math.exp(-timeSinceBurst * 1.5);
          
          if (currentSpeed > 0.1) {
            const p = geo.attributes.position.array;
            for (let i = 0; i < COUNT; i++) {
              const idx = i * 3;
              p[idx]     += velArr[idx]     * currentSpeed * delta;
              p[idx + 1] += velArr[idx + 1] * currentSpeed * delta;
              p[idx + 2] += velArr[idx + 2] * currentSpeed * delta;
            }
            geo.attributes.position.needsUpdate = true;
          }
        }

        // Galaxy cluster fades in
        if (elapsed > 1.8 && !galaxyPts) createGalaxy();
        if (galaxyPts) {
          galaxyPts.material.opacity = Math.min(0.45, (elapsed - 1.8) * 0.9);
          galaxyPts.rotation.y += delta * 0.012;
        }

        // Nebula fades in
        if (elapsed > 2.2 && !nebulaMesh) createNebula();
        if (nebulaMesh) {
          nebulaMesh.material.opacity = Math.min(0.6, (elapsed - 2.2) * 0.9);
        }

        // Subtle cinematic camera drift + Parallax from scrolling down
        const scrollY = window.scrollY || 0;
        
        // --- SEAMLESS FLY-IN TRANSITION (Like Anton Manaev) ---
        // Camera starts far back (Z=800) and smoothly flies deep into the particle field (Z=50)
        const targetZ = 50;
        const startZ = 800;
        const flyProgress = Math.min(1, elapsed / 3.5);
        const easeOutQuart = 1 - Math.pow(1 - flyProgress, 4);
        camera.position.z = startZ - (startZ - targetZ) * easeOutQuart;

        camera.position.x = Math.sin(elapsed * 0.25) * 5;
        // Scroll moves the camera Y, making background stars go up
        camera.position.y = Math.cos(elapsed * 0.18) * 3 - (scrollY * 0.05); 
        camera.lookAt(0, -scrollY * 0.05, 0);

        composer.render(delta);
      };

      tick();

      // Register cleanup for when running flag is set to false
      disposeAll = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
    };

    init().catch(console.error);

    return () => {
      running = false;
      if (disposeAll) disposeAll();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}

export default function Portfolio() {
  const [introPhase, setIntroPhase] = useState("loading");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollYRef = useRef(0);
  const lenisRef = useRef(null);
  const sections = {
    hero: useRef(null),
    about: useRef(null),
    experiences: useRef(null),
    education: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  const isLoading = introPhase !== "ready";

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIntroPhase("ready");
      return undefined;
    }

    const timer = window.setTimeout(() => setIntroPhase("ready"), 3500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return undefined;

    document.documentElement.classList.add("motion-ready");
    const animatedElements = document.querySelectorAll(
      ".motion-header, .motion-section, [data-slot='card']"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.hasAttribute("data-stagger")) {
              const children = entry.target.children;
              Array.from(children).forEach((child, index) => {
                child.style.transitionDelay = `${index * 100}ms`;
                child.classList.add("is-visible");
              });
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    animatedElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [introPhase]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });
    let animationFrame;

    const animate = (time) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(animate);
    };

    lenisRef.current = lenis;
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsNavVisible(false); // Scrolling down
      } else {
        setIsNavVisible(true);  // Scrolling up
      }
      
      lastScrollY.current = currentScrollY;
      scrollYRef.current = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (section) => {
    const target = sections[section]?.current;
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -24 });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`page-shell ${isLoading ? "is-loading" : "is-ready"} bg-black text-white min-h-screen flex flex-col relative`}>
      <div className="page-curtain" aria-hidden="true">
        <BigBangCanvas />
      </div>


      {/* Three.js Parallax Background */}
      <div className="background-canvas fixed top-0 left-0 z-0 h-full w-full">
        <Canvas
          dpr={[1, 1.5]}
          performance={{ min: 0.6 }}
          camera={{ position: [0, 0, 10], fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParallaxLayers scrollYRef={scrollYRef} />
        </Canvas>
      </div>

      {/* Content with z-index to appear above the 3D background */}
      <div className="page-content relative z-10">
        {/* Header */}
        <header 
          className={`main-header sticky top-4 z-50 mx-auto w-full max-w-6xl px-4 py-2 sm:py-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0"
          }`}
        >
          <nav className="flex items-center justify-between gap-6 overflow-x-auto rounded-full border border-white/10 bg-white/5 px-6 py-4 shadow-lg backdrop-blur-md">
            <button
              type="button"
              className="shrink-0 text-left"
              onClick={() => scrollTo("hero")}
            >
              <span className="block text-xl font-semibold tracking-[0.08em] text-white">
                IRFAN<span className="text-blue-500">R</span>
              </span>
              <span className="block text-[0.55rem] tracking-[0.28em] text-gray-500">
                SOFTWARE / SYSTEMS / DESIGN
              </span>
            </button>
            <div className="flex min-w-max gap-1 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("about")}
              >
                About
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("experiences")}
              >
                Experiences
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("projects")}
              >
                Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("education")}
              >
                Education
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("skills")}
              >
                Skills
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scrollTo("contact")}
              >
                Contact
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section
          className="hero-section motion-section relative container mx-auto flex min-h-[calc(100svh-64px)] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[calc(100svh-80px)] sm:py-16"
          ref={sections.hero}
        >
          <div className="hero-aura hero-aura--blue" />
          <div className="hero-aura hero-aura--red" />
          <div className="hero-content relative z-10 max-w-6xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 sm:text-sm">
              Full Stack Software Engineer / IT Specialist
            </p>
            <h1 className="hero-title hero-title--shared font-bold">
              {heroWords.map((word, index) => (
                <span
                  key={word.text}
                  className={`hero-word ${word.className} hero-word--${index + 1}`}
                >
                  {word.text}
                </span>
              ))}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-300 sm:text-xl">
              Design • Full Stack Development • Technology Strategy
            </p>
            <div className="mt-9 flex justify-center gap-4">
              <Button
                variant="outline"
                className="hero-button w-full rounded-full border-white/20 bg-white/5 px-8 py-6 text-base backdrop-blur-md hover:bg-white/10 sm:w-auto"
                onClick={() => scrollTo("contact")}
              >
                Contact Me
              </Button>
            </div>
          </div>
          <button
            type="button"
            className="hero-scroll-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-gray-500"
            onClick={() => scrollTo("about")}
            aria-label="Scroll to about"
          >
            <span className="block text-2xl">↓</span>
          </button>
        </section>

        {/* About Section */}
        <section
          className="motion-section relative container mx-auto px-4 py-20 sm:py-32"
          ref={sections.about}
        >
          <div className="mx-auto max-w-6xl grid grid-cols-1 gap-12 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:grid-cols-2 md:items-center sm:p-14">
            <div className="text-left text-center md:text-left">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                About Me
              </h2>
              <div className="mx-auto h-1 w-20 rounded bg-blue-500/50 mb-8 md:mx-0" />
              <p className="text-lg leading-relaxed text-gray-300">
                I am a passionate Full Stack Software Engineer and IT Specialist with a strong foundation in building scalable, efficient, and user-centric applications. With expertise spanning modern web technologies, system architecture, and UI/UX design, I thrive at the intersection of creativity and logic. I am dedicated to continuously exploring emerging tech and delivering solutions that are not just functional, but exceptional.
              </p>
            </div>
            
            <div className="h-[400px] w-full lg:h-[500px]">
              <Suspense fallback={<div className="flex h-full w-full items-center justify-center text-gray-400">Loading 3D Model...</div>}>
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                  <Suspense fallback={null}>
                    <Stage environment="apartment" intensity={1.5} adjustCamera>
                      <Irfan3DModel />
                    </Stage>
                  </Suspense>
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 2} 
                    maxPolarAngle={Math.PI / 2} 
                    autoRotate
                    autoRotateSpeed={1.5}
                  />
                </Canvas>
              </Suspense>
            </div>
          </div>
        </section>

        {/* Experiences Section */}
        <section
          className="motion-section container mx-auto px-4 py-10 sm:py-12"
          ref={sections.experiences}
        >
          <h2 className="mb-8 text-3xl font-bold">Experience</h2>
          <div className="space-y-4">
            {[
              {
                period: "Feb 2024 - Dec 2024",
                company: "Sinarmas Mining",
                role: "AI Governance and Tech Experience Specialist",
                location: "Jakarta, Indonesia",
                highlights: [
                  "Built a full-stack digital project approval system integrated with SAP and internal platforms, centralizing project data and improving process visibility.",
                  "Organized a company-wide AI-focused hackathon to advance the company AI strategy.",
                  "Designed a company profile and training website with booking and payment gateway integrations.",
                ],
              },
              {
                period: "Oct 2022 - Feb 2024",
                company: "Sinarmas Mining",
                role: "IT Development Program - Full Stack Engineer",
                location: "Jakarta, Indonesia",
                description: "6 months of intensive learning and 10 months of hands-on training.",
                highlights: [
                  "Improved operational efficiency by 90% and saved approximately Rp. 1.1 billion through a digital employee recognition program.",
                  "Built project tracking with calendar views and automated WhatsApp/email reminders, reducing costs by about Rp. 473 million and improving execution efficiency by 70%.",
                  "Developed real-time internal messaging with the WhatsApp Business API.",
                  "Contributed to a CSR platform, React Native news page, and CMS for news, content, and registrations.",
                  "Enhanced an internal ERP system through new modules, feature improvements, and technical issue resolution.",
                ],
              },
              {
                period: "Mar 2022 - Oct 2022",
                company: "PT. Indocyber Global Teknologi",
                role: "Junior Java Developer",
                location: "Jakarta, Indonesia",
                highlights: [
                  "Built full-stack CRUD applications using Java, Spring Boot/MVC, REST APIs, and SQL Server.",
                  "Designed relational database schemas and optimized SQL queries to improve application performance.",
                ],
              },
              {
                period: "Jul 2019 - Sep 2019",
                company: "PT. Toyota Motor Manufacturing Indonesia",
                role: "Internship",
                location: "Jakarta, Indonesia",
                highlights: [
                  "Learned operation, control, and monitoring of electrical power systems at a production plant, including a 7,615 KVA 20KV system, transformers, capacitor banks, MV/LV panels, bus ducts, and emergency generators.",
                ],
              },
            ].map((experience) => (
              <Card key={`${experience.company}-${experience.role}`} className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="md:col-span-1">
                      <p className="text-sm font-semibold text-blue-400">{experience.period}</p>
                      <p className="mt-1 text-sm text-gray-500">{experience.location}</p>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="text-xl font-bold">{experience.role}</h3>
                      <p className="mb-3 italic text-gray-400">{experience.company}</p>
                      {experience.description && <p className="mb-3 text-gray-400">{experience.description}</p>}
                      <ul className="list-disc space-y-2 pl-5 text-gray-400">
                        {experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section
          className="motion-section container mx-auto py-12 px-4"
          ref={sections.education}
        >
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          <div className="space-y-4">
            {[
              {
                period: "Aug 2025 - June 2026",
                degree: "Master of Science in Information System",
                institution: "Nanyang Technological University",
                location: "Singapore",
                detail: "GPA 4.35/5.00",
                logo: "/assets/universities/ntu.ico",
              },
              {
                period: "Oct 2019 - Mar 2020",
                degree: "Electrical Engineering Exchange Student",
                institution: "Universität Duisburg-Essen, Essen",
                location: "Germany",
                logo: "/assets/universities/ude.ico",
              },
              {
                period: "Aug 2016 - Jan 2021",
                degree: "Electrical Engineering Bachelor",
                institution: "Universitas Indonesia",
                location: "Indonesia",
                detail: "GPA 3.27/4.00",
                logo: "/assets/universities/ui.png",
              },
            ].map((education) => {
              return (
              <Card
                key={`${education.degree}-${education.institution}`}
                className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-[4rem_1fr_8rem] md:items-center">
                    <div className="flex size-12 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 p-2">
                      <img
                        src={education.logo}
                        alt={`${education.institution} logo`}
                        className="size-8 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-blue-400">
                      {education.period}
                      </p>
                      <h3 className="text-xl font-bold">{education.degree}</h3>
                      <p className="text-gray-400">
                        {education.institution}
                        {education.detail && ` | ${education.detail}`}
                      </p>
                    </div>
                    <p className="text-gray-400 md:text-right">
                      {education.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </section>

        {/* Projects Section */}
        <section
          className="motion-section container mx-auto px-4 py-10 sm:py-12"
          ref={sections.projects}
        >
          <h2 className="mb-8 text-3xl font-bold">Independent and Academic Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.slug} className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                <Link href={`/projects/${project.slug}`} className="block h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {project.type}
                    </p>
                    <h3 className="mb-2 text-xl font-bold text-blue-400">{project.name}</h3>
                    <p className="flex-1 text-gray-400">{project.description}</p>
                    <span className="mt-6 text-sm font-semibold text-white">
                      View project <span aria-hidden="true">-&gt;</span>
                    </span>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section
          className="motion-section container mx-auto px-4 py-10 sm:py-12"
          ref={sections.skills}
        >
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                The toolkit
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">Tech Stack</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-gray-500">
              Technologies I use to turn complex workflows into reliable,
              useful products.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            {[
              ["01", "Frontend", Braces, [["React.js", SiReact], ["React Native", SiReact], ["Angular", SiAngular], ["Next.js", SiNextdotjs]]],
              ["02", "Backend", Wrench, [["Node.js", SiNodedotjs], ["Java", Code2], ["Spring Boot", SiSpringboot], ["REST APIs", Network], ["Microservices", Blocks]]],
              ["03", "Data", Database, [["SQL Server", Database], ["MySQL", SiMysql], ["PostgreSQL", SiPostgresql], ["SQL", FileCode2]]],
              ["04", "Cloud & Tools", Cloud, [["Docker", SiDocker], ["Git", SiGit], ["Linux", SiLinux], ["SAP Integration", SiSap], ["Payment Gateways", CreditCard]]],
              ["05", "Mobile & Web3", Smartphone, [["Solidity", SiSolidity], ["Hardhat", Wrench], ["Polygon", SiPolygon], ["NFT Minting", Blocks], ["Smart Contracts", FileCode2]]],
              ["06", "Languages & AI", BrainCircuit, [["TypeScript", SiTypescript], ["JavaScript", SiJavascript], ["Python", SiPython], ["Golang", Code2], ["PHP", SiPhp], ["C++", SiCplusplus]]],
            ].map(([number, category, Icon, skills]) => (
              <div
                key={category}
                className="group grid gap-5 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[7rem_10rem_1fr] sm:items-center sm:p-6"
              >
                <span className="text-sm font-semibold text-gray-500">{number}</span>
                <div className="flex items-center gap-3 text-gray-300">
                  <Icon size={18} className="text-blue-400 transition-transform duration-300 group-hover:rotate-6" />
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(([skill, SkillIcon]) => (
                    <span
                      key={skill}
                      className="group/skill inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 text-sm text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/60 hover:bg-blue-500/20 hover:text-blue-200 shadow-md"
                    >
                      <SkillIcon className="text-base text-gray-500 transition-colors group-hover/skill:text-blue-300" aria-hidden="true" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications and Leadership Section */}
        <section className="motion-section container mx-auto grid grid-cols-1 gap-6 px-4 py-10 sm:py-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-3xl font-bold">Certifications</h2>
            <div className="space-y-3">
              {[
                ["IELTS Certification", "British Council - Band Score 7.0 (Jan 2025 - Jan 2027)", Languages],
                ["Applied Scrum for Agile Project Management", "University of Maryland, edX (Mar 2024)", BookOpenCheck],
                ["Microsoft Azure AI Fundamentals: AI Overview", "Microsoft (Feb 2024)", Award],
                ["Business Presentation Skills", "PPM Manajemen (Nov 2023)", Presentation],
                ["React Native, React JS, and Golang", "Enigma Camp (Apr - Jun 2023)", Code2],
                ["Intensive German Language Course A1 and A2", "Mercator Science & Education (2018 - 2019)", Globe2],
              ].map(([name, issuer, Icon]) => (
                <Card key={name} className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300">
                        <Icon size={19} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{name}</h3>
                        <p className="text-sm text-gray-400">{issuer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-8 text-3xl font-bold">Leadership & Service</h2>
            <div className="space-y-3">
              {[
                ["Person in Charge", "Interweek - Managed schedule and finance of a university futsal competition (2018)"],
                ["Person in Charge", "Disciplinary Commission FTUI - Oversaw discipline during student orientation (2018)"],
                ["Staff", "Health and Safety at Universitas Indonesia Olympics (2016)"],
                ["Member", "Student Consultative Assembly FTUI (2016 - 2017)"],
                ["Liaison Officer", "Labsproject - Coordinated communication between two organizations (2015)"],
                ["Chief Operational Officer", "Vashka Company - Managed operational activities (2014)"],
              ].map(([role, detail]) => (
                <Card key={`${role}-${detail}`} className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{role}</h3>
                    <p className="text-sm text-gray-400">{detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="motion-section container mx-auto px-4 py-10 sm:py-12" ref={sections.contact}>
          <h2 className="mb-8 text-3xl font-bold">Get In Touch</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://github.com/irfandra" target="_blank" rel="noreferrer">
                <Github size={16} /> GitHub
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="https://linkedin.com/in/irfan-rahmanindra-35a714154/" target="_blank" rel="noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="mailto:irfanrahmanindra@gmail.com">
                <Mail size={16} /> irfanrahmanindra@gmail.com
              </a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto py-6 px-4 mt-auto border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2025 Irfan Rahmanindra. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/irfandra" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com/in/irfan-rahmanindra-35a714154/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:irfanrahmanindra@gmail.com" aria-label="Email">
                  <Mail size={20} />
                </a>
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
