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
  Menu,
  X,
  Calendar,
  MapPin,
  ChevronRight,
  Building2,
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
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Manual rotation that won't pause when scrolling or interacting
      modelRef.current.rotation.y -= delta * 0.5;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
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

  const starTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

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
        size={0.08}
        color="#8ab4f8"
        map={starTexture}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let running = true;
    let animId = null;
    let disposeAll = null;

    const init = async () => {
      // Dynamic imports — keeps Three.js postprocessing out of the main chunk
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] =
        await Promise.all([
          import("three/examples/jsm/postprocessing/EffectComposer.js"),
          import("three/examples/jsm/postprocessing/RenderPass.js"),
          import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
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
        [1.0, 1.0, 1.0], // white
        [0.29, 0.61, 1.0], // blue
        [0.48, 0.42, 0.98], // purple
        [0.94, 0.42, 0.42], // red
        [0.22, 0.85, 0.96], // cyan
        [0.77, 0.71, 0.99], // lavender
        [1.0, 0.56, 0.64], // pink
      ];

      for (let i = 0; i < COUNT; i++) {
        // Uniform-sphere velocity distribution
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = Math.random() * 0.5 + 0.5; // 0.5–1.0
        velArr[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
        velArr[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
        velArr[i * 3 + 2] = speed * Math.cos(phi);
        // Assign color
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        colArr[i * 3] = c[0];
        colArr[i * 3 + 1] = c[1];
        colArr[i * 3 + 2] = c[2];
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colArr, 3));

      // Soft radial-gradient sprite for each particle
      const sc = document.createElement("canvas");
      sc.width = sc.height = 64;
      const sCtx = sc.getContext("2d");
      const sg = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      sg.addColorStop(0, "rgba(255,255,255,1)");
      sg.addColorStop(0.2, "rgba(200,210,255,0.8)");
      sg.addColorStop(0.5, "rgba(100,140,255,0.4)");
      sg.addColorStop(1, "rgba(0,0,0,0)");
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
          gPos[i * 3] = (Math.random() - 0.5) * 500;
          gPos[i * 3 + 1] = (Math.random() - 0.5) * 500;
          gPos[i * 3 + 2] = (Math.random() - 0.5) * 500;
        }
        const gGeo = new THREE.BufferGeometry();
        gGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
        galaxyPts = new THREE.Points(
          gGeo,
          new THREE.PointsMaterial({
            size: 1.5,
            color: 0xaaaadd,
            map: mat.map,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0,
            depthTest: false,
          }),
        );
        scene.add(galaxyPts);
      };

      // ── Nebula ────────────────────────────────────────────
      // Appears at 1.0 s — the glowing gas cloud surrounding the explosion.
      let nebulaMesh = null;
      const createNebula = () => {
        const nc = document.createElement("canvas");
        nc.width = nc.height = 512;
        const nCtx = nc.getContext("2d");
        const ng = nCtx.createRadialGradient(256, 256, 64, 256, 256, 256);
        ng.addColorStop(0, "rgba(50, 0, 100, 0.8)");
        ng.addColorStop(0.5, "rgba(10, 0,  50, 0.3)");
        ng.addColorStop(1, "rgba(0,  0,   0, 0.0)");
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
          }),
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
      window.addEventListener("resize", onResize);

      // ── Main animation loop ──────────────────────────────
      const clock = new THREE.Clock();
      const INITIAL_SPEED = 200; // units/second — starts fast
      const BURST_AT = 1.0; // seconds until particles start flying
      // To create the seamless starry background, particles decelerate exponentially!

      const tick = () => {
        if (!running) return;
        animId = requestAnimationFrame(tick);

        const delta = clock.getDelta();
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
              p[idx] += velArr[idx] * currentSpeed * delta;
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
        camera.position.y = Math.cos(elapsed * 0.18) * 3 - scrollY * 0.05;
        camera.lookAt(0, -scrollY * 0.05, 0);

        composer.render(delta);
      };

      tick();

      // Register cleanup for when running flag is set to false
      disposeAll = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

