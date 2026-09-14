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
        <header className="container mx-auto py-6 px-4">
          <nav className="flex items-center">
            {/* <h1 className="text-xl font-bold">Your Name</h1> */}
            <div className="flex gap-4">
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
              <Button variant="ghost" size="sm">
                Skills
              </Button>
              <Button variant="ghost" size="sm">
                Contact
              </Button>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section
          className="container mx-auto flex flex-col items-center justify-center text-center py-24 px-4"
          ref={sections.about}
        >
          <div className="grid grid-cols-5 w-full ">
            <div className="col-span-2 text-left  border-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
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
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-8">
                Full Stack Developer
              </p>
              <div className="flex gap-4">
                <Button className="gap-2">
                  View Projects <ExternalLink size={16} />
                </Button>
                <Button variant="outline" className="gap-2">
                  Download Resume <ExternalLink size={16} />
                </Button>
              </div>
            </div>

            <div className="relative col-span-3 h-[400px]">
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
          className="container mx-auto py-12 px-4"
          ref={sections.experiences}
        >
          <h2 className="text-3xl font-bold mb-8">Experiences</h2>
          <div>
            <div className="grid grid-cols-5 gap-6">
              <>
                {" "}
                <Card className="bg-transparent border-gray-800 ">
                  <CardContent className="mx-auto my-auto">
                    <h3 className="text-l font-bold mb-2">
                      February 2024 - December 2024
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800 col-span-4">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1 italic">
                      Sinarmas Mining
                    </h3>
                    <h3 className="text-xl font-bold mb-2">
                      AI Governance and Tech Experience Specialist
                    </h3>
                    <ul className="list-disc text-gray-400 mb-4">
                      <li>
                        Project Approval Digitalization: Streamlined the project
                        approval process by transforming workflows from initial
                        approval to project completion into a fully digital
                        system. Integrated the solution with SAP and multiple
                        platforms to ensure seamless access to comprehensive
                        data and improve operational efficiency
                      </li>
                      <li>
                        AI Hackathon: Conceptualized and organized a
                        company-wide hackathon to drive AI-focused innovation.
                        The event successfully identified talent and generated
                        actionable ideas, advancing the organization’s AI
                        strategy and initiatives.
                      </li>
                      <li>
                        Company Website Development: Designed and developed a
                        professional company profile website featuring an
                        integrated booking system and payment gateway. This
                        solution streamlined the registration and payment
                        processes for all training programs, enhancing user
                        convenience and operational effectiveness.
                      </li>
                    </ul>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Demo
                      </Button>
                      <Button variant="outline" size="sm">
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
              <>
                <Card className="bg-transparent border-gray-800 ">
                  <CardContent className="mx-auto my-auto">
                    <h3 className="text-l font-bold mb-2">
                      October 2022 - February 2024
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800 col-span-4">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1 italic">
                      Sinarmas Mining
                    </h3>
                    <h3 className="text-xl font-bold mb-2">
                      Information Technology Development Program
                    </h3>
                    <ul className="list-disc text-gray-400 mb-4">
                      <p>
                        6 months of intensive learning and 10 months of hands-on
                        training across diverse projects.
                      </p>
                      <li>
                        Automated Systems Development: Designed and implemented
                        algorithms for calculating points in loyalty systems,
                        streamlining processes for digital certificate
                        generation, and automating email communication workflows
                        to enhance user engagement and operational efficiency.
                      </li>
                      <li>
                        Project Management Tools: Created a comprehensive
                        digital calendar system to facilitate project timeline
                        organization for senior management. Automated deadline
                        reminders and notifications via WhatsApp and email,
                        improving communication and ensuring timely task
                        completion. Designed summary dashboards to provide
                        stakeholders with clear and actionable project insights.
                        Real-Time Notification Systems: Integrated the WhatsApp
                        Business API to enable seamless, real-time notifications
                        for users, ensuring efficient communication and prompt
                        updates.
                      </li>
                      <li>
                        Platform and Application Development: Contributed to the
                        development of a corporate social responsibility (CSR)
                        platform by designing and optimizing its front-end
                        interface. Developed a mobile-friendly news page using
                        React Native to enhance accessibility and user
                        experience. Built a content management system (CMS)
                        front end to support the organization and administration
                        of news, content, and registrations.
                      </li>
                      <li>
                        Feature Enhancements and Debugging: Worked on improving
                        existing platform features and developing new
                        functionalities to meet evolving user needs. Diagnosed
                        and resolved technical bugs, ensuring system reliability
                        and performance optimization.
                      </li>
                    </ul>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Demo
                      </Button>
                      <Button variant="outline" size="sm">
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
              <>
                <Card className="bg-transparent border-gray-800 ">
                  <CardContent className="mx-auto my-auto">
                    <h3 className="text-l font-bold mb-2">
                      March 2022 - October 2022
                    </h3>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800 col-span-4">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1 italic">
                      Indocyber Global Teknologi
                    </h3>
                    <h3 className="text-xl font-bold mb-2">
                      Junior Java Developer
                    </h3>
                    <ul className="list-disc text-gray-400 mb-4">
                      <p>
                        Completed an intensive bootcamp, where I gained hands-on
                        experience and developed strong skills in REST APIs,
                        JSON, Spring MVC, Spring Framework, HTML5, SQL Server
                        Management Studio, Object-Oriented Programming (OOP),
                        Cascading Style Sheets (CSS), Spring Boot, Java, and
                        Microsoft SQL Server. Following this, I had the
                        opportunity to further refine these skills through
                        on-the-job experience, where I applied and deepened my
                        expertise in these technologies within a professional
                        setting.
                      </p>
                    </ul>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Demo
                      </Button>
                      <Button variant="outline" size="sm">
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            </div>
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
              {
                period: "Sep 2013 - Jun 2016",
                degree: "Senior High School",
                institution: "Labschool Jakarta",
                location: "Indonesia",
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
                        {education.detail && ` - ${education.detail}`}
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
          className="container mx-auto py-12 px-4"
          ref={sections.projects}
        >
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Project Card 1 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-800 rounded-md mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Project Name</h3>
                <p className="text-gray-400 mb-4">
                  A brief description of the project and the technologies used.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Card 2 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-800 rounded-md mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Project Name</h3>
                <p className="text-gray-400 mb-4">
                  A brief description of the project and the technologies used.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project Card 3 */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-800 rounded-md mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Project Name</h3>
                <p className="text-gray-400 mb-4">
                  A brief description of the project and the technologies used.
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Demo
                  </Button>
                  <Button variant="outline" size="sm">
                    Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skills Section */}
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Skill Items */}
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "Tailwind CSS",
              "MongoDB",
              "GraphQL",
              "Git",
            ].map((skill) => (
              <Card key={skill} className="bg-gray-900 border-gray-800">
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-lg">{skill}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Github size={16} /> GitHub
            </Button>
            <Button variant="outline" className="gap-2">
              <Linkedin size={16} /> LinkedIn
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail size={16} /> your.email@example.com
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
              <Button variant="ghost" size="icon">
                <Github size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail size={20} />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
