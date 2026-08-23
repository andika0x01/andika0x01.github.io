import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#2b7489",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Java: "#b07219",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Astro: "#ff5a03",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  PHP: "#4F5D95",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Lua: "#000080",
  Zig: "#ec915c",
  "C#": "#178600",
};

function langColor(lang: string | null) {
  if (!lang) return "var(--muted)";
  return LANG_COLORS[lang] ?? "var(--muted)";
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!projects.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".project-row"], { opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        labelRef.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      const rows = sectionRef.current?.querySelectorAll(".project-row");
      rows?.forEach((row) => {
        gsap.fromTo(
          row,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  if (!projects.length) return null;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)",
        maxWidth: "min(900px, 100%)",
      }}
    >
      {/* Eyebrow label */}
      <span
        ref={labelRef}
        style={{
          display: "block",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "clamp(1.5rem, 3vw, 3rem)",
          opacity: 0,
        }}
      >
        Projects
      </span>

      {/* Project list */}
      <div>
        {projects.map((project, i) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-row"
            style={{
              display: "block",
              paddingTop: i === 0 ? 0 : "clamp(1.25rem, 2.5vw, 2.25rem)",
              paddingBottom: "clamp(1.25rem, 2.5vw, 2.25rem)",
              borderBottom:
                i === projects.length - 1
                  ? "none"
                  : "1px solid rgba(10,10,10,0.07)",
              textDecoration: "none",
              color: "inherit",
              opacity: 0,
            }}
          >
            {/* Row header */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.4rem 1rem",
                marginBottom: project.description ? "0.4rem" : 0,
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: "clamp(14px, 1.4vw, 18px)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                }}
              >
                {project.name}
              </span>

              {/* Language + stars */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: "clamp(10px, 1vw, 12px)",
                  color: "var(--muted)",
                }}
              >
                {project.language && (
                  <>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: langColor(project.language),
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {project.language}
                  </>
                )}
                {project.stars > 0 && (
                  <span style={{ opacity: 0.6 }}>· ★ {project.stars}</span>
                )}
              </span>
            </div>

            {/* Description */}
            {project.description && (
              <p
                style={{
                  fontSize: "clamp(13px, 1.3vw, 16px)",
                  color: "var(--muted)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {project.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