let hasSeenIntro = false;

export default function Portfolio() {
  const [introPhase, setIntroPhase] = useState(() => hasSeenIntro ? "ready" : "loading");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
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
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || hasSeenIntro) {
      setIntroPhase("ready");
      hasSeenIntro = true;
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIntroPhase("ready");
      hasSeenIntro = true;
    }, 3500);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return undefined;

    document.documentElement.classList.add("motion-ready");
    const animatedElements = document.querySelectorAll(
      ".motion-header, .motion-section, [data-slot='card']",
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
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    animatedElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [introPhase]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
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
        setIsMobileMenuOpen(false); // Auto-close menu when scrolling down
      } else {
        setIsNavVisible(true); // Scrolling up
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
    <div
      className={`page-shell ${isLoading ? "is-loading" : "is-ready"} bg-black text-white min-h-screen flex flex-col relative`}
    >
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
            isNavVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-[150%] opacity-0"
          }`}
        >
          <nav className="relative flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-4 shadow-lg backdrop-blur-md">
            <button
              type="button"
              className="shrink-0 text-left"
              onClick={() => {
                scrollTo("hero");
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="block text-xl font-semibold tracking-[0.08em] text-white">
                IRFAN<span className="text-blue-500">R</span>
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden min-w-max gap-1 md:flex sm:gap-4">
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

            {/* Mobile Burger Toggle */}
            <button
              className="block p-2 text-white md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] mt-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-xl md:hidden">
              {[
                "about",
                "experiences",
                "projects",
                "education",
                "skills",
                "contact",
              ].map((section) => (
                <Button
                  key={section}
                  variant="ghost"
                  className="w-full justify-start text-lg capitalize text-white hover:bg-white/10"
                  onClick={() => {
                    scrollTo(section);
                    setIsMobileMenuOpen(false); // Close on selection
                  }}
                >
                  {section}
                </Button>
              ))}
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section
          className="hero-section motion-section relative mx-auto w-full max-w-6xl flex min-h-[calc(100svh-64px)] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[calc(100svh-80px)] sm:py-16"
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
          className="motion-section relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-24"
          ref={sections.about}
        >
          <div className="mb-8 pl-4 md:pl-0">
            <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">About Me</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* LEFT COLUMN: Intro & Base */}
            <div className="flex flex-col gap-6">
              {/* Intro Card */}
              <div className="group relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 sm:p-10">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] transition-all duration-500 group-hover:bg-blue-500/20" />
                <div className="relative z-10 flex h-full flex-col justify-center">
                  <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight">
                    I build <span className="text-blue-400">enterprise</span> software that scales.
                  </h2>
                  <p className="text-base leading-relaxed text-gray-400">
                    Full‑stack engineer with 2+ years of experience delivering production systems that improve efficiency and reduce costs.
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <MapPin size={22} />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-white">Base of Operations</h3>
                <p className="text-sm text-gray-400 leading-relaxed">Jakarta, Indonesia</p>
              </div>
            </div>

            {/* MIDDLE COLUMN: 3D Model */}
            <div className="group relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 lg:min-h-[auto]">
              <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)] transition-opacity duration-500 group-hover:opacity-50" />
              
              <div className="relative z-10 h-full w-full min-h-[350px] lg:min-h-full">
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                      Loading Interactive Model...
                    </div>
                  }
                >
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
                    />
                  </Canvas>
                </Suspense>
              </div>

              <div className="absolute bottom-5 right-5 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-medium tracking-widest text-gray-400 backdrop-blur-md">
                INTERACTIVE 3D
              </div>
            </div>

            {/* RIGHT COLUMN: Experience & Methodology */}
            <div className="flex flex-col gap-6">
              {/* Specialized Expertise Card */}
              <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <BrainCircuit size={22} />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-white">Core Focus</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  I specialize in Java/Spring, React, SAP integrations, and bridging complex business processes with modern architecture.
                </p>
              </div>

              {/* Methodology Card */}
              <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Code2 size={22} />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-white">End-to-End Delivery</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Navigating the complete lifecycle—from architecting systems, to implementation, deployment, and agile support.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Experiences Section */}
        <section
          className="motion-section mx-auto w-full max-w-6xl px-4 py-16 sm:py-24"
          ref={sections.experiences}
        >
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Experience
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Where I've worked
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              Building performance-critical software, shipping scalable
              platforms, and bridging business processes with modern
              architecture.
            </p>
          </div>

          <div className="relative mx-auto w-full">
            {/* The vertical timeline line (fading gradient) */}
            <div className="absolute left-[1.3rem] top-8 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent md:left-[2.5rem] lg:-left-10" />

            <div className="space-y-12">
              {[
                {
                  period: "Feb 2024 - Dec 2024",
                  company: "Sinarmas Mining",
                  logo: "/assets/companies/sinarmas.png",
                  role: "AI Governance and Tech Experience Specialist",
                  location: "Jakarta, Indonesia",
                  highlights: [
                    "Built a full-stack digital project approval system integrated with SAP and internal platforms, centralizing project data and improving process visibility.",
                    "Organized a company-wide AI-focused hackathon to advance the company AI strategy.",
                    "Designed a company profile and training website with booking and payment gateway integrations.",
                  ],
                  tags: [
                    "SAP Integration",
                    "Full-Stack",
                    "AI Strategy",
                    "Payment Gateway",
                  ],
                },
                {
                  period: "Oct 2022 - Feb 2024",
                  company: "Sinarmas Mining",
                  logo: "/assets/companies/sinarmas.png",
                  role: "Full Stack Engineer (ITDP)",
                  location: "Jakarta, Indonesia",
                  description:
                    "6 months of intensive learning and 10 months of hands-on training.",
                  highlights: [
                    "Improved operational efficiency by 90% and saved approximately Rp. 1.1 billion through a digital employee recognition program.",
                    "Built project tracking with calendar views and automated WhatsApp/email reminders, reducing costs by about Rp. 473 million and improving execution efficiency by 70%.",
                    "Developed real-time internal messaging with the WhatsApp Business API.",
                    "Contributed to a CSR platform, React Native news page, and CMS for news, content, and registrations.",
                    "Enhanced an internal ERP system through new modules, feature improvements, and technical issue resolution.",
                  ],
                  tags: [
                    "React Native",
                    "CMS",
                    "ERP",
                    "WhatsApp Business API",
                    "Cost Optimization",
                  ],
                },
                {
                  period: "Mar 2022 - Oct 2022",
                  company: "PT. Indocyber Global Teknologi",
                  logo: "/assets/companies/indocyber.png",
                  role: "Junior Java Developer",
                  location: "Jakarta, Indonesia",
                  highlights: [
                    "Built full-stack CRUD applications using Java, Spring Boot/MVC, REST APIs, and SQL Server.",
                    "Designed relational database schemas and optimized SQL queries to improve application performance.",
                  ],
                  tags: [
                    "Java",
                    "Spring Boot",
                    "SQL Server",
                    "REST API",
                    "Database Optimization",
                  ],
                },
                {
                  period: "Jul 2019 - Sep 2019",
                  company: "PT. Toyota Motor Manufacturing Indonesia",
                  logo: "/assets/companies/toyota.svg",
                  role: "Electrical Engineering Intern",
                  location: "Jakarta, Indonesia",
                  highlights: [
                    "Learned operation, control, and monitoring of electrical power systems at a production plant, including a 7,615 KVA 20KV system, transformers, capacitor banks, MV/LV panels, bus ducts, and emergency generators.",
                  ],
                  tags: [
                    "Electrical Power Systems",
                    "Control & Monitoring",
                    "Industrial Automation",
                  ],
                },
              ].map((experience, idx) => (
                <div key={idx} className="group relative pl-12 md:pl-20 lg:pl-0">
                  {/* Timeline dot */}
                  <div className="absolute left-[1.3rem] top-8 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-blue-400/50 bg-black/50 backdrop-blur-md transition-all duration-500 group-hover:border-blue-400 md:left-[2.5rem] lg:-left-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-500 group-hover:scale-150 group-hover:bg-blue-400" />
                  </div>

                  {/* Card (Pure Glassmorphism + Hover states) */}
                  <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 sm:p-8">
                    {/* Top Date Text */}
                    <p className="mb-6 text-sm font-semibold text-blue-400">
                      {experience.period}
                    </p>

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Logo Frame */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-white shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:border-white/20">
                        {experience.logo ? (
                          <img src={experience.logo} alt={`${experience.company} logo`} className="h-full w-full object-contain drop-shadow-md" />
                        ) : (
                          <Building2 size={28} className="opacity-80" />
                        )}
                      </div>
                      <div>
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">
                          {experience.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-semibold text-blue-400">
                            {experience.company}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <MapPin size={14} /> {experience.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {experience.description && (
                      <p className="mb-6 text-gray-300 leading-relaxed">
                        {experience.description}
                      </p>
                    )}

                    <ul className="mb-6 space-y-3">
                      {experience.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-400 transition-colors group-hover:text-gray-300"
                        >
                          <ChevronRight
                            size={16}
                            className="mt-[3px] shrink-0 text-blue-500/70 transition-colors group-hover:text-blue-400"
                          />
                          <span className="leading-relaxed text-sm md:text-base">
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags Footer */}
                    {experience.tags && (
                      <>
                        <div className="my-6 h-px w-full bg-white/10 transition-colors group-hover:bg-white/20" />
                        <div className="flex flex-wrap gap-2">
                          {experience.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-md transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section
          className="motion-section mx-auto w-full max-w-6xl py-12 px-4"
          ref={sections.education}
        >
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Education
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Academic Background
            </h2>
          </div>
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
                    <div className="grid gap-6 md:grid-cols-[5rem_1fr_8rem] md:items-center">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 p-2 shadow-lg backdrop-blur-sm">
                        <img
                          src={education.logo}
                          alt={`${education.institution} logo`}
                          className="h-full w-full object-contain drop-shadow-md"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-blue-400">
                          {education.period}
                        </p>
                        <h3 className="text-xl font-bold">
                          {education.degree}
                        </h3>
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
          className="motion-section mx-auto w-full max-w-6xl px-4 py-10 sm:py-12"
          ref={sections.projects}
        >
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Projects
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Featured Work
            </h2>
          </div>
          <div className="columns-1 gap-6 md:columns-2">
            {(showAllProjects ? projects : projects.slice(0, 4)).map((project, idx) => {
              const isTall = idx === 0;
              return (
                <div
                  key={project.slug}
                  className="mb-6 block w-full break-inside-avoid"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block h-full"
                  >
                    <div
                      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 sm:p-8`}
                    >
                      {/* Glow effect */}
                      <div className="absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] transition-all duration-500 group-hover:bg-blue-500/20" />

                      {/* Content side */}
                      <div
                        className={`relative z-10 flex flex-col justify-between ${
                          isTall ? "w-full mb-8" : "w-full mb-8 flex-1"
                        }`}
                      >
                        <div>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                            {project.type}
                          </p>
                          <h3 className="mb-4 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-300">
                            {project.name}
                          </h3>
                          <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {project.description}
                          </p>
                        </div>

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-gray-300 backdrop-blur-sm"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-gray-500 backdrop-blur-sm">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Snippet / Animation side */}
                      <div
                        className={`relative z-10 mt-auto flex flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl md:mt-0 ${
                          project.video || project.image ? "w-full" : "h-56 w-full"
                        }`}
                      >
                        {/* Fake Window Header */}
                        <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                          <div className="ml-2 font-mono text-[10px] tracking-widest text-gray-500">
                            {project.video
                              ? "Live Preview"
                              : project.image
                              ? project.previewLabel || "Visual Preview"
                              : project.filename || `${project.slug}.js`}
                          </div>
                        </div>
                        
                        {/* Content Body */}
                        {project.video ? (
                          <div className="relative flex items-center justify-center overflow-hidden bg-black/40 p-4 sm:p-6">
                            <div className="w-3/5 max-w-[320px]">
                              <video
                                src={project.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="h-auto max-h-[60vh] w-full rounded-xl border border-white/10 shadow-2xl opacity-95 transition-all duration-500 group-hover:opacity-100"
                              />
                            </div>
                          </div>
                        ) : project.image ? (
                          <div className="relative flex items-center justify-center overflow-hidden bg-black/40 p-4 sm:p-6">
                            <div className="w-3/5 max-w-[320px]">
                              <img
                                src={project.image}
                                alt={`${project.name} preview`}
                                className="h-auto max-h-[60vh] w-full rounded-xl border border-white/10 shadow-2xl opacity-95 transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-100 object-contain"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex-1 overflow-hidden p-4">
                            <pre className="h-full overflow-hidden font-mono text-[11px] leading-relaxed text-blue-300/70 transition-colors duration-500 group-hover:text-blue-300 sm:text-xs">
                              <code>{project.snippet}</code>
                            </pre>
                            {/* Fade out gradient at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {projects.length > 4 && (
            <div className="mt-12 flex justify-center">
              <Button
                variant="outline"
                className="gap-2 rounded-full border-white/20 bg-white/5 px-8 py-6 text-sm font-medium backdrop-blur-md transition-all hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-blue-500/10"
                onClick={() => setShowAllProjects(!showAllProjects)}
              >
                {showAllProjects ? "Show Less" : "View All Projects"}{" "}
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    showAllProjects ? "-rotate-90" : "rotate-90"
                  }`}
                />
              </Button>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section
          className="motion-section mx-auto w-full max-w-6xl px-4 py-10 sm:py-12"
          ref={sections.skills}
        >
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Tech Stack
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              The Toolkit
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              Technologies I use to turn complex workflows into reliable, useful products.
            </p>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            {[
              [
                "01",
                "Frontend",
                Braces,
                [
                  ["React.js", SiReact],
                  ["React Native", SiReact],
                  ["Angular", SiAngular],
                  ["Next.js", SiNextdotjs],
                ],
              ],
              [
                "02",
                "Backend",
                Wrench,
                [
                  ["Node.js", SiNodedotjs],
                  ["Java", Code2],
                  ["Spring Boot", SiSpringboot],
                  ["REST APIs", Network],
                  ["Microservices", Blocks],
                ],
              ],
              [
                "03",
                "Data",
                Database,
                [
                  ["SQL Server", Database],
                  ["MySQL", SiMysql],
                  ["PostgreSQL", SiPostgresql],
                  ["SQL", FileCode2],
                ],
              ],
              [
                "04",
                "Cloud & Tools",
                Cloud,
                [
                  ["Docker", SiDocker],
                  ["Git", SiGit],
                  ["Linux", SiLinux],
                  ["SAP Integration", SiSap],
                  ["Payment Gateways", CreditCard],
                ],
              ],
              [
                "05",
                "Mobile & Web3",
                Smartphone,
                [
                  ["Solidity", SiSolidity],
                  ["Hardhat", Wrench],
                  ["Polygon", SiPolygon],
                  ["NFT Minting", Blocks],
                  ["Smart Contracts", FileCode2],
                ],
              ],
              [
                "06",
                "Languages & AI",
                BrainCircuit,
                [
                  ["TypeScript", SiTypescript],
                  ["JavaScript", SiJavascript],
                  ["Python", SiPython],
                  ["Golang", Code2],
                  ["PHP", SiPhp],
                  ["C++", SiCplusplus],
                ],
              ],
            ].map(([number, category, Icon, skills]) => (
              <div
                key={category}
                className="group grid gap-5 border-b border-white/10 p-5 last:border-b-0 sm:grid-cols-[7rem_10rem_1fr] sm:items-center sm:p-6"
              >
                <span className="text-sm font-semibold text-gray-500">
                  {number}
                </span>
                <div className="flex items-center gap-3 text-gray-300">
                  <Icon
                    size={18}
                    className="text-blue-400 transition-transform duration-300 group-hover:rotate-6"
                  />
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(([skill, SkillIcon]) => (
                    <span
                      key={skill}
                      className="group/skill inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-2 text-sm text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/60 hover:bg-blue-500/20 hover:text-blue-200 shadow-md"
                    >
                      <SkillIcon
                        className="text-base text-gray-500 transition-colors group-hover/skill:text-blue-300"
                        aria-hidden="true"
                      />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="motion-section mx-auto w-full max-w-6xl px-4 py-10 sm:py-12">
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Beyond Coding
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Certifications & Leadership
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-white">Certifications</h3>
            <div className="space-y-3">
              {[
                [
                  "IELTS Certification",
                  "British Council - Band Score 7.0 (Jan 2025 - Jan 2027)",
                  Languages,
                ],
                [
                  "Applied Scrum for Agile Project Management",
                  "University of Maryland, edX (Mar 2024)",
                  BookOpenCheck,
                ],
                [
                  "Microsoft Azure AI Fundamentals: AI Overview",
                  "Microsoft (Feb 2024)",
                  Award,
                ],
                [
                  "Business Presentation Skills",
                  "PPM Manajemen (Nov 2023)",
                  Presentation,
                ],
                [
                  "React Native, React JS, and Golang",
                  "Enigma Camp (Apr - Jun 2023)",
                  Code2,
                ],
                [
                  "Intensive German Language Course A1 and A2",
                  "Mercator Science & Education (2018 - 2019)",
                  Globe2,
                ],
              ].map(([name, issuer, Icon]) => (
                <Card
                  key={name}
                  className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl"
                >
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
            <h3 className="mb-6 text-2xl font-bold text-white">Leadership & Service</h3>
            <div className="space-y-3">
              {[
                [
                  "Person in Charge",
                  "Interweek - Managed schedule and finance of a university futsal competition (2018)",
                ],
                [
                  "Person in Charge",
                  "Disciplinary Commission FTUI - Oversaw discipline during student orientation (2018)",
                ],
                [
                  "Staff",
                  "Health and Safety at Universitas Indonesia Olympics (2016)",
                ],
                ["Member", "Student Consultative Assembly FTUI (2016 - 2017)"],
                [
                  "Liaison Officer",
                  "Labsproject - Coordinated communication between two organizations (2015)",
                ],
                [
                  "Chief Operational Officer",
                  "Vashka Company - Managed operational activities (2014)",
                ],
              ].map(([role, detail]) => (
                <Card
                  key={`${role}-${detail}`}
                  className="border-white/10 bg-white/5 backdrop-blur-md shadow-xl"
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{role}</h3>
                    <p className="text-sm text-gray-400">{detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="motion-section mx-auto w-full max-w-6xl px-4 py-10 sm:py-12"
          ref={sections.contact}
        >
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Contact
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Get In Touch
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="gap-2" asChild>
              <a
                href="https://github.com/irfandra"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} /> GitHub
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a
                href="https://linkedin.com/in/irfan-rahmanindra-35a714154/"
                target="_blank"
                rel="noreferrer"
              >
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
        <footer className="mx-auto w-full max-w-6xl py-6 px-4 mt-auto border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; 2025 Irfan Rahmanindra. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/irfandra"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://linkedin.com/in/irfan-rahmanindra-35a714154/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
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
