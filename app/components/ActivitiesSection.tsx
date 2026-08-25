import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrambleHover } from "../hooks/useScrambleHover";

gsap.registerPlugin(ScrollTrigger);

const ACTIVITIES = [
  {
    period: "Jul 2025",
    title: "3rd Place — PesawaranCTF",
    meta: "Team: RPLXploit",
    body: "I competed with RPLXploit and placed 3rd at PesawaranCTF, a Capture The Flag competition focused on cybersecurity problem solving, speed, and strategy.",
    href: "https://lampungcorner.com/adu-strategi-dan-kecepatan-ctf-2025-pesawaran-cetak-talenta-muda-keamanan-siber/",
  },
];

function WordReveal({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="activity-word-clip" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
          <span className="activity-word" style={{ display: "inline-block", willChange: "transform" }}>
            {word}{i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

export function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: labelRef, onMouseEnter: onLabelHover } = useScrambleHover<HTMLSpanElement>("Activities");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".activity-card", ".activity-title", ".activity-meta", ".activity-word", ".activity-line", ".activity-link"], {
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

      sectionRef.current?.querySelectorAll<HTMLElement>(".activity-card").forEach((card) => {
        const line = card.querySelector(".activity-line");
        const meta = card.querySelectorAll(".activity-meta");
        const title = card.querySelector(".activity-title");
        const words = card.querySelectorAll(".activity-word");
        const clips = card.querySelectorAll<HTMLElement>(".activity-word-clip");
        const link = card.querySelector(".activity-link");

        gsap.timeline({ scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none none" } })
          .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.72, ease: "power2.inOut", transformOrigin: "left center" })
          .fromTo(meta, { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: "power2.out" }, "-=0.42")
          .fromTo(title, { y: 34, opacity: 0, letterSpacing: "-0.09em" }, { y: 0, opacity: 1, letterSpacing: "-0.06em", duration: 0.7, ease: "power4.out" }, "-=0.22")
          .fromTo(words, { yPercent: 115 }, {
            yPercent: 0,
            stagger: { each: 0.018, from: "start" },
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => clips.forEach((clip) => (clip.style.overflow = "visible")),
          }, "-=0.25")
          .fromTo(link, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.36, ease: "power2.out" }, "-=0.18");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = sectionRef.current?.querySelector(".activity-card");
    const title = sectionRef.current?.querySelector(".activity-title");
    gsap.to(card, { x: 8, duration: 0.26, ease: "power2.out", overwrite: "auto" });
    gsap.to(title, { skewX: -2, duration: 0.22, ease: "power2.out", overwrite: "auto" });
  };

  const handleLeave = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = sectionRef.current?.querySelector(".activity-card");
    const title = sectionRef.current?.querySelector(".activity-title");
    gsap.to(card, { x: 0, duration: 0.34, ease: "power2.out", overwrite: "auto" });
    gsap.to(title, { skewX: 0, duration: 0.45, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
  };

  return (
    <section ref={sectionRef} style={{ padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)", maxWidth: "min(1120px, 100%)" }}>
      <span ref={labelRef} onMouseEnter={onLabelHover} style={{ display: "inline-block", cursor: "default", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "clamp(1.75rem, 4vw, 4rem)", opacity: 0 }}>
        Activities
      </span>

      {ACTIVITIES.map((item) => (
        <article key={item.title} className="activity-card" onMouseEnter={handleEnter} onMouseLeave={handleLeave} style={{ willChange: "transform" }}>
          <div className="activity-line" style={{ height: 1, background: "rgba(10,10,10,0.1)", marginBottom: "clamp(1.1rem, 2.2vw, 1.7rem)", transform: "scaleX(0)", transformOrigin: "left center" }} />
          <div className="activity-meta" style={{ opacity: 0, display: "flex", flexWrap: "wrap", gap: "0.45rem 1rem", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "clamp(11px, 1vw, 13px)", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            <span>{item.period}</span>
          </div>
          <h3 className="activity-title" style={{ margin: 0, maxWidth: "min(920px, 100%)", fontSize: "clamp(42px, 8.6vw, 116px)", lineHeight: 0.88, letterSpacing: "-0.06em", fontWeight: 900, overflowWrap: "break-word", opacity: 0, willChange: "transform, opacity, letter-spacing" }}>
            {item.title}
          </h3>
          <p className="activity-meta" style={{ opacity: 0, margin: "clamp(0.9rem, 1.8vw, 1.4rem) 0 0", color: "var(--muted)", fontSize: "clamp(14px, 1.35vw, 17px)", maxWidth: 520 }}>{item.meta}</p>

          <div className="activity-body" style={{ marginTop: "clamp(1.4rem, 3vw, 2.4rem)", marginLeft: "clamp(0px, 28vw, 320px)", maxWidth: 690 }}>
            <p style={{ margin: 0, fontSize: "clamp(17px, 2vw, 27px)", lineHeight: 1.56, color: "var(--ink)" }}>
              <WordReveal text={item.body} />
            </p>
            <a className="activity-link" href={item.href} target="_blank" rel="noopener noreferrer" style={{ opacity: 0, display: "inline-block", marginTop: "1.25rem", fontFamily: "'Geist Mono', ui-monospace, monospace", fontSize: "clamp(11px, 1vw, 13px)", color: "var(--ink)", textDecoration: "none", borderBottom: "1px solid rgba(10,10,10,0.35)", paddingBottom: 2 }}>
              Read the article ↗
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
