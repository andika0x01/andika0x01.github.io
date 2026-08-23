import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling synchronized directly with GSAP ScrollTrigger ticker.
 * Also monitors scroll velocity to apply subtle kinetic physics to elements with `data-velocity-skew`.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Synchronize Lenis scroll position with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for perfect 60-120fps sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Kinetic velocity skew observer
    let prevVelocity = 0;
    const skewElements = () => document.querySelectorAll<HTMLElement>("[data-velocity-skew]");

    const velocityTicker = () => {
      const currentVelocity = lenis.velocity || 0;
      // Smooth out velocity changes
      const velocity = prevVelocity + (currentVelocity - prevVelocity) * 0.15;
      prevVelocity = velocity;

      // Clamp max skew to ±1.5 degrees to keep it elegant and readable
      const clampedSkew = Math.max(-1.5, Math.min(1.5, velocity * 0.04));
      
      const elements = skewElements();
      if (elements.length > 0) {
        gsap.set(elements, {
          skewY: clampedSkew,
          force3D: true,
          transformOrigin: "left center",
        });
      }
    };

    gsap.ticker.add(velocityTicker);

    return () => {
      gsap.ticker.remove(tickerCallback);
      gsap.ticker.remove(velocityTicker);
      lenis.destroy();
    };
  }, []);
}
