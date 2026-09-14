"use client";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import * as THREE from "three";
import dynamic from "next/dynamic";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Model from "@/components/model2";
import { useSpring, animated } from "@react-spring/three";

const Scene = dynamic(() => import("@/components/scene"), { ssr: false });

// Parallax Stars Component
function ParallaxStars({ count = 2000, scrollY }) {
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
    if (pointsRef.current && scrollY !== undefined) {
      pointsRef.current.position.y = scrollY * 0.002;
      pointsRef.current.rotation.y = scrollY * 0.0001;
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
function FloatingShapes({ scrollY }) {
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
    if (group.current && scrollY !== undefined) {
      group.current.position.y = scrollY * 0.003;
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
function ParallaxLayers({ scrollY }) {
  return (
    <>
      <ParallaxStars count={2000} scrollY={scrollY} />
      <FloatingShapes scrollY={scrollY} />
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
  const [scrollY, setScrollY] = useState(0);
  const sections = {
    about: useRef(null),
    experiences: useRef(null),
    education: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (section) =>
    sections[section]?.current?.scrollIntoView({ behavior: "smooth" });

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
    <div className="bg-black text-white min-h-screen flex flex-col relative">
      {/* Three.js Parallax Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParallaxLayers scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Content with z-index to appear above the 3D background */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-4 sm:py-6">
          <nav className="flex items-center overflow-x-auto">
            {/* <h1 className="text-xl font-bold">Your Name</h1> */}
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
          className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24"
          ref={sections.about}
        >
          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-0">
            <div className="col-span-1 border-0 text-left lg:col-span-2">
              <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
                Irfan<span className="text-blue-500"> Rahmanindra</span>
              </h1>
              {/* <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-8">
                IT professional with a degree in Electrical Engineering from the
                University of Indonesia, adept at creating innovative solutions
                and optimizing processes. Experienced in driving digital
                transformation, platform development, and system automation,
                with a strong track record of delivering high-quality outcomes.
                Highly ambitious, detail-oriented, and dedicated to approaching
                challenges with responsibility and a proactive mindset.
              </p> */}
              <p className="mb-8 max-w-2xl text-xl text-gray-400 md:text-2xl">
                Full Stack Software Engineer | IT Specialist
              </p>
              <p className="mb-8 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                Full-stack software engineer with 3+ years of experience
                building enterprise web applications, integrations, and
                workflow automation using Java/Spring, React/React Native, and
                SQL.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button
                  className="w-full gap-2 sm:w-auto"
                  onClick={() => scrollTo("projects")}
                >
                  View Projects <ExternalLink size={16} />
                </Button>
                <Button variant="outline" className="w-full gap-2 sm:w-auto">
                  Download Resume <ExternalLink size={16} />
                </Button>
              </div>
            </div>

            <div className="relative col-span-1 h-[280px] min-w-0 sm:h-[400px] lg:col-span-3">
              <Canvas shadows camera={{ position: [1, 1.5, 2.5], fov: 50 }}>
                <ambientLight />
                <directionalLight
                  position={[-5, 5, 5]}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />
                <group position={[0, -1, 0]}>
                  <Suspense fallback={null}>
                    <Model pose={4} position={[0, 0, 0]} />
                    <Model pose={1} position={[1, 0, -1]} />
                    <Model pose={2} position={[-1, 0, -1]} />
                  </Suspense>
                </group>
                <mesh
                  rotation={[-0.5 * Math.PI, 0, 0]}
                  position={[0, -1, 0]}
                  receiveShadow
                >
                  <planeGeometry args={[10, 10, 1, 1]} />
                  <shadowMaterial transparent opacity={0.2} />
                </mesh>
                <Rig />
              </Canvas>
            </div>
          </div>
        </section>

        {/* <section className="relative w-full h-[500px] overflow-y-scroll">
          <Scene />
        </section> */}
        {/* Experiences Section */}
        <section
          className="container mx-auto px-4 py-10 sm:py-12"
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
          className="container mx-auto py-12 px-4"
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
              },
              {
                period: "Oct 2019 - Mar 2020",
                degree: "Electrical Engineering Exchange Student",
                institution: "Universität Duisburg-Essen, Essen",
                location: "Germany",
              },
              {
                period: "Aug 2016 - Jan 2021",
                degree: "Electrical Engineering Bachelor",
                institution: "Universitas Indonesia",
                location: "Indonesia",
                detail: "GPA 3.27/4.00",
              },
            ].map((education) => (
              <Card
                key={`${education.degree}-${education.institution}`}
                className="bg-gray-900 border-gray-800"
              >
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-5 md:items-center">
                    <p className="text-sm font-semibold text-blue-400 md:col-span-1">
                      {education.period}
                    </p>
                    <div className="md:col-span-3">
                      <h3 className="text-xl font-bold">{education.degree}</h3>
                      <p className="text-gray-400">
                        {education.institution}
                        {education.detail && ` | ${education.detail}`}
                      </p>
                    </div>
                    <p className="text-gray-400 md:col-span-1 md:text-right">
                      {education.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section
          className="container mx-auto px-4 py-10 sm:py-12"
          ref={sections.projects}
        >
          <h2 className="mb-8 text-3xl font-bold">Independent and Academic Projects</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              ["Zeal", "End-to-end NFT authenticity platform for brand protection with blockchain-based minting and verification, secure backend APIs, and a companion mobile app."],
              ["TrustMark", "Product catalog and supply chain tracking platform with QR code generation for provenance verification."],
              ["Receipt Hub", "Receipt and reimbursement management platform that digitizes expense submission, approval, and tracking workflows."],
              ["Data Mining", "Coursework projects for NTU's Data Mining and Machine Learning module, applying classification and optimization algorithms to real-world datasets in Python and Jupyter."],
            ].map(([name, description]) => (
              <Card key={name} className="border-gray-800 bg-gray-900">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-blue-400">{name}</h3>
                  <p className="text-gray-400">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section
          className="container mx-auto px-4 py-10 sm:py-12"
          ref={sections.skills}
        >
          <h2 className="mb-8 text-3xl font-bold">Technical Skills</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["Backend", "Node.js, Java (Spring Boot/MVC), REST APIs, Microservices"],
              ["Frontend", "React.js, React Native, Angular, Next.js"],
              ["Databases", "SQL Server, MySQL, PostgreSQL"],
              ["Tools & Platforms", "Docker, Git, Linux, Windows, WhatsApp Business API, Payment Gateways, SAP Integration"],
              ["Blockchain/Web3", "Solidity, Hardhat, Polygon, Smart Contracts, NFT Minting, Truffle"],
              ["Languages", "JavaScript/TypeScript, Java, Solidity, Golang, PHP, Python, C++, SQL"],
            ].map(([category, skills]) => (
              <Card key={category} className="border-gray-800 bg-gray-900">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold text-blue-400">{category}</h3>
                  <p className="text-gray-400">{skills}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Certifications and Leadership Section */}
        <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-10 sm:py-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-3xl font-bold">Certifications</h2>
            <div className="space-y-3">
              {[
                ["IELTS Certification", "British Council - Band Score 7.0 (Jan 2025 - Jan 2027)"],
                ["Applied Scrum for Agile Project Management", "University of Maryland, edX (Mar 2024)"],
                ["Microsoft Azure AI Fundamentals: AI Overview", "Microsoft (Feb 2024)"],
                ["Business Presentation Skills", "PPM Manajemen (Nov 2023)"],
                ["React Native, React JS, and Golang", "Enigma Camp (Apr - Jun 2023)"],
                ["Intensive German Language Course A1 and A2", "Mercator Science & Education (2018 - 2019)"],
              ].map(([name, issuer]) => (
                <Card key={name} className="border-gray-800 bg-gray-900">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-gray-400">{issuer}</p>
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
        <section className="container mx-auto px-4 py-10 sm:py-12" ref={sections.contact}>
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
