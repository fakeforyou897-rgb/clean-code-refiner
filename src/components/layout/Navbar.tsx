import { useEffect, useState } from "react";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LangToggle } from "@/components/ui/LangToggle";

type NavLink = {
  id: string;
  key: string;
  to: "/" | "/projects" | "/about" | "/skills" | "/experience" | "/contact";
};

const links: NavLink[] = [
  { id: "projects", key: "nav.projects", to: "/projects" },
  { id: "about", key: "nav.about", to: "/about" },
  { id: "skills", key: "nav.skills", to: "/skills" },
  { id: "experience", key: "nav.experience", to: "/experience" },
  { id: "contact", key: "nav.contact", to: "/contact" },
];

const socials = [
  { Icon: Github, href: "https://github.com/Mostafa-SAID7", label: "GitHub" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter, href: "#", label: "Twitter" },
];

function NavItem({
  link,
  onClick,
  className,
  children,
}: {
  link: NavLink;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={link.to}
      onClick={onClick}
      className={className}
      activeOptions={{ exact: link.to === "/" }}
      activeProps={{ "data-active": "true", "aria-current": "page" }}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { tr } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.5, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-3xl px-3 py-3 transition-all duration-300 ${
          scrolled ? "glass backdrop-blur-md" : "bg-card/40"
        }`}
      >
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-2xl bg-foreground/95 px-4 py-2.5 transition-transform hover:scale-[1.03]"
        >
          <span className="font-display text-xl font-black leading-none text-background">MS</span>
          <span className="text-[10px] font-bold uppercase leading-3 tracking-[0.2em] text-background/80">
            Market
            <br />
            Place
          </span>
        </Link>

        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          {links.map((l) => (
            <NavItem
              key={l.id}
              link={l}
              onClick={() => setOpen(false)}
              className="relative text-xs font-bold uppercase tracking-[0.18em] text-foreground/85 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:origin-left hover:after:scale-x-100 data-[active=true]:text-accent data-[active=true]:after:origin-left data-[active=true]:after:scale-x-100"
            >
              {tr(l.key)}
            </NavItem>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-border text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
          <LangToggle />
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mx-auto mt-2 flex max-h-[70vh] max-w-6xl flex-col gap-1 overflow-y-auto rounded-3xl border border-border bg-card p-3 shadow-2xl backdrop-blur-xl">
              {links.map((l) => (
                <NavItem
                  key={l.id}
                  link={l}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-start text-sm font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                >
                  {tr(l.key)}
                </NavItem>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
