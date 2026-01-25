import HomeSection from "../components/HomeSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import GitHubShowcaseSection from "../components/GitHubShowcaseSection";
import MediumBlogsSection from "../components/MediumBlogsSection";
import PublicationsSection from "../components/PublicationsSection";
import ContactSection from "../components/ContactSection";
import SectionSeparator from "../components/ui/SectionSeparator";
import Footer from "../components/ui/Footer";

/**
 * Main page rendering all portfolio sections with animated separators.
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <HomeSection />
      <SectionSeparator color="#2a2d34" />
      <AboutSection />
      <SectionSeparator color="#353942" flip />
      <SkillsSection />
      <SectionSeparator color="#23272f" />
      <ExperienceSection />
      <SectionSeparator color="#353942" flip />
      <ProjectsSection />
      <GitHubShowcaseSection />
      <SectionSeparator color="#2a2d34" />
      <MediumBlogsSection />
      <SectionSeparator color="#353942" flip />
      <PublicationsSection />
      <SectionSeparator color="#23272f" />
      <ContactSection />
      <Footer />
    </div>
  );
}
