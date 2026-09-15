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
  { text: "Creative.", className: "hero-word--blue" },
  { text: "Efficient.", className: "hero-word--red" },
  { text: "Advanced.", className: "" },
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

// 3D Animation Component
const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Initialize scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Add renderer to the DOM
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;

    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x1e90ff,
    });

    // Create mesh
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 2;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [introPhase, setIntroPhase] = useState("orb");
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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsLoading(false);
      setIntroPhase("ready");
      return undefined;
    }

    const revealTimer = window.setTimeout(() => setIntroPhase("reveal"), 1500);
    const loadingTimer = window.setTimeout(() => {
      setIntroPhase("ready");
      setIsLoading(false);
    }, 3300);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(loadingTimer);
    };
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

  function Rig() {
    return useFrame((state) => {
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        1.5 + state.mouse.x / 4,
        0.075
      );
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        1.5 + state.mouse.y / 4,
        0.075
      );
    });
  }

  return (
    <div className={`page-shell ${isLoading ? "is-loading" : "is-ready"} intro-${introPhase} bg-black text-white min-h-screen flex flex-col relative`}>
      <div
        className={`site-loader ${isLoading ? "is-loading" : "is-loaded"}`}
        aria-hidden={!isLoading}
      >
        <div className="site-loader__burst" aria-hidden="true">
          <div className="site-loader__particles">
            {Array.from({ length: 72 }, (_, index) => {
              const angle = index * 2.399;
              const distance = 16 + ((index * 17) % 68);
              const x = 50 + Math.cos(angle) * distance;
              const y = 50 + Math.sin(angle) * distance * 0.62;
              const size = 1 + ((index * 7) % 5);
              const color = index % 3 === 0 ? "#ef6b6b" : index % 3 === 1 ? "#4a9eff" : "#9b7bff";

              return (
                <i
                  key={index}
                  style={{
                    "--particle-x": `${x}%`,
                    "--particle-y": `${y}%`,
                    "--particle-size": `${size}px`,
                    "--particle-color": color,
                    "--particle-index": index,
                  }}
                />
              );
            })}
          </div>
        </div>
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
          className="hero-section motion-section relative container mx-auto flex min-h-[calc(100svh-64px)] flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:min-h-[calc(100svh-80px)] sm:py-16"
          ref={sections.about}
        >
          <div className="hero-aura hero-aura--blue" />
          <div className="hero-aura hero-aura--red" />
          <div className="hero-content relative z-10 max-w-6xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 sm:text-sm">
              Full Stack Software Engineer / IT Specialist
            </p>
            <h1 className="hero-title hero-title--shared text-5xl font-bold sm:text-7xl lg:text-8xl">
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
              Design • Full Stack Development • AI Integration
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

        {/* <section className="relative w-full h-[500px] overflow-y-scroll">
          <Scene />
        </section> */}
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
