import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_WORDS = ["Role", "Security", "Researcher", "Software", "Engineer"];

function HoverWord({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(ref.current, {
      y: -5,
      scale: 1.035,
      letterSpacing: muted ? "0.02em" : "-0.045em",
      color: "var(--ink)",
      duration: 0.24,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(ref.current, {
      y: 0,
      scale: 1,
      letterSpacing: muted ? "0.01em" : "-0.055em",
      color: muted ? "var(--muted)" : "var(--ink)",
      duration: 0.55,
      ease: "elastic.out(1, 0.35)",
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={ref}
      className="hero-hover-word"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        willChange: "transform, letter-spacing, color",
        cursor: "default",
        color: muted ? "var(--muted)" : "var(--ink)",
      }}
    >
      {children}
    </span>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([".hero-line", ".hero-meta", ".hero-note", ".hero-mark"], { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".hero-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.105,
          duration: 0.86,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        [".hero-meta", ".hero-note", ".hero-mark"],
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.62,
          ease: "power3.out",
          delay: 0.52,
        }
      );

      gsap.to(boardRef.current, {
        y: "-12vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      gsap.to(metaRef.current, {
        y: "6vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "grid",
        alignItems: "center",
        padding: "clamp(20px, 5.5vw, 120px)",
        paddingTop: "clamp(64px, 10vw, 140px)",
        paddingBottom: "clamp(84px, 11vw, 120px)",
        overflow: "hidden",
      }}
    >
      <div
        className="hero-mark"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(20px, 5vw, 72px)",
          right: "clamp(20px, 5.5vw, 120px)",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0,
        }}
      >
        andika0x01 / archive
      </div>

      <div ref={boardRef} data-velocity-skew style={{ position: "relative", zIndex: 1, willChange: "transform" }}>
        <div style={{ overflow: "hidden" }}>
          <div
            className="hero-line"
            style={{
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: "clamp(14px, 2.4vw, 34px)",
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: 1.1,
              opacity: 0,
            }}
          >
            <HoverWord muted>{HERO_WORDS[0]}</HoverWord>
          </div>
        </div>

        <div style={{ overflow: "hidden" }}>
          <h1
            className="hero-line"
            style={{
              margin: "clamp(0.3rem, 1vw, 0.8rem) 0 0",
              fontSize: "clamp(54px, 14vw, 240px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.86,
              opacity: 0,
            }}
          >
            <HoverWord>{HERO_WORDS[1]}</HoverWord>
          </h1>
        </div>

        <div style={{ overflow: "hidden" }}>
          <h1
            className="hero-line"
            style={{
              margin: 0,
              fontSize: "clamp(54px, 14vw, 240px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.86,
              opacity: 0,
            }}
          >
            <HoverWord>{HERO_WORDS[2]}</HoverWord>
          </h1>
        </div>

        <div style={{ overflow: "hidden" }}>
          <p
            className="hero-line"
            style={{
              margin: "clamp(0.8rem, 2vw, 1.8rem) 0 0",
              fontSize: "clamp(26px, 6vw, 98px)",
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              opacity: 0,
            }}
          >
            <HoverWord muted>Software Engineer</HoverWord>
          </p>
        </div>
      </div>

      <div
        ref={metaRef}
        style={{
          position: "absolute",
          left: "clamp(24px, 6vw, 120px)",
          right: "clamp(24px, 6vw, 120px)",
          bottom: "clamp(28px, 6vw, 86px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 520px)",
          gap: "clamp(1.5rem, 5vw, 5rem)",
          alignItems: "end",
          zIndex: 2,
          willChange: "transform",
        }}
        className="hero-meta-grid"
      >
        <div className="hero-meta" style={{ opacity: 0, fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "clamp(11px, 1vw, 13px)", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.8 }}>
          <div>Andika Dinata</div>
          <div>CS student · ITERA</div>
          <div>Bandar Lampung, Indonesia</div>
        </div>

        <p
          className="hero-note"
          style={{
            margin: 0,
            opacity: 0,
            fontSize: "clamp(16px, 2.1vw, 28px)",
            fontWeight: 300,
            color: "var(--muted)",
            lineHeight: 1.48,
            maxWidth: 560,
          }}
        >
          I build software to understand systems. I study security to understand how systems fail.
        </p>
      </div>
    </section>
  );
}
