import gsap from "gsap";

export const motionSystem = {
  trigger: {
    labelStart: "top 90%",
    blockStart: "top 82%",
    paragraphStart: "top 87%",
  },
  label: {
    from: { y: 12, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
  },
  meta: {
    from: { y: 14, opacity: 0 },
    to: { y: 0, opacity: 1, stagger: 0.04, duration: 0.45, ease: "power2.out" },
  },
  title: {
    from: { y: 34, opacity: 0, letterSpacing: "-0.09em" },
    to: { y: 0, opacity: 1, letterSpacing: "-0.06em", duration: 0.7, ease: "power4.out" },
  },
  paragraph: {
    from: { yPercent: 115 },
    to: { yPercent: 0, stagger: { each: 0.018, from: "start" }, duration: 0.5, ease: "power3.out" },
  },
  trail: {
    from: { backgroundColor: "rgba(232, 224, 255, 0)" },
    to: {
      backgroundColor: "rgba(232, 224, 255, 0.72)",
      stagger: { each: 0.016, from: "start" },
      duration: 0.12,
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut",
    },
  },
  divider: {
    from: { scaleX: 0 },
    to: { scaleX: 1, duration: 0.72, ease: "power2.inOut", transformOrigin: "left center" },
  },
  listItem: {
    from: { y: 24, opacity: 0 },
    to: { y: 0, opacity: 1, stagger: { each: 0.08, from: "start" }, duration: 0.55, ease: "power3.out" },
  },
  link: {
    from: { y: 10, opacity: 0 },
    to: { y: 0, opacity: 1, duration: 0.36, ease: "power2.out" },
  },
  hoverFocus: {
    active: { opacity: 1, x: 8, duration: 0.26, ease: "power2.out", overwrite: "auto" },
    inactive: { opacity: 0.34, x: 0, duration: 0.26, ease: "power2.out", overwrite: "auto" },
    reset: { opacity: 1, x: 0, duration: 0.34, ease: "power2.out", overwrite: "auto" },
  },
} as const;

export function revealList(targets: gsap.TweenTarget, trigger: gsap.DOMTarget, start: string = motionSystem.trigger.blockStart) {
  return gsap.fromTo(targets, motionSystem.listItem.from, {
    ...motionSystem.listItem.to,
    scrollTrigger: { trigger, start, toggleActions: "play none none none" },
  });
}

export function revealLabel(target: gsap.TweenTarget, trigger: gsap.DOMTarget) {
  return gsap.fromTo(target, motionSystem.label.from, {
    ...motionSystem.label.to,
    scrollTrigger: { trigger, start: motionSystem.trigger.labelStart, toggleActions: "play none none none" },
  });
}

export function drawDivider(target: gsap.TweenTarget) {
  return gsap.fromTo(target, motionSystem.divider.from, motionSystem.divider.to);
}

export function revealMeta(targets: gsap.TweenTarget) {
  return gsap.fromTo(targets, motionSystem.meta.from, motionSystem.meta.to);
}

export function revealTitle(target: gsap.TweenTarget) {
  return gsap.fromTo(target, motionSystem.title.from, motionSystem.title.to);
}

export function revealWordsWithTrail(words: gsap.TweenTarget, clips?: NodeListOf<HTMLElement> | HTMLElement[], scrollTrigger?: gsap.TweenVars["scrollTrigger"]) {
  return gsap.fromTo(words, motionSystem.paragraph.from, {
    ...motionSystem.paragraph.to,
    scrollTrigger,
    onStart: () => {
      gsap.fromTo(words, motionSystem.trail.from, { ...motionSystem.trail.to, delay: 0.1 });
    },
    onComplete: () => clips?.forEach((clip) => (clip.style.overflow = "visible")),
  });
}

export function revealLink(target: gsap.TweenTarget) {
  return gsap.fromTo(target, motionSystem.link.from, motionSystem.link.to);
}

export function revealEditorialBlock({
  trigger,
  line,
  meta,
  title,
  words,
  clips,
  link,
}: {
  trigger: gsap.DOMTarget;
  line?: gsap.TweenTarget | null;
  meta?: gsap.TweenTarget | null;
  title?: gsap.TweenTarget | null;
  words?: gsap.TweenTarget | null;
  clips?: NodeListOf<HTMLElement> | HTMLElement[];
  link?: gsap.TweenTarget | null;
}) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start: motionSystem.trigger.blockStart, toggleActions: "play none none none" },
  });

  if (line) tl.add(drawDivider(line));
  if (meta) tl.add(revealMeta(meta), "-=0.42");
  if (title) tl.add(revealTitle(title), "-=0.22");
  if (words) tl.add(revealWordsWithTrail(words, clips), "-=0.25");
  if (link) tl.add(revealLink(link), "-=0.18");

  return tl;
}

export function applyHoverFocus(elements: NodeListOf<HTMLElement> | HTMLElement[], activeIndex: number) {
  elements.forEach((el, index) => {
    gsap.to(el, index === activeIndex ? motionSystem.hoverFocus.active : motionSystem.hoverFocus.inactive);
  });
}

export function resetHoverFocus(elements: NodeListOf<HTMLElement> | HTMLElement[]) {
  elements.forEach((el) => gsap.to(el, motionSystem.hoverFocus.reset));
}

export function attachProximity(container: HTMLElement, selector = ".motion-proximity-word") {
  const words = container.querySelectorAll<HTMLElement>(selector);
  let mouseX = -9999;
  let mouseY = -9999;
  let animId = 0;

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const onMouseLeave = () => {
    mouseX = -9999;
    mouseY = -9999;
  };

  const update = () => {
    words.forEach((word) => {
      const rect = word.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - cx, mouseY - cy);
      const radius = 145;

      if (dist < radius) {
        const p = Math.pow(1 - dist / radius, 1.7);
        word.style.letterSpacing = `${(p * 0.035).toFixed(4)}em`;
        word.style.transform = `translateY(${(-p * 4.5).toFixed(2)}px)`;
      } else if (word.style.letterSpacing !== "") {
        word.style.letterSpacing = "";
        word.style.transform = "";
      }
    });
    animId = requestAnimationFrame(update);
  };

  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseleave", onMouseLeave);
  animId = requestAnimationFrame(update);

  return () => {
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
    cancelAnimationFrame(animId);
  };
}
