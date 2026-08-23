import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "01/05 HERO" },
  { id: "about", label: "02/05 ABOUT" },
  { id: "skills", label: "03/05 SKILLS" },
  { id: "projects", label: "04/05 WORK" },
  { id: "connect", label: "05/05 CONNECT" },
];

/**
 * Minimalist System HUD overlay.
 * Clean, quiet monospace indicators: Section tracker, live Hex Address, and vertical meter.
 */
export function SystemHUD() {
  const [hexAddress, setHexAddress] = useState("0x0000");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("01/05 HERO");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;
        setScrollProgress(progress);

        // Calculate Hex memory offset (0x0000 to 0xFFFF)
        const hexVal = Math.floor(progress * 65535)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0");
        setHexAddress(`0x${hexVal}`);

        // Detect current section in viewport
        const sections = document.querySelectorAll("section");
        let active = SECTIONS[0].label;
        sections.forEach((sec, idx) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.15) {
            if (SECTIONS[idx]) {
              active = SECTIONS[idx].label;
            }
          }
        });
        setCurrentSection(active);

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-hidden="true"
      style={{
        position: "fixed",
        right: "clamp(16px, 3.5vw, 48px)",
        bottom: "clamp(20px, 3.5vw, 44px)",
        zIndex: 50,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        fontSize: "10px",
        letterSpacing: "0.14em",
        color: "var(--muted)",
        opacity: 0.75,
        userSelect: "none",
      }}
    >
      {/* Active Section Label */}
      <span className="hidden sm:inline-block" style={{ opacity: 0.7 }}>
        {currentSection}
      </span>

      <span className="hidden sm:inline-block" style={{ opacity: 0.3 }}>
        ·
      </span>

      {/* Hex Address Counter */}
      <span>
        ADDR <span style={{ color: "var(--ink)", fontWeight: 500 }}>{hexAddress}</span>
      </span>

      {/* Minimal vertical progress track */}
      <div
        style={{
          width: "2px",
          height: "24px",
          background: "rgba(10, 10, 10, 0.08)",
          borderRadius: "1px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--ink)",
            transformOrigin: "top",
            transform: `scaleY(${scrollProgress})`,
            transition: "transform 0.05s linear",
          }}
        />
      </div>
    </aside>
  );
}
