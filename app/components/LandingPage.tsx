import { CustomCursor } from "./CustomCursor";
import { GraphCanvas } from "./GraphCanvas";
import { SystemHUD } from "./SystemHUD";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { ProjectsSection } from "./ProjectsSection";
import { ConnectSection } from "./ConnectSection";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import type { Project } from "./ProjectsSection";

interface LandingPageProps {
  projects: Project[];
}

export function LandingPage({ projects }: LandingPageProps) {
  // Activate Lenis smooth scrolling + kinetic velocity physics
  useSmoothScroll();

  return (
    <main
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <GraphCanvas />
      <CustomCursor />
      <SystemHUD />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <ConnectSection />
    </main>
  );
}
