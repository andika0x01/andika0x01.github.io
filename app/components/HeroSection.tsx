import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrambleHover } from "../hooks/useScrambleHover";

gsap.registerPlugin(ScrollTrigger);

// Uppercase alphabet for the scramble effect
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Flattened char sequence matching DOM order: ANDIKA (0-5) + DINATA (6-11)
const ALL_CHARS = "ANDIKADINATA";

/**
 * Interactive Pluckable Elastic String for Scroll Indicator.
 * Bends when mouse brushes past it and oscillates back with damped wave physics.
 */
function PluckableScrollLine({ lineRef }: { lineRef: React.RefObject<SVGSVGElement | null> }) {
  const pathRef = useRef<SVGPathElement>(null);
  const cxState = useRef({ cx: 12 });

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseLocalX = e.clientX - rect.left;
    const clampedX = Math.max(0, Math.min(24, mouseLocalX));

    gsap.killTweensOf(cxState.current);
    cxState.current.cx = clampedX;
    if (pathRef.current) {
      pathRef.current.setAttribute("d", `M 12 0 Q ${clampedX} 22 12 44`);
    }
  };

  const onMouseLeave = () => {
    gsap.killTweensOf(cxState.current);
    gsap.to(cxState.current, {
      cx: 12,
      duration: 0.95,
      ease: "elastic.out(1.4, 0.25)",
      onUpdate: () => {
        if (pathRef.current) {
          pathRef.current.setAttribute("d", `M 12 0 Q ${cxState.current.cx} 22 12 44`);
        }
      },
    });
  };

  return (
    <svg
      ref={lineRef}
      width="24"
      height="44"
      viewBox="0 0 24 44"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        overflow: "visible",
        cursor: "grab",
        opacity: 0.4,
        marginLeft: "-6px",
      }}
    >
      <path ref={pathRef} d="M 12 0 Q 12 22 12 44" fill="none" stroke="var(--muted)" strokeWidth="1" />
    </svg>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameBlockRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<SVGSVGElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);

  // Meta items hover scramble hooks
  const { trigger: triggerCityScramble, ref: cityRef } = useScrambleHover<HTMLSpanElement>("Bandar Lampung, ID", { duration: 0.25 });
  const { trigger: triggerCampusScramble, ref: campusRef } = useScrambleHover<HTMLSpanElement>("Sumatera Institute of Technology", { duration: 0.25 });
  const { trigger: triggerRoleScramble, ref: roleRef } = useScrambleHover<HTMLSpanElement>("Software Engineer", { duration: 0.22 });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── Reduced-motion fallback: show everything immediately ──────────
      if (reduced) {
        gsap.set(".char", { opacity: 1 });
        gsap.set([taglineRef.current, metaRef.current, scrollLineRef.current, scrollTextRef.current], {
          opacity: 1,
          y: 0,
          scaleY: 1,
        });
        return;
      }

      // ── Scramble effect on name chars ─────────────────────────────────
      const charEls = sectionRef.current?.querySelectorAll(".char");
      const STAGGER = 0.08;
      const SCRAMBLE = 0.65;
      const totalTime = (ALL_CHARS.length - 1) * STAGGER + SCRAMBLE;

      charEls?.forEach((el, i) => {
        const finalChar = ALL_CHARS[i];
        const delay = i * STAGGER;

        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.03, delay, ease: "none" });

        gsap.to(
          {},
          {
            duration: SCRAMBLE,
            delay,
            onUpdate() {
              const p = this.progress();
              (el as HTMLElement).textContent = p < 0.78 ? ALPHA[Math.floor(Math.random() * ALPHA.length)] : finalChar;
            },
            onComplete: () => {
              (el as HTMLElement).textContent = finalChar;
            },
          }
        );
      });

      // ── Tagline — slides in after scramble finishes ───────────────────
      gsap.fromTo(taglineRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: totalTime });

      // ── Meta ──────────────────────────────────────────────────────────
      gsap.fromTo(metaRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: totalTime + 0.22 });

      // ── Scroll indicator: line draws down, then text appears ──────────
      gsap.fromTo(
        scrollLineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.85, ease: "power2.inOut", delay: totalTime + 0.42 }
      );
      gsap.fromTo(scrollTextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: totalTime + 1.15 });

      // ── Subtle breathing on name block after reveal ───────────────────
      gsap.to(nameBlockRef.current, {
        scaleX: 1.0035,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: totalTime + 0.5,
        transformOrigin: "left center",
      });

      // ── Scroll parallax: name block drifts up 1.8× scroll speed ──────
      gsap.to(nameBlockRef.current, {
        y: "-18vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /** Kinetic letter scatter on click / active hover */
  const handleCharScatter = (e: React.MouseEvent<HTMLSpanElement> | React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dx = gsap.utils.random(-24, 24);
    const dy = gsap.utils.random(-28, 28);
    const rot = gsap.utils.random(-12, 12);

    gsap.to(el, {
      x: dx,
      y: dy,
      rotation: rot,
      duration: 0.1,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.85,
          ease: "elastic.out(1.2, 0.35)",
        });
      },
    });
  };

  /** Chiasmus Tagline word focus & mirror hover */
  const handleWordEnter = (wordType: "code" | "think" | "other") => {
    if (wordType === "code") {
      const els = sectionRef.current?.querySelectorAll(".tagline-code");
      els?.forEach((el) => {
        gsap.to(el, { color: "var(--ink)", y: -1.5, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      });
    } else if (wordType === "think") {
      const els = sectionRef.current?.querySelectorAll(".tagline-think");
      els?.forEach((el) => {
        gsap.to(el, { color: "var(--ink)", y: -1.5, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      });
    }
  };

  const handleWordLeave = (wordType: "code" | "think" | "other") => {
    if (wordType === "code") {
      const els = sectionRef.current?.querySelectorAll(".tagline-code");
      els?.forEach((el) => {
        gsap.to(el, { color: "var(--muted)", y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
    } else if (wordType === "think") {
      const els = sectionRef.current?.querySelectorAll(".tagline-think");
      els?.forEach((el) => {
        gsap.to(el, { color: "var(--muted)", y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
    }
  };

  /** Scroll indicator ripple wave on hover */
  const handleScrollHover = () => {
    const chars = scrollTextRef.current?.querySelectorAll(".scroll-char");
    if (!chars) return;
    gsap.to(chars, {
      y: -3,
      duration: 0.15,
      stagger: 0.035,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      overwrite: "auto",
    });
  };

  const handleScrollDown = () => {
    const nextSection = document.querySelectorAll("section")[1];
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  /** Render a word as individual scramble-able char spans */
  const renderWord = (word: string, className: string, ariaLabel: string) => (
    <div className={className} aria-label={ariaLabel} style={{ lineHeight: 0.88 }}>
      {word.split("").map((char, i) => (
        <span
          key={i}
          className="char"
          onPointerDown={handleCharScatter}
          onMouseEnter={(e) => {
            if (e.buttons > 0) handleCharScatter(e);
          }}
          style={{
            display: "inline-block",
            fontSize: "clamp(46px, 16.5vw, 340px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            opacity: 0,
            cursor: "pointer",
            userSelect: "none",
            willChange: "transform",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(20px, 5.5vw, 120px)",
        paddingTop: "clamp(64px, 10vw, 140px)",
        paddingBottom: "clamp(84px, 11vw, 120px)",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Name block (receives scroll parallax & kinetic velocity skew) ── */}
      <div ref={nameBlockRef} data-velocity-skew style={{ position: "relative", zIndex: 1, willChange: "transform" }}>
        {renderWord("ANDIKA", "firstname", "ANDIKA")}
        {renderWord("DINATA", "lastname", "DINATA")}
      </div>

      {/* ── Tagline (Chiasmus Mirror Resonance & Word Optical Focus) ─────── */}
      <p
        ref={taglineRef}
        style={{
          marginTop: "clamp(1.25rem, 3vw, 3.25rem)",
          fontSize: "clamp(16px, 3.8vw, 28px)",
          fontWeight: 300,
          color: "var(--muted)",
          lineHeight: 1.5,
          maxWidth: "min(540px, 100%)",
          opacity: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span>I write </span>
        <span
          className="tagline-code"
          onMouseEnter={() => handleWordEnter("code")}
          onMouseLeave={() => handleWordLeave("code")}
          style={{ display: "inline-block", cursor: "default", transition: "color 0.2s ease" }}
        >
          code
        </span>
        <span> to </span>
        <span
          className="tagline-think"
          onMouseEnter={() => handleWordEnter("think")}
          onMouseLeave={() => handleWordLeave("think")}
          style={{ display: "inline-block", cursor: "default", transition: "color 0.2s ease" }}
        >
          think.
        </span>
        <br />
        <span>I </span>
        <span
          className="tagline-think"
          onMouseEnter={() => handleWordEnter("think")}
          onMouseLeave={() => handleWordLeave("think")}
          style={{ display: "inline-block", cursor: "default", transition: "color 0.2s ease" }}
        >
          think
        </span>
        <span> to write better </span>
        <span
          className="tagline-code"
          onMouseEnter={() => handleWordEnter("code")}
          onMouseLeave={() => handleWordLeave("code")}
          style={{ display: "inline-block", cursor: "default", transition: "color 0.2s ease" }}
        >
          code.
        </span>
      </p>

      {/* ── Meta (Interactive Segment Scramble & Clean Geo-Coordinates) ─── */}
      <div
        ref={metaRef}
        style={{
          marginTop: "clamp(0.75rem, 1.8vw, 1.35rem)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.35rem 0.65rem",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "clamp(11px, 2.4vw, 13px)",
          color: "var(--muted)",
          letterSpacing: "0.04em",
          opacity: 0,
          position: "relative",
          zIndex: 1,
          maxWidth: "100%",
        }}
      >
        <span
          ref={cityRef}
          onMouseEnter={() => triggerCityScramble()}
          style={{
            whiteSpace: "nowrap",
            cursor: "default",
          }}
        >
          Bandar Lampung, ID
        </span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span
          ref={campusRef}
          onMouseEnter={() => triggerCampusScramble()}
          style={{ cursor: "default" }}
        >
          Sumatera Institute of Technology
        </span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span
          ref={roleRef}
          onMouseEnter={() => triggerRoleScramble()}
          style={{ whiteSpace: "nowrap", cursor: "default" }}
        >
          Software Engineer
        </span>
      </div>

      {/* ── Scroll indicator with Pluckable String & Kinetic Wave ───────── */}
      <div
        onClick={handleScrollDown}
        onMouseEnter={handleScrollHover}
        role="button"
        tabIndex={0}
        aria-label="Scroll to About section"
        style={{
          position: "absolute",
          bottom: "clamp(20px, 3.5vw, 44px)",
          left: "clamp(20px, 5.5vw, 120px)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        <PluckableScrollLine lineRef={scrollLineRef} />
        <span
          ref={scrollTextRef}
          style={{
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: "10px",
            color: "var(--muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0,
            userSelect: "none",
            display: "inline-flex",
            gap: "0.05em",
          }}
        >
          {"scroll".split("").map((c, i) => (
            <span key={i} className="scroll-char" style={{ display: "inline-block" }}>
              {c}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
