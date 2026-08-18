import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { SmartImage } from "@/components/ui/SmartImage";
import { IMAGE_SIZES } from "@/lib/image";

export type ProjectView = "grid" | "list";

interface ProjectCardProps {
  project: Project;
  index: number;
  view?: ProjectView;
}

export function ProjectCard({ project, index, view = "grid" }: ProjectCardProps) {
  if (view === "list") return <ProjectRow project={project} index={index} />;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
      className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:glow-accent"
    >
      <ProjectCardImage project={project} priority={index < 3} />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <header className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-lg font-bold leading-snug sm:text-xl">{project.title}</h3>
            {project.status && (
              <span className="shrink-0 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                {project.status}
              </span>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <Badge>{project.type}</Badge>
          {project.client && <Badge>{project.client}</Badge>}
        </div>

        <TechStackPreview techs={project.tech} />

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
          <Link
            to="/projects/$id"
            params={{ id: project.id }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
          >
            View details
            <ArrowRight className="size-4" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            {project.live && project.live !== "#" && (
              <IconLink href={project.live} label={`Open live site for ${project.title}`}>
                <ExternalLink className="size-4" />
              </IconLink>
            )}
            {project.github && (
              <IconLink href={project.github} label={`Open GitHub repo for ${project.title}`}>
                <Github className="size-4" />
              </IconLink>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.03 }}
      className="group glass grid grid-cols-1 gap-5 overflow-hidden rounded-3xl border border-border/60 p-4 transition-all duration-300 hover:border-accent/40 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center"
    >
      <div className="overflow-hidden rounded-2xl">
        <ProjectCardImage project={project} compact priority={index < 2} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold">{project.title}</h3>
          <Badge>{project.type}</Badge>
          {project.client && <Badge>{project.client}</Badge>}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-3">
          <TechStackPreview techs={project.tech} limit={5} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Link
            to="/projects/$id"
            params={{ id: project.id }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
          >
            View details
            <ArrowRight className="size-4" />
          </Link>
          {project.live && project.live !== "#" && (
            <IconLink href={project.live} label={`Open live site for ${project.title}`}>
              <ExternalLink className="size-4" />
            </IconLink>
          )}
          {project.github && (
            <IconLink href={project.github} label={`Open GitHub repo for ${project.title}`}>
              <Github className="size-4" />
            </IconLink>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-secondary/40 text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
    >
      {children}
    </a>
  );
}

interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
      {children}
    </span>
  );
}


interface ProjectCardImageProps {
  project: Project;
  compact?: boolean;
  /** First few cards are close to the fold — load them eagerly. */
  priority?: boolean;
}

export function ProjectCardImage({
  project,
  compact = false,
  priority = false,
}: ProjectCardImageProps) {
  return (
    <div className={`relative overflow-hidden ${compact ? "h-36" : "h-48"}`}>
      <SmartImage
        src={project.image}
        alt={`${project.title} preview`}
        width={compact ? 220 : 384}
        height={compact ? 144 : 192}
        sizes={compact ? IMAGE_SIZES.thumb : IMAGE_SIZES.card}
        priority={priority}
        fallbackStyle={project.gradient}
        className="size-full"
        imgClassName="transition-transform duration-500 group-hover:scale-[1.06]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      <span className="absolute left-3 top-3 rounded-full border border-border/40 bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
        {project.category}
      </span>
    </div>
  );
}

interface TechStackPreviewProps {
  techs: string[];
  limit?: number;
}

export function TechStackPreview({ techs, limit = 3 }: TechStackPreviewProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {techs.slice(0, limit).map((tech) => (
        <span
          key={tech}
          className="rounded-md border border-border/50 bg-background/50 px-2 py-1 text-xs text-muted-foreground"
        >
          {tech}
        </span>
      ))}
      {techs.length > limit && (
        <span className="rounded-md border border-accent/20 bg-background/50 px-2 py-1 text-xs text-accent">
          +{techs.length - limit}
        </span>
      )}
    </div>
  );
}
