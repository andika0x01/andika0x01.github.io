import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrambleHover } from "../hooks/useScrambleHover";

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPHS = [
  {
    text: "I'm a computer science student at the Sumatera Institute of Technology, based in Bandar Lampung.",
    size: "clamp(20px, 2.4vw, 34px)",
    weight: 500,
    muted: false,
  },
  {
    text: "I first touched code at thirteen — HTML and CSS, a blinking cursor, a browser tab open with the quiet wonder that something I typed could appear on a screen.",
    size: "clamp(17px, 1.9vw, 26px)",
    weight: 400,
    muted: false,
  },
  {
    text: "That feeling has shifted shape. Today I'm more drawn to the theory underneath: algorithms, formal systems, the mathematics that computation rests on. I have a slow obsession with cybersecurity — not just breaking things, but understanding systems at a depth that makes their seams visible.",
    size: "clamp(17px, 1.9vw, 26px)",
    weight: 400,
    muted: false,
  },
  {
    text: "I'm still writing code. I'll probably keep going.",
    size: "clamp(16px, 1.7vw, 24px)",
    weight: 400,
    muted: true,
  },
];

/**
 * Splits a string into word spans, each wrapped in an overflow:hidden
 * container so GSAP can clip-reveal them from below individually.
 */
function WordSplit({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <span
            className="word-inner proximity-word"
            style={{
              display: "inline-block",
              transition: "letter-spacing 0.2s ease, opacity 0.2s ease",
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: labelRef, onMouseEnter: onLabelHover } = useScrambleHover<HTMLSpanElement>("About");
  const paraRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(labelRef.current, { opacity: 1, y: 0 });
        gsap.set(".word-inner", { yPercent: 0 });
        return;
      }

      // Section label
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

      // Per-paragraph: word-by-word clip reveal from below
      paraRefs.current.forEach((el) => {
        if (!el) return;
        const wordInners = el.querySelectorAll(".word-inner");
        gsap.fromTo(
          wordInners,
          { yPercent: 110 },
          {
            yPercent: 0,
            stagger: { each: 0.022, from: "start" },
            duration: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 87%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    // ── Typographic Proximity Optical Lens ─────────────────────────
    const section = sectionRef.current;
    if (!section || reduced || window.matchMedia("(hover: none)").matches) {
      return () => ctx.revert();
    }

    const words = section.querySelectorAll<HTMLElement>(".proximity-word");
    let mouseX = -9999;
    let mouseY = -9999;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const updateProximity = () => {
      if (mouseX !== -9999) {
        const radius = 120;
        words.forEach((word) => {
          const rect = word.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(mouseX - cx, mouseY - cy);

          if (dist < radius) {
            const p = Math.pow(1 - dist / radius, 1.6);
            word.style.letterSpacing = `${(p * 0.025).toFixed(4)}em`;
            word.style.transform = `translateY(${(-p * 1.5).toFixed(2)}px)`;
          } else if (word.style.letterSpacing !== "") {
            word.style.letterSpacing = "";
            word.style.transform = "";
          }
        });
      } else {
        words.forEach((word) => {
          if (word.style.letterSpacing !== "") {
            word.style.letterSpacing = "";
            word.style.transform = "";
          }
        });
      }
      animId = requestAnimationFrame(updateProximity);
    };

    section.addEventListener("mousemove", onMouseMove);
    section.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(updateProximity);

    return () => {
      ctx.revert();
      section.removeEventListener("mousemove", onMouseMove);
      section.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)",
        maxWidth: "min(800px, 100%)",
      }}
    >
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
        About
      </span>

      {/* Paragraphs — each word clips in from below on scroll */}
      <div data-velocity-skew style={{ willChange: "transform" }}>
        {PARAGRAPHS.map((para, i) => (
          <p
            key={i}
            ref={(el) => {
              paraRefs.current[i] = el;
            }}
            style={{
              fontSize: para.size,
              fontWeight: para.weight,
              lineHeight: 1.62,
              color: para.muted ? "var(--muted)" : "var(--ink)",
              marginBottom: i === PARAGRAPHS.length - 1 ? 0 : "clamp(1.5rem, 2.5vw, 2.5rem)",
            }}
          >
            <WordSplit text={para.text} />
          </p>
        ))}
      </div>
    </section>
  );
}
