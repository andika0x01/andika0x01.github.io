import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Two-layer custom cursor:
 *   · A small solid dot that follows the mouse instantly
 *   · A larger ring that lags behind (lerp 0.1)
 *   · Concentric tactile shockwave wave ripple on click
 *
 * Only active on devices with a real pointer (hover: hover).
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const shockwaveContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on real pointer devices
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    gsap.set([ring, dot], { opacity: 1 });

    // QuickSetters for maximum performance (avoid layout thrashing)
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      setDotX(mouseX - 3);
      setDotY(mouseY - 3);
    };

    // Ring follows with lerp on ticker
    const tick = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      setRingX(ringX - 18);
      setRingY(ringY - 18);
    };

    gsap.ticker.add(tick);
    window.addEventListener("mousemove", onMove);

    // Hover state: ring shrinks and fills on interactive elements
    const onEnter = () =>
      gsap.to(ring, {
        width: 20,
        height: 20,
        background: "rgba(10,10,10,0.08)",
        borderColor: "transparent",
        duration: 0.25,
        ease: "power2.out",
      });
    const onLeave = () =>
      gsap.to(ring, {
        width: 36,
        height: 36,
        background: "transparent",
        borderColor: "rgba(10,10,10,0.7)",
        duration: 0.3,
        ease: "power2.out",
      });

    const interactiveSelector = "a, button, [data-magnetic], .skill-pill, .char, .tagline-word, .keyword-chip, [data-cursor-hover]";

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(interactiveSelector);
      if (target) {
        onEnter();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(interactiveSelector);
      const related = (e.relatedTarget as HTMLElement | null)?.closest(interactiveSelector);
      // Only trigger leave if not moving to another interactive element
      if (target && target !== related) {
        onLeave();
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    // Concentric Shockwave Click Waveform
    const onPointerDown = (e: PointerEvent) => {
      const container = shockwaveContainerRef.current;
      if (!container) return;

      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = `${e.clientX - 20}px`;
      ripple.style.top = `${e.clientY - 20}px`;
      ripple.style.width = "40px";
      ripple.style.height = "40px";
      ripple.style.borderRadius = "50%";
      ripple.style.border = "1px solid rgba(10, 10, 10, 0.4)";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "9997";
      ripple.style.willChange = "transform, opacity";

      container.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0.2, opacity: 0.6 },
        {
          scale: 2.2,
          opacity: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            ripple.remove();
          },
        }
      );
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div ref={shockwaveContainerRef} aria-hidden="true" />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1px solid rgba(10,10,10,0.7)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          mixBlendMode: "multiply",
        }}
      />
      {/* Instant dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: "#0a0a0a",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
        }}
      />
    </>
  );
}
