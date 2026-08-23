import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMagneticHover } from "../hooks/useMagneticHover";

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
 * Single magnetic connect link.
 *
 * Hover:  display text fades to 45% opacity + underline draws left → right
 * Leave:  text returns to full opacity + underline erases right → left
 *
 * No arrow icon — the line-draw is the only motion signal.
 */
function ConnectLink({
  label,
  href,
  display,
}: {
  label: string;
  href: string;
  display: string;
}) {
  const ref          = useMagneticHover<HTMLAnchorElement>(0.22);
  const displayRef   = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    if (!underlineRef.current || !displayRef.current) return;
    // Draw line from left
    gsap.set(underlineRef.current, { transformOrigin: "left center" });
    gsap.to(underlineRef.current, {
      scaleX: 1,
      duration: 0.42,
      ease: "power3.out",
      overwrite: true,
    });
    // Dim text while line is visible
    gsap.to(displayRef.current, {
      opacity: 0.45,
      duration: 0.22,
      ease: "power2.out",
    });
  };

  const onLeave = () => {
    if (!underlineRef.current || !displayRef.current) return;
    // Erase line from right
    gsap.set(underlineRef.current, { transformOrigin: "right center" });
    gsap.to(underlineRef.current, {
      scaleX: 0,
      duration: 0.35,
      ease: "power3.in",
      overwrite: true,
    });
    // Restore text
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
      className="connect-link"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.6rem",
        textDecoration: "none",
        color: "var(--ink)",
        opacity: 0, // revealed by GSAP
      }}
    >
      {/* Platform label (monospace, small, muted) */}
      <span
        style={{
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "clamp(10px, 1vw, 13px)",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          minWidth: "5rem",
          flexShrink: 0,
        }}
      >
        {label}
      </span>

      {/* Display name + animated underline */}
      <span style={{ position: "relative", display: "inline-block" }}>
        <span
          ref={displayRef}
          style={{
            fontSize: "clamp(28px, 5vw, 80px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            display: "block",
          }}
        >
          {display}
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
  const labelRef   = useRef<HTMLSpanElement>(null);
  const footerRef  = useRef<HTMLParagraphElement>(null);

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
      }}
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
          marginBottom: "clamp(2rem, 4vw, 4.5rem)",
          opacity: 0,
        }}
      >
        Connect
      </span>

      {/* Link list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.5rem, 1.5vw, 1.25rem)",
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
