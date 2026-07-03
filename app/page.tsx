import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ProjectsSection from "./components/ProjectsSection";
import Closing from "./components/Closing";

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <ProjectsSection />
      <Closing />
    </main>
  );
}
