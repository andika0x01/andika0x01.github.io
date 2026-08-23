import { useRef, useCallback } from "react";

const CLEAN_HEX_CHARS = "0123456789ABCDEF_";

interface UseScrambleHoverOptions {
  duration?: number; // duration in seconds, default 0.28s
  chars?: string;
}

/**
 * Hook for clean alphanumeric/hex typography hover animation.
 * Scrambles characters cleanly with hex digits before resolving smoothly.
 */
export function useScrambleHover<T extends HTMLElement>(
  originalText?: string,
  options: UseScrambleHoverOptions = {}
) {
  const ref = useRef<T>(null);
  const animFrameRef = useRef<number | null>(null);
  const duration = (options.duration ?? 0.28) * 1000;
  const chars = options.chars ?? CLEAN_HEX_CHARS;

  const trigger = useCallback(
    (customText?: string) => {
      const el = ref.current;
      if (!el) return;

      const target = customText ?? originalText ?? el.getAttribute("data-original-text") ?? el.innerText;
      if (!target) return;

      // Cache original text on element if not present
      if (!el.getAttribute("data-original-text")) {
        el.setAttribute("data-original-text", target);
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.innerText = target;
        return;
      }

      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const startTime = performance.now();
      const length = target.length;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Calculate how many characters are resolved
        const resolvedCount = Math.floor(progress * length);

        let result = "";
        for (let i = 0; i < length; i++) {
          const originalChar = target[i];
          if (originalChar === " " || originalChar === "\n" || originalChar === "\t") {
            result += originalChar;
          } else if (i < resolvedCount) {
            result += originalChar;
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        el.innerText = result;

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          el.innerText = target;
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [originalText, duration, chars]
  );

  return { ref, trigger, onMouseEnter: () => trigger() };
}
