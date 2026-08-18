import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Contact } from "@/components/sections/Contact";
import { PageSkeleton } from "@/components/ui/Skeletons";

const channels = [
  { Icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
  { Icon: MapPin, label: "Based in", value: "Cairo · Remote worldwide" },
  { Icon: Clock, label: "Response time", value: "Within 24 hours" },
];

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Start a Marketplace Project" },
      {
        name: "description",
        content:
          "Tell me about your marketplace, platform or commerce system and I'll come back with a concrete plan within 24 hours.",
      },
      { property: "og:title", content: "Contact — Start a Marketplace Project" },
      {
        property: "og:description",
        content: "Send a brief and get a concrete architecture and delivery plan back.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
  pendingComponent: PageSkeleton,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <PageHeader
          kicker="Available for new work"
          title="Get in Touch"
          subtitle="Share the scope, the stack and the timeline — you'll get an honest answer, not a sales pitch."
        />

        <section className="px-5 pb-4">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
            {channels.map(({ Icon, label, value, href }, i) => (
              <Reveal key={label} delay={i * 0.07}>
                <div className="glass h-full rounded-2xl p-6">
                  <Icon className="size-5 text-gold" />
                  <div className="mt-4 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    {label}
                  </div>
                  {href ? (
                    <a href={href} className="mt-1 block font-semibold hover:text-gold">
                      {value}
                    </a>
                  ) : (
                    <div className="mt-1 font-semibold">{value}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Contact showHeading={false} />
      </main>
      <Footer />
    </div>
  );
}
