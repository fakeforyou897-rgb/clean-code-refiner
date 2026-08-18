import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { projects, projectFilters } from "@/data";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard, type ProjectView } from "@/components/ui/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectGridSkeleton, PageSkeleton } from "@/components/ui/Skeletons";
import { Search, ChevronLeft, ChevronRight, LayoutGrid, Rows3, X, ArrowUpDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "All Projects | Marketplace Systems Architect" },
      {
        name: "description",
        content:
          "Browse every project: multi-vendor marketplaces, e-commerce platforms and high-scale systems, with search, filters and sorting.",
      },
      { property: "og:title", content: "All Projects | Marketplace Systems Architect" },
      {
        property: "og:description",
        content:
          "Browse every project: multi-vendor marketplaces, e-commerce platforms and high-scale systems.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
  pendingComponent: PageSkeleton,
});

const SORTS = [
  { value: "default", label: "Featured" },
  { value: "az", label: "Title A–Z" },
  { value: "za", label: "Title Z–A" },
  { value: "category", label: "Category" },
  { value: "tech", label: "Most tech" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Keeps typing responsive: filtering runs at low priority and the grid shows
  // skeletons for the frame(s) where results are still catching up.
  const deferredQuery = useDeferredValue(searchQuery);
  const isFiltering = deferredQuery !== searchQuery;
  const [sort, setSort] = useState<SortValue>("default");
  const [view, setView] = useState<ProjectView>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = view === "grid" ? 9 : 6;

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    for (const p of projects) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, []);

  const filtered = useMemo(() => {
    let result = filter === "All" ? projects : projects.filter((p) => p.category === filter);

    const query = deferredQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.client?.toLowerCase().includes(query) ?? false) ||
          p.tech.some((t) => t.toLowerCase().includes(query)),
      );
    }

    const sorted = [...result];
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "za") sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "category")
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    if (sort === "tech") sorted.sort((a, b) => b.tech.length - a.tech.length);
    return sorted;
  }, [filter, deferredQuery, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, sort, view]);

  const page = Math.min(currentPage, totalPages);
  const paginatedProjects = filtered.slice((page - 1) * perPage, page * perPage);
  const hasActiveFilters = filter !== "All" || searchQuery.trim().length > 0 || sort !== "default";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <section className="pb-16 pt-28 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <header className="mb-10 max-w-2xl">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Portfolio
                </span>
                <h1 className="mt-3 break-words text-3xl font-bold sm:text-4xl md:text-5xl">All Projects</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Marketplaces, storefronts and dashboards — search, filter and sort the full
                  catalogue.
                </p>
              </header>
            </Reveal>

            {/* Toolbar: search + sort + view, all in one line on desktop */}
            <div className="sticky top-24 z-20 -mx-5 mb-6 px-5 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <div className="glass grid grid-cols-1 gap-3 rounded-2xl border border-border/60 p-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
                <div className="relative min-w-0">
                  <label htmlFor="project-search" className="sr-only">
                    Search projects
                  </label>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="project-search"
                    type="search"
                    placeholder="Search by name, tech, client…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-secondary/40 pl-10 pr-9 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:text-accent"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="project-sort" className="sr-only">
                    Sort projects
                  </label>
                  <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
                    <SelectTrigger
                      id="project-sort"
                      aria-label="Sort projects"
                      className="h-11 w-full gap-2 rounded-xl border-border bg-secondary/40 px-3.5 text-sm font-medium text-foreground shadow-none transition-all hover:border-accent/40 focus:border-accent/50 focus:ring-1 focus:ring-accent/50 data-[state=open]:border-accent/50 md:w-48"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap text-left">
                        <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/70">
                      {SORTS.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="cursor-pointer rounded-lg text-sm focus:bg-accent/10 focus:text-accent"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  role="group"
                  aria-label="View mode"
                  className="flex h-11 shrink-0 items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1"
                >
                  <ViewButton
                    active={view === "grid"}
                    onClick={() => setView("grid")}
                    label="Grid view"
                  >
                    <LayoutGrid className="size-4" />
                  </ViewButton>
                  <ViewButton
                    active={view === "list"}
                    onClick={() => setView("list")}
                    label="List view"
                  >
                    <Rows3 className="size-4" />
                  </ViewButton>
                </div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {projectFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    filter === f
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-secondary/40 text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  {f}
                  {counts[f] != null && (
                    <span className="ml-1.5 text-xs opacity-70">{counts[f]}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "project" : "projects"}
                {totalPages > 1 && ` · page ${page} of ${totalPages}`}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilter("All");
                    setSearchQuery("");
                    setSort("default");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-semibold transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <X className="size-3.5" />
                  Reset
                </button>
              )}
            </div>

            {isFiltering ? (
              <ProjectGridSkeleton count={perPage} view={view} />
            ) : paginatedProjects.length > 0 ? (
              <>
                <motion.div
                  layout
                  className={
                    view === "grid"
                      ? "mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                      : "mb-12 flex flex-col gap-4"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProjects.map((project, index) => (
                      <ProjectCard key={project.id} project={project} index={index} view={view} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="flex flex-wrap items-center justify-center gap-3"
                  >
                    <button
                      onClick={() => setCurrentPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-accent/50 hover:enabled:text-accent"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          aria-current={p === page ? "page" : undefined}
                          className={`size-10 rounded-xl text-sm font-semibold transition-all ${
                            p === page
                              ? "bg-accent text-accent-foreground"
                              : "border border-border bg-secondary/40 text-muted-foreground hover:border-accent/50 hover:text-accent"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-accent/50 hover:enabled:text-accent"
                    >
                      Next
                      <ChevronRight className="size-4" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <EmptyState message="No projects found matching your search" />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex size-9 items-center justify-center rounded-lg transition-all ${
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
