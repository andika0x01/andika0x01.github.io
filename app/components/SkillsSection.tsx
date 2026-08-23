import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagneticHover } from "../hooks/useMagneticHover";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  "Python",
  "JavaScript / TypeScript",
  "Rust",
  "C / C++",
  "PyTorch",
  "JAX",
];

/**
 * Individual skill pill.
 * - Magnetic hover via useMagneticHover
 * - Letter-spacing expands on hover (elastic spring-back on leave)
 */
function SkillPill({ label }: { label: string }) {
  const ref = useMagneticHover<HTMLSpanElement>(0.28);

  const onEnter = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      letterSpacing: "0.1em",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      letterSpacing: "0.015em",
      duration: 0.65,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={ref}
      className="skill-pill"
      data-magnetic
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "inline-block",
        fontFamily: "'Geist Mono', ui-monospace, monospace",
        fontSize: "clamp(12px, 1.15vw, 15px)",
        fontWeight: 500,
        letterSpacing: "0.015em",
        color: "var(--ink)",
        padding: "0.45rem 0.85rem",
        opacity: 0, // set by GSAP reveal
      }}
    >
      {label}
    </span>
  );
}

export function SkillsSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const labelRef    = useRef<HTMLSpanElement>(null);
  const floatTweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".skill-pill"], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Eyebrow label
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

      // Pills stagger in, then launch float loop once reveal finishes
      const REVEAL_STAGGER  = 0.09;
      const REVEAL_DURATION = 0.55;
      const revealTotal     = (SKILLS.length - 1) * REVEAL_STAGGER + REVEAL_DURATION;

      gsap.fromTo(
        ".skill-pill",
        { y: 20, opacity: 0, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: { each: REVEAL_STAGGER, from: "start" },
          duration: REVEAL_DURATION,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              // After reveal completes, each pill gently floats independently
              const pills = sectionRef.current?.querySelectorAll(".skill-pill");
              pills?.forEach((pill) => {
                const t = gsap.to(pill, {
                  y: gsap.utils.random(-5, 5),
                  duration: gsap.utils.random(2.5, 4.5),
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  // Delay ensures float doesn't fight the reveal's y:0
                  delay: revealTotal + gsap.utils.random(0, 0.8),
                });
                floatTweens.current.push(t);
              });
            },
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      // Float tweens are created outside ctx closure so kill manually
      floatTweens.current.forEach((t) => t.kill());
      floatTweens.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)" }}
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
        Languages &amp; Tools
      </span>

      {/* Pill grid */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(8px, 1.5vw, 16px)",
          marginLeft: "-0.85rem",
        }}
      >
        {SKILLS.map((skill) => (
          <SkillPill key={skill} label={skill} />
        ))}
      </div>
    </section>
  );
}
