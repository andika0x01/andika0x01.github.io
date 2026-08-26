import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { ExperienceSection } from "./ExperienceSection";
import { ActivitiesSection } from "./ActivitiesSection";
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
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ActivitiesSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <ConnectSection />
    </main>
  );
}
