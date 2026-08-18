import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Experience } from "@/components/sections/Experience";
import { experience } from "@/data";
import { PageSkeleton } from "@/components/ui/Skeletons";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Marketplace Systems Architect" },
      {
        name: "description",
        content:
          "A decade of roles shipping multi-vendor marketplaces, .NET microservices, real-time telemetry and multi-tenant commerce platforms.",
      },
      { property: "og:title", content: "Experience — Marketplace Systems Architect" },
      {
        property: "og:description",
        content:
          "Full timeline of roles, responsibilities and measurable outcomes across marketplace and commerce engineering.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/experience" }],
  }),
  component: ExperiencePage,
  pendingComponent: PageSkeleton,
});

function ExperiencePage() {
  const roles = experience.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          kicker={`${roles} roles · 10+ years`}
          title="Experience"
          subtitle="The full timeline — what I owned, what I built and what it moved."
        />

        <Experience showHeading={false} />

        <section className="px-5 pb-24">
          <Reveal>
            <div className="mx-auto flex max-w-5xl flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition-colors hover:border-gold/50 hover:text-gold"
              >
                See the work
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-gold-foreground transition-transform hover:scale-[1.02]"
              >
                Work with me
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
