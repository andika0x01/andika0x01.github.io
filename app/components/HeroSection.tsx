import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ambient background characters that drift slowly in the hero
const AMBIENT_ITEMS = [
  { char: "{}",  x: "75%", y: "8%",  size: "clamp(16px, 2vw, 28px)" },
  { char: "λ",   x: "84%", y: "22%", size: "clamp(14px, 1.8vw, 24px)" },
  { char: "∀",   x: "69%", y: "40%", size: "clamp(12px, 1.5vw, 20px)" },
  { char: "</>", x: "88%", y: "55%", size: "clamp(13px, 1.6vw, 22px)" },
  { char: "fn",  x: "62%", y: "15%", size: "clamp(11px, 1.3vw, 18px)" },
  { char: "⊕",   x: "91%", y: "33%", size: "clamp(18px, 2.2vw, 32px)" },
  { char: "=>",  x: "67%", y: "70%", size: "clamp(12px, 1.5vw, 20px)" },
  { char: "∃",   x: "79%", y: "78%", size: "clamp(16px, 1.9vw, 26px)" },
  { char: "::",  x: "57%", y: "87%", size: "clamp(20px, 2.5vw, 36px)" },
  { char: "[ ]", x: "93%", y: "63%", size: "clamp(13px, 1.6vw, 22px)" },
];

// Uppercase alphabet for the scramble effect
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Flattened char sequence matching DOM order: ANDIKA (0-5) + DINATA (6-11)
const ALL_CHARS = "ANDIKADINATA";

export function HeroSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const nameBlockRef  = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const metaRef       = useRef<HTMLDivElement>(null);
  const scrollLineRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  const ambientRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ── Reduced-motion fallback: show everything immediately ──────────
      if (reduced) {
        gsap.set(".char", { opacity: 1 });
        gsap.set(".ambient-char", { opacity: 0.04 });
        gsap.set(
          [taglineRef.current, metaRef.current, scrollLineRef.current, scrollTextRef.current],
          { opacity: 1, y: 0, scaleY: 1 }
        );
        return;
      }

      // ── Ambient chars fade in (background atmosphere) ─────────────────
      gsap.fromTo(
        ".ambient-char",
        { opacity: 0 },
        {
          opacity: () => gsap.utils.random(0.02, 0.05),
          duration: 2.2,
          stagger: { each: 0.1, from: "random" },
        }
      );

      // ── Scramble effect on name chars ─────────────────────────────────
      // Each char rapidly cycles random uppercase letters before locking
      // onto its real character, creating a codebreaker-style reveal.
      const charEls = sectionRef.current?.querySelectorAll(".char");
      const STAGGER   = 0.08;   // gap between each char starting
      const SCRAMBLE  = 0.65;   // how long each char scrambles
      const totalTime = (ALL_CHARS.length - 1) * STAGGER + SCRAMBLE;

      charEls?.forEach((el, i) => {
        const finalChar = ALL_CHARS[i];
        const delay     = i * STAGGER;

        // 1. Pop char into visibility (very fast)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.03, delay, ease: "none" });

        // 2. Scramble using empty-object tween for timing
        gsap.to({}, {
          duration: SCRAMBLE,
          delay,
          onUpdate() {
            const p = this.progress();
            // First 78% of duration: random letter; last 22%: lock to final
            (el as HTMLElement).textContent =
              p < 0.78
                ? ALPHA[Math.floor(Math.random() * ALPHA.length)]
                : finalChar;
          },
          onComplete: () => {
            (el as HTMLElement).textContent = finalChar;
          },
        });
      });

      // ── Tagline — slides in after scramble finishes ───────────────────
      gsap.fromTo(
        taglineRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: totalTime }
      );

      // ── Meta ──────────────────────────────────────────────────────────
      gsap.fromTo(
        metaRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: totalTime + 0.22 }
      );

      // ── Scroll indicator: line draws down, then text appears ──────────
      gsap.fromTo(
        scrollLineRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.85, ease: "power2.inOut", delay: totalTime + 0.42 }
      );
      gsap.fromTo(
        scrollTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: totalTime + 1.15 }
      );

      // ── Subtle breathing on name block after reveal ───────────────────
      // Very gentle scaleX oscillation — barely perceptible but keeps the
      // name feeling alive after the scramble settles.
      gsap.to(nameBlockRef.current, {
        scaleX: 1.0035,
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: totalTime + 0.5,
        transformOrigin: "left center",
      });

      // ── Ambient drift — continuous looping ───────────────────────────
      ambientRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          x: `random(-22, 22)`,
          y: `random(-32, 32)`,
          rotation: `random(-8, 8)`,
          duration: gsap.utils.random(14, 28),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 10),
        });
      });

      // ── Scroll parallax: name block drifts up 1.8× scroll speed ──────
      // Creates a cinematic "peeling away" as user scrolls into About.
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

  /** Render a word as individual scramble-able char spans */
  const renderWord = (word: string, className: string, ariaLabel: string) => (
    <div
      className={className}
      aria-label={ariaLabel}
      style={{ lineHeight: 0.88 }}
    >
      {word.split("").map((char, i) => (
        <span
          key={i}
          className="char"
          style={{
            display: "inline-block",
            fontSize: "clamp(72px, 20vw, 340px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            opacity: 0, // scramble effect makes it visible
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
        padding: "clamp(24px, 6vw, 120px)",
        paddingTop: "clamp(80px, 10vw, 160px)",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient floating characters ─────────────────── */}
      {AMBIENT_ITEMS.map((item, i) => (
        <span
          key={i}
          ref={(el) => { ambientRefs.current[i] = el; }}
          className="ambient-char"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: item.size,
            color: "#0a0a0a",
            opacity: 0,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {item.char}
        </span>
      ))}

      {/* ── Name block (receives scroll parallax) ───────── */}
      <div ref={nameBlockRef} style={{ position: "relative", zIndex: 1 }}>
        {renderWord("ANDIKA", "firstname", "ANDIKA")}
        {renderWord("DINATA", "lastname", "DINATA")}
      </div>

      {/* ── Tagline ─────────────────────────────────────── */}
      <p
        ref={taglineRef}
        style={{
          marginTop: "clamp(1.5rem, 3vw, 3.5rem)",
          fontSize: "clamp(16px, 1.9vw, 28px)",
          fontWeight: 300,
          color: "var(--muted)",
          lineHeight: 1.6,
          maxWidth: "min(520px, 90vw)",
          opacity: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        I write code to think.
        <br />
        I think to write better code.
      </p>

      {/* ── Meta ────────────────────────────────────────── */}
      <div
        ref={metaRef}
        style={{
          marginTop: "clamp(0.75rem, 1.5vw, 1.25rem)",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.4rem 0.65rem",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "clamp(10px, 1vw, 13px)",
          color: "var(--muted)",
          letterSpacing: "0.05em",
          opacity: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <span>Bandar Lampung, ID</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>Sumatera Institute of Technology</span>
        <span style={{ opacity: 0.35 }}>·</span>
        <span>Software Engineer</span>
      </div>

      {/* ── Scroll indicator ────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(24px, 4vw, 48px)",
          left: "clamp(24px, 6vw, 120px)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          ref={scrollLineRef}
          style={{
            width: "1px",
            height: "44px",
            background: "var(--muted)",
            opacity: 0.4,
          }}
        />
        <span
          ref={scrollTextRef}
          style={{
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: "10px",
            color: "var(--muted)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0,
          }}
        >
          scroll
        </span>
      </div>
    </section>
  );
}
