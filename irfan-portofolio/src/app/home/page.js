"use client";
import { useEffect, useRef, useState, useMemo } from "react";
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
import Lenis from "lenis";
import { projects } from "@/lib/projects";

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


// ─── Big-Bang canvas ──────────────────────────────────────────────────────────
// All rendering is imperative (rAF loop) — not React renders — for smooth 60fps.
const PARTICLE_COLORS = [
  '#4a9eff', '#7b6fff', '#ef6b6b', '#c4b5fd',
  '#ffffff', '#38d9f5', '#a78bfa', '#ff8fa3', '#60efff',
];

function BigBangCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip animation for reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Particle class ────────────────────────────────────────
    class Particle {
      constructor(x, y, fast = true) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = fast
          ? Math.random() * 10 + 2
          : Math.random() * 2.5 + 0.4;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = fast
          ? Math.random() * 2 + 0.4
          : Math.random() * 5 + 2;
        this.origSize = this.size;
        this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.life = 1;
        this.decay = fast
          ? Math.random() * 0.007 + 0.003
          : Math.random() * 0.003 + 0.001;
        this.trail = [];
        this.maxTrail = fast
          ? Math.floor(Math.random() * 12) + 6
          : Math.floor(Math.random() * 5) + 2;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.018;   // gentle gravity
        this.vx *= 0.994;
        this.vy *= 0.994;
        this.life -= this.decay;
        this.size = this.origSize * Math.max(0, this.life);
      }

      draw(c) {
        if (this.life <= 0 || this.size < 0.05) return;
        c.save();
        // Trail
        for (let i = 0; i < this.trail.length; i++) {
          const ratio = i / this.trail.length;
          c.globalAlpha = ratio * this.life * 0.35;
          c.beginPath();
          c.arc(this.trail[i].x, this.trail[i].y, Math.max(0.05, this.size * ratio * 0.7), 0, Math.PI * 2);
          c.fillStyle = this.color;
          c.fill();
        }
        // Glow halo
        c.globalAlpha = this.life * 0.2;
        c.beginPath();
        c.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        // Core dot
        c.globalAlpha = Math.min(1, this.life * 1.2);
        c.beginPath();
        c.arc(this.x, this.y, Math.max(0.05, this.size), 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
      }

      isDead() { return this.life <= 0; }
    }

    // ── Animation loop ────────────────────────────────────────
    let startTime = null;
    let particles = [];
    let burstFired = false;
    let running = true;
    let animId;

    const tick = (ts) => {
      if (!running) return;
      if (!startTime) startTime = ts;
      const t = ts - startTime;          // ms since mount

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // ── Phase 0: Pitch black (0–380ms) ───────────────────
      if (t < 380) {
        /* nothing — pure black */

      // ── Phase 1: Singularity (380–630ms) ─────────────────
      } else if (t < 630) {
        const p = (t - 380) / 250;
        const glowR = p * 70;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        g.addColorStop(0,   `rgba(255,255,255,${p})`);
        g.addColorStop(0.5, `rgba(180,210,255,${p * 0.4})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fill();
        // Tiny bright core
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, p * 2)})`;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0.1, p * 6), 0, Math.PI * 2);
        ctx.fill();

      // ── Phase 2: Rapid white expansion (630–800ms) ───────
      } else if (t < 800) {
        const p = (t - 630) / 170;
        const r = 6 + p * 90;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
        g.addColorStop(0,   'rgba(255,255,255,1)');
        g.addColorStop(0.3, `rgba(210,235,255,${1 - p * 0.3})`);
        g.addColorStop(0.8, `rgba(100,160,255,${(1 - p) * 0.5})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
        ctx.fill();

      // ── Phase 3+: BURST + particles in flight ────────────
      } else {
        if (!burstFired) {
          burstFired = true;
          // Fast small streaks
          for (let i = 0; i < 220; i++) particles.push(new Particle(cx, cy, true));
          // Slow large glowing blobs
          for (let i = 0; i < 55; i++) particles.push(new Particle(cx, cy, false));
        }

        // White flash fades 800→1150ms
        const flash = Math.max(0, 1 - (t - 800) / 350);
        if (flash > 0) {
          const maxR = Math.hypot(cx, cy) * 1.6;
          const gf = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
          gf.addColorStop(0,   `rgba(255,255,255,${flash})`);
          gf.addColorStop(0.4, `rgba(180,210,255,${flash * 0.6})`);
          gf.addColorStop(1,   'rgba(0,0,0,0)');
          ctx.fillStyle = gf;
          ctx.fillRect(0, 0, w, h);
        }

        // Particles
        particles = particles.filter(p => !p.isDead());
        for (const p of particles) { p.update(); p.draw(ctx); }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // Stop the loop 800ms after the curtain finishes fading
    // (JS fires is-ready at 1000ms, curtain fades over 700ms → done at 1700ms)
    const stopTimer = setTimeout(() => { running = false; }, 2200);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      clearTimeout(stopTimer);
      window.removeEventListener('resize', resize);
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
  const scrollYRef = useRef(0);
  const lenisRef = useRef(null);
  const sections = {
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

    const timer = window.setTimeout(() => setIntroPhase("ready"), 1000);

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
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" }
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

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
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
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
        <header className="motion-header container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center justify-between gap-6 overflow-x-auto">
            <button
              type="button"
              className="shrink-0 text-left"
              onClick={() => scrollTo("about")}
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
          ref={sections.about}
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
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                className="hero-button hero-button--primary w-full rounded-full px-7 py-6 text-base sm:w-auto"
                onClick={() => scrollTo("projects")}
              >
                Initiate System <ExternalLink size={16} />
              </Button>
              <Button
                variant="outline"
                className="hero-button w-full rounded-full px-7 py-6 text-base sm:w-auto"
                onClick={() => scrollTo("contact")}
              >
                View Portfolio
              </Button>
            </div>
          </div>
          <button
            type="button"
            className="hero-scroll-cue absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-gray-500"
            onClick={() => scrollTo("experiences")}
            aria-label="Scroll to experience"
          >
            <span className="block text-2xl">↓</span>
          </button>
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
              <Card key={`${experience.company}-${experience.role}`} className="border-gray-800 bg-gray-900">
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
                className="bg-gray-900 border-gray-800"
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
              <Card key={project.slug} className="border-gray-800 bg-gray-900">
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
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
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
                className="group grid gap-5 border-b border-gray-800 p-5 last:border-b-0 sm:grid-cols-[7rem_10rem_1fr] sm:items-center sm:p-6"
              >
                <span className="text-sm font-semibold text-gray-600">{number}</span>
                <div className="flex items-center gap-3 text-gray-300">
                  <Icon size={18} className="text-blue-400 transition-transform duration-300 group-hover:rotate-6" />
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(([skill, SkillIcon]) => (
                    <span
                      key={skill}
                      className="group/skill inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-200"
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
                <Card key={name} className="border-gray-800 bg-gray-900">
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
                <Card key={`${role}-${detail}`} className="border-gray-800 bg-gray-900">
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
        <footer className="container mx-auto py-6 px-4 mt-auto border-t border-gray-800">
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
