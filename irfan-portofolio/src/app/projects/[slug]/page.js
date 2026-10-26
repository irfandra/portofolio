import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        {/* Navigation */}
        <Button
          variant="ghost"
          asChild
          className="mb-10 -ml-3 gap-2 rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Link href="/home#projects">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            {project.type}
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {project.name}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
            {project.description}
          </p>

          {project.github && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="outline"
                asChild
                className="gap-2 rounded-full border-white/20 bg-white/5 px-6 py-5 text-sm font-medium text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} /> View on GitHub
                </a>
              </Button>
            </div>
          )}
        </header>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Overview & Key Highlights */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl sm:p-8">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Project Overview
            </h2>
            <p className="leading-relaxed text-gray-300">
              {project.overview}
            </p>

            <h2 className="mb-4 mt-8 text-xl font-bold tracking-tight text-white sm:text-2xl">
              Key Architecture & Contributions
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-300 sm:text-base">
              {project.contributions.map((contribution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>{contribution}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sidebar: Technologies */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl sm:p-8">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200 backdrop-blur-sm transition-colors hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-200"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            {project.video && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Video Demonstration
                </p>
                <div className="relative flex justify-center overflow-hidden rounded-xl bg-black/60 p-4">
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-h-[360px] w-auto rounded-lg object-contain shadow-2xl"
                  />
                </div>
              </div>
            )}

            {project.image && (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Telegram Bot Preview
                </p>
                <div className="relative flex justify-center overflow-hidden rounded-xl bg-black/60 p-4">
                  <img
                    src={project.image}
                    alt={`${project.name} mobile preview`}
                    className="max-h-[420px] w-auto rounded-lg object-contain shadow-2xl"
                  />
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Multi-Assignment Section (for Data Mining) */}
        {project.assignments && project.assignments.length > 0 ? (
          <section className="mt-12 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Coursework Breakdown
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                The 3 Data Mining Assignments
              </h2>
            </div>

            <div className="space-y-8">
              {project.assignments.map((assignment, index) => (
                <div
                  key={assignment.id || index}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl sm:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                        {assignment.dataset}
                      </span>
                      <h3 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {assignment.title}
                      </h3>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                        {assignment.description}
                      </p>
                    </div>

                    {assignment.github && (
                      <Button
                        variant="outline"
                        asChild
                        className="gap-2 rounded-full border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/10"
                      >
                        <a
                          href={assignment.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={14} /> View Repository
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Assignment Screenshot / Diagram (e.g. Assignment 3 cluster shapes) */}
                  {assignment.image && (
                    <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-400">
                        {assignment.imageLabel || "Generated Output & Analysis"}
                      </p>
                      <div className="relative flex justify-center">
                        <img
                          src={assignment.image}
                          alt={`${assignment.title} diagram`}
                          className="max-h-[380px] w-auto rounded-lg object-contain shadow-2xl"
                        />
                      </div>
                    </div>
                  )}

                  {/* Code Snippet for this assignment */}
                  {assignment.snippet && (
                    <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-xl">
                      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                          <span className="ml-2 font-mono text-xs text-gray-400">
                            {assignment.filename || "assignment.py"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Code2 size={12} />
                          <span>Implementation Snippet</span>
                        </div>
                      </div>
                      <div className="overflow-x-auto bg-black/50 p-4 sm:p-6">
                        <pre className="font-mono text-xs leading-relaxed text-blue-200/90 sm:text-sm">
                          <code>{assignment.snippet}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : project.snippet ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-gray-400">
                  {project.filename || `${project.slug}.js`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Code2 size={14} />
                <span>Source Preview</span>
              </div>
            </div>

            {/* Code Body */}
            <div className="overflow-x-auto bg-black/50 p-6">
              <pre className="font-mono text-xs leading-relaxed text-blue-200/90 sm:text-sm">
                <code>{project.snippet}</code>
              </pre>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
