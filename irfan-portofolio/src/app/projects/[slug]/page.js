import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
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
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <Button variant="ghost" asChild className="mb-10 gap-2 text-gray-300 sm:mb-12">
          <Link href="/home#projects">
            <ArrowLeft size={16} /> Back to projects
          </Link>
        </Button>

        <header className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            {project.type}
          </p>
          <h1 className="mb-6 text-4xl font-bold sm:text-6xl">{project.name}</h1>
          <p className="text-lg leading-8 text-gray-400">{project.description}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold">Project overview</h2>
            <p className="leading-8 text-gray-400">{project.overview}</p>

            <h2 className="mb-4 mt-10 text-2xl font-bold">What I worked on</h2>
            <ul className="list-disc space-y-3 pl-5 leading-7 text-gray-400">
              {project.contributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </section>

          <aside className="rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200"
                >
                  {technology}
                </span>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Implementation snippet
              </p>
              <h2 className="mt-2 text-2xl font-bold">A look at the solution</h2>
            </div>
            <ExternalLink className="text-gray-500" size={20} />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 text-sm leading-7 text-cyan-200">
            <code>{project.snippet}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
