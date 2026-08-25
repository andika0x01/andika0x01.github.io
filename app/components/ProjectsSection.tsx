import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrambleHover } from "../hooks/useScrambleHover";
import { motionSystem, revealLabel, revealList } from "../lib/motionSystem";

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
  const { ref: labelRef, onMouseEnter: onLabelHover } = useScrambleHover<HTMLSpanElement>("Projects");
  const inspectorRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<{ project: Project; index: number } | null>(null);
  const leaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!projects.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".project-row"], { opacity: 1, x: 0 });
        gsap.set(".project-divider", { scaleX: 1 });
        return;
      }

      revealLabel(labelRef.current, labelRef.current);

      const rows = sectionRef.current?.querySelectorAll(".project-row");
      rows?.forEach((row) => {
        const divider = row.querySelector(".project-divider");

        // Row slide-in
        revealList(row, row, "top 88%");

        // Kinetic line-draw on divider
        if (divider) {
          gsap.fromTo(divider, motionSystem.divider.from, {
            ...motionSystem.divider.to,
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  // Floating inspector cursor tracking
  useEffect(() => {
    if (!inspectorRef.current || window.matchMedia("(hover: none)").matches) return;

    const el = inspectorRef.current;
    const setX = gsap.quickTo(el, "x", { duration: 0.2, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.2, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      setX(e.clientX + 16);
      setY(e.clientY + 16);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRowEnter = (project: Project, index: number) => {
    // Clear any pending leave timeout
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    setActiveProject({ project, index });

    const rows = sectionRef.current?.querySelectorAll<HTMLElement>(".project-row");
    rows?.forEach((row, i) => {
      const divider = row.querySelector<HTMLElement>(".project-divider");
      if (i === index) {
        gsap.to(row, motionSystem.hoverFocus.active);
        if (divider) gsap.to(divider, { opacity: 1, background: "rgba(10,10,10,0.22)", duration: 0.22, overwrite: "auto" });
      } else {
        gsap.to(row, motionSystem.hoverFocus.inactive);
        if (divider) gsap.to(divider, { opacity: 0.3, background: "rgba(10,10,10,0.06)", duration: 0.22, overwrite: "auto" });
      }
    });

    if (inspectorRef.current) {
      gsap.to(inspectorRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleRowLeave = () => {
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
    }

    // Debounce leave slightly to avoid glitching when jumping between rows
    leaveTimerRef.current = window.setTimeout(() => {
      setActiveProject(null);

      const rows = sectionRef.current?.querySelectorAll<HTMLElement>(".project-row");
      rows?.forEach((row) => {
        const divider = row.querySelector<HTMLElement>(".project-divider");
        gsap.to(row, motionSystem.hoverFocus.reset);
        if (divider) gsap.to(divider, { opacity: 1, background: "rgba(10,10,10,0.08)", duration: 0.3, overwrite: "auto" });
      });

      if (inspectorRef.current) {
        gsap.to(inspectorRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.18,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
      leaveTimerRef.current = null;
    }, 20);
  };

  if (!projects.length) return null;

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)",
        maxWidth: "min(900px, 100%)",
        position: "relative",
      }}
    >
      {/* Floating Inspector HUD (Follows cursor) */}
      <div
        ref={inspectorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9990,
          opacity: 0,
          transform: "scale(0.95)",
          padding: "8px 14px",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(10, 10, 10, 0.12)",
          borderRadius: "3px",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "11px",
          color: "var(--ink)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
        className="hidden md:flex flex-col gap-1"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--muted)", fontSize: "10px" }}>[0x0{activeProject ? activeProject.index + 1 : 1}]</span>
          <span style={{ fontWeight: 600 }}>{activeProject?.project.name}</span>
          <span style={{ fontSize: "10px", color: "var(--muted)" }}>↗</span>
        </div>
        {activeProject?.project.language && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--muted)" }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: langColor(activeProject.project.language),
                display: "inline-block",
              }}
            />
            <span>{activeProject.project.language}</span>
            {activeProject.project.stars > 0 && <span>· ★ {activeProject.project.stars}</span>}
          </div>
        )}
      </div>

      {/* Eyebrow label */}
      <span
        ref={labelRef}
        onMouseEnter={onLabelHover}
        style={{
          display: "inline-block",
          cursor: "default",
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
            onMouseEnter={() => handleRowEnter(project, i)}
            onMouseLeave={handleRowLeave}
            style={{
              display: "block",
              position: "relative",
              paddingTop: i === 0 ? 0 : "clamp(1.25rem, 2.5vw, 2.25rem)",
              paddingBottom: "clamp(1.25rem, 2.5vw, 2.25rem)",
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
                {project.stars > 0 && <span style={{ opacity: 0.6 }}>· ★ {project.stars}</span>}
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

            {/* Kinetic Scroll-Triggered Line Draw Divider */}
            {i !== projects.length - 1 && (
              <div
                className="project-divider"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(10, 10, 10, 0.08)",
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  transition: "background 0.2s ease, opacity 0.2s ease",
                }}
              />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
