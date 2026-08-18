import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { projects } from "@/data";
import { ExternalLink, Github, ArrowLeft, Code2 } from "lucide-react";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { TechStack } from "@/components/ui/TechStack";
import { Badge } from "@/components/ui/ProjectCard";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetailSkeleton } from "@/components/ui/Skeletons";

export const Route = createFileRoute("/projects/$id")({
  head: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    return {
      meta: [
        { title: `${project?.title || "Project"} | Marketplace Systems Architect` },
        {
          name: "description",
          content: project?.description || "Project details",
        },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.id}` }],
    };
  },
  component: ProjectDetail,
  pendingComponent: ProjectDetailSkeleton,
});

export function ProjectDetail() {
  const { id } = Route.useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <h1 className="text-3xl font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-accent hover:underline flex items-center gap-2">
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasLiveSite = project.live !== "#";
  const projectIndex = projects.findIndex((p) => p.id === id);
  const nextProject = projects[projectIndex + 1];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 sm:pt-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <ProjectHero project={project}>
            {/* Back Button */}
            <Link
              to="/projects"
              className="absolute left-4 top-4 z-10 sm:left-5 sm:top-6 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-background transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </ProjectHero>

          {/* Content */}
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge>{project.category}</Badge>
                  <Badge>{project.type}</Badge>
                  {project.status && <Badge>{project.status}</Badge>}
                </div>
                <h1 className="mb-4 break-words text-3xl font-bold sm:text-4xl md:text-5xl">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.description}</p>
              </div>

              {/* Meta Info Grid */}
              <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {project.client && (
                  <div className="panel">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">CLIENT</div>
                    <div className="text-lg font-semibold">{project.client}</div>
                  </div>
                )}
                {project.database && (
                  <div className="panel">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">DATABASE</div>
                    <div className="text-lg font-semibold">{project.database}</div>
                  </div>
                )}
                <div className="panel">
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="size-3.5 text-accent" />
                    <div className="text-xs font-semibold text-muted-foreground">TECH STACK</div>
                  </div>
                  <div className="text-lg font-semibold">{project.tech.length} Tools</div>
                </div>
                <div className="panel">
                  <div className="flex items-center gap-2 mb-1">
                    <ExternalLink className="size-3.5 text-accent" />
                    <div className="text-xs font-semibold text-muted-foreground">STATUS</div>
                  </div>
                  <div className="text-lg font-semibold">{hasLiveSite ? "Live" : "Archived"}</div>
                </div>
              </div>

              {/* Links */}
              <div className="mb-12 flex flex-wrap gap-4">
                {hasLiveSite && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-accent text-background px-6 py-3 font-semibold transition-all hover:shadow-lg hover:shadow-accent/50 hover:-translate-y-0.5"
                  >
                    <ExternalLink className="size-4" />
                    Visit Live Site
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-6 py-3 font-semibold transition-all hover:border-accent/50 hover:text-accent"
                  >
                    <Github className="size-4" />
                    View Source Code
                  </a>
                )}
              </div>

              {/* Tech Stack */}
              <TechStack techs={project.tech} className="mb-12" />

              {/* Navigation */}
              <div className="border-t border-border pt-12">
                <div className="grid gap-6 sm:grid-cols-2">
                  {prevProject ? (
                    <Link
                      to="/projects/$id"
                      params={{ id: prevProject.id }}
                      className="group glass rounded-xl border border-border p-6 transition-all hover:border-accent/50 hover:glow-accent"
                    >
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        ← PREVIOUS PROJECT
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                        {prevProject.title}
                      </h3>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextProject ? (
                    <Link
                      to="/projects/$id"
                      params={{ id: nextProject.id }}
                      className="group glass rounded-xl border border-border p-6 transition-all hover:border-accent/50 hover:glow-accent text-right sm:text-left"
                    >
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        NEXT PROJECT →
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-accent transition-colors">
                        {nextProject.title}
                      </h3>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
