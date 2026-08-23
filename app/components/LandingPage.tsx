import { CustomCursor } from "./CustomCursor";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { ProjectsSection } from "./ProjectsSection";
import { ConnectSection } from "./ConnectSection";
import type { Project } from "./ProjectsSection";

interface LandingPageProps {
  projects: Project[];
}

export function LandingPage({ projects }: LandingPageProps) {
  return (
    <main
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <CustomCursor />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <ConnectSection />
    </main>
  );
}
