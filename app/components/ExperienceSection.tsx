import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrambleHover } from "../hooks/useScrambleHover";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  {
    period: "Jun — Jul 2026",
    title: "Software Engineer Intern",
    place: "PT. Microdata Indonesia",
    body: "I built a PKL participant management information system from scratch as a full-stack developer. The system was used internally by the company and built with a fully TypeScript stack: Vite, React, Express, PostgreSQL, and MinIO.",
  },
  {
    period: "Feb — Apr 2022",
    title: "IT Support Intern",
    place: "Darmajaya Institute of Informatics and Business",
    body: "I handled hardware and software troubleshooting while supporting administrative work. It was an early introduction to how everyday systems fail, how people report problems, and how technical work often begins with listening carefully.",
  },
];

function WordReveal({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="credential-word-clip"
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <span className="credential-word" style={{ display: "inline-block", willChange: "transform" }}>
            {word}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: labelRef, onMouseEnter: onLabelHover } = useScrambleHover<HTMLSpanElement>("Experience");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".credential-card", ".credential-title", ".credential-meta", ".credential-word", ".credential-line", ".credential-link"], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scaleX: 1,
        });
        return;
      }

      gsap.fromTo(labelRef.current, { y: 12, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: labelRef.current, start: "top 90%", toggleActions: "play none none none" },
      });

      sectionRef.current?.querySelectorAll<HTMLElement>(".credential-card").forEach((card) => {
        const line = card.querySelector(".credential-line");
        const meta = card.querySelectorAll(".credential-meta");
        const title = card.querySelector(".credential-title");
        const words = card.querySelectorAll(".credential-word");
        const clips = card.querySelectorAll<HTMLElement>(".credential-word-clip");
        const link = card.querySelector(".credential-link");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none none" },
        });

        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.72, ease: "power2.inOut", transformOrigin: "left center" })
          .fromTo(meta, { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: "power2.out" }, "-=0.42")
          .fromTo(title, { y: 34, opacity: 0, letterSpacing: "-0.09em" }, { y: 0, opacity: 1, letterSpacing: "-0.06em", duration: 0.7, ease: "power4.out" }, "-=0.22")
          .fromTo(words, { yPercent: 115 }, {
            yPercent: 0,
            stagger: { each: 0.018, from: "start" },
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => clips.forEach((clip) => (clip.style.overflow = "visible")),
          }, "-=0.25");

        if (link) tl.fromTo(link, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, ease: "power2.out" }, "-=0.18");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardEnter = (index: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".credential-card");
    cards?.forEach((card, i) => {
      const title = card.querySelector(".credential-title");
      gsap.to(card, { opacity: i === index ? 1 : 0.34, x: i === index ? 8 : 0, duration: 0.26, ease: "power2.out", overwrite: "auto" });
      if (title && i === index) gsap.to(title, { skewX: -2, duration: 0.22, ease: "power2.out", overwrite: "auto" });
    });
  };

  const handleCardLeave = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".credential-card");
    cards?.forEach((card) => {
      const title = card.querySelector(".credential-title");
      gsap.to(card, { opacity: 1, x: 0, duration: 0.34, ease: "power2.out", overwrite: "auto" });
      if (title) gsap.to(title, { skewX: 0, duration: 0.45, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
    });
  };

  return (
    <section ref={sectionRef} style={{ padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)", maxWidth: "min(1120px, 100%)" }}>
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
          marginBottom: "clamp(1.75rem, 4vw, 4rem)",
          opacity: 0,
        }}
      >
        Experience
      </span>

      <div onMouseLeave={handleCardLeave} style={{ display: "grid", gap: "clamp(4.5rem, 8vw, 8rem)" }}>
        {ITEMS.map((item, i) => (
          <article key={item.title} className="credential-card" onMouseEnter={() => handleCardEnter(i)} style={{ opacity: 1, willChange: "transform, opacity" }}>
            <div className="credential-line" style={{ height: 1, background: "rgba(10,10,10,0.1)", marginBottom: "clamp(1.1rem, 2.2vw, 1.7rem)", transform: "scaleX(0)", transformOrigin: "left center" }} />

            <div className="credential-meta" style={{ opacity: 0, display: "flex", flexWrap: "wrap", gap: "0.45rem 1rem", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "clamp(11px, 1vw, 13px)", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              <span>{item.period}</span>
            </div>

            <h3 className="credential-title" style={{ margin: 0, maxWidth: "min(920px, 100%)", fontSize: "clamp(42px, 8.6vw, 116px)", lineHeight: 0.88, letterSpacing: "-0.06em", fontWeight: 900, overflowWrap: "break-word", opacity: 0, willChange: "transform, opacity, letter-spacing" }}>
              {item.title}
            </h3>

            <p className="credential-meta" style={{ opacity: 0, margin: "clamp(0.9rem, 1.8vw, 1.4rem) 0 0", color: "var(--muted)", fontSize: "clamp(14px, 1.35vw, 17px)", maxWidth: 520 }}>{item.place}</p>

            <div className="credential-body" style={{ marginTop: "clamp(1.4rem, 3vw, 2.4rem)", marginLeft: "clamp(0px, 28vw, 320px)", maxWidth: 690 }}>
              <p style={{ margin: 0, fontSize: "clamp(17px, 2vw, 27px)", lineHeight: 1.56, color: "var(--ink)" }}>
                <WordReveal text={item.body} />
              </p>
              {item.href && (
                <a className="credential-link" href={item.href} target="_blank" rel="noopener noreferrer" style={{ opacity: 0, display: "inline-block", marginTop: "1.25rem", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "clamp(11px, 1vw, 13px)", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(10,10,10,0.35)", paddingBottom: 2 }}>
                  Read the article ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
