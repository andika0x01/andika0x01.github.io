import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagneticHover } from "../hooks/useMagneticHover";
import { useScrambleHover } from "../hooks/useScrambleHover";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/andika0x01",
    display: "andika0x01",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/andikadinata",
    display: "andikadinata",
  },
  {
    label: "Email",
    href: "mailto:a.introvrt@gmail.com",
    display: "a.introvrt@gmail.com",
  },
];

/**
 * Single magnetic connect link with kinetic dual-arrow ejection loop.
 *
 * Hover:  display text fades to 45% opacity + underline draws left → right + arrow loops
 * Leave:  text returns to full opacity + underline erases right → left
 */
function ConnectLink({ label, href, display }: { label: string; href: string; display: string }) {
  const ref = useMagneticHover<HTMLAnchorElement>(0.22);
  const displayRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const arrow1Ref = useRef<HTMLSpanElement>(null);
  const arrow2Ref = useRef<HTMLSpanElement>(null);
  const { ref: labelSpanRef, trigger: triggerLabelScramble } = useScrambleHover<HTMLSpanElement>(label, { duration: 0.28 });

  const onEnter = () => {
    triggerLabelScramble();

    if (arrow1Ref.current && arrow2Ref.current) {
      gsap.to(arrow1Ref.current, {
        x: "100%",
        y: "-100%",
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(arrow2Ref.current, {
        x: "0%",
        y: "0%",
        duration: 0.42,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (!underlineRef.current || !displayRef.current) return;
    gsap.set(underlineRef.current, { transformOrigin: "left center" });
    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.42,
      ease: "power3.out",
      overwrite: true,
    });
    gsap.to(displayRef.current, {
      opacity: 0.45,
      duration: 0.22,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    if (arrow1Ref.current && arrow2Ref.current) {
      gsap.to(arrow1Ref.current, {
        x: "0%",
        y: "0%",
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(arrow2Ref.current, {
        x: "-100%",
        y: "100%",
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    if (!underlineRef.current || !displayRef.current) return;
    gsap.set(underlineRef.current, { transformOrigin: "right center" });
    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.35,
      ease: "power3.in",
      overwrite: true,
    });
    gsap.to(displayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="connect-link group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 max-w-full"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        textDecoration: "none",
        color: "var(--ink)",
        opacity: 0, // revealed by GSAP
      }}
    >
      {/* Platform label (monospace, small, muted, scramble on hover) */}
      <span
        ref={labelSpanRef}
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "clamp(10px, 1vw, 13px)",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          minWidth: "4.5rem",
          flexShrink: 0,
        }}
      >
        {label}
      </span>

      {/* Display name + animated underline + kinetic loop arrow */}
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "baseline",
          maxWidth: "100%",
        }}
      >
        <span
          ref={displayRef}
          style={{
            fontSize: "clamp(20px, 5.5vw, 76px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            display: "block",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {display}
        </span>

        {/* Kinetic Loop Arrow Viewport */}
        <span
          aria-hidden="true"
          style={{
            position: "relative",
            display: "inline-block",
            width: "clamp(18px, 4vw, 42px)",
            height: "clamp(18px, 4vw, 42px)",
            overflow: "hidden",
            marginLeft: "clamp(8px, 1.5vw, 16px)",
            verticalAlign: "middle",
            opacity: 0.6,
            flexShrink: 0,
          }}
        >
          <span
            ref={arrow1Ref}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(16px, 3.2vw, 36px)",
              lineHeight: 1,
              willChange: "transform",
            }}
          >
            ↗
          </span>
          <span
            ref={arrow2Ref}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(16px, 3.2vw, 36px)",
              lineHeight: 1,
              transform: "translate(-100%, 100%)",
              willChange: "transform",
            }}
          >
            ↗
          </span>
        </span>

        {/* Line-draw underline: starts scaleX:0, draws in on hover */}
        <div
          ref={underlineRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "0.06em",
            left: 0,
            right: 0,
            height: "2px",
            background: "var(--ink)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </span>
    </a>
  );
}

export function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: labelRef, onMouseEnter: onLabelHover } = useScrambleHover<HTMLSpanElement>("Connect");
  const footerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([labelRef.current, ".connect-link", footerRef.current], {
          opacity: 1,
          y: 0,
        });
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

      gsap.fromTo(
        ".connect-link",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: { each: 0.12 },
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          delay: 0.4,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 120px)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
        maxWidth: "100%",
        overflowX: "hidden",
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
          marginBottom: "clamp(2rem, 4vw, 4.5rem)",
          opacity: 0,
        }}
      >
        Connect
      </span>

      {/* Link list */}
      <div
        data-velocity-skew
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(1rem, 2.5vw, 2rem)",
          maxWidth: "100%",
          willChange: "transform",
        }}
      >
        {LINKS.map((link) => (
          <ConnectLink key={link.label} {...link} />
        ))}
      </div>

      {/* Footer note */}
      <p
        ref={footerRef}
        style={{
          marginTop: "clamp(4rem, 8vw, 8rem)",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.06em",
          opacity: 0,
        }}
      >
        andika0x01.github.io · {new Date().getFullYear()}
      </p>
    </section>
  );
}
