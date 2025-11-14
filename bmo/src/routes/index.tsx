import { Title } from "@solidjs/meta";
import { createSignal, onMount, For } from "solid-js";
import "./index.css";
import IntroductionSection from "../components/IntroductionSection";
import ProjectExpectationSection from "../components/ProjectExpectationSection";
import ProjectImplementationSection from "../components/ProjectImplementationSection";
import OllamaLLMSection from "../components/OllamaLLMSection";
import PythonLibrariesSection from "../components/PythonLibrariesSection";
import ContributionsSection from "../components/ContributionsSection";
import ChatSectionExplanationSection from "../components/ChatSectionExplanationSection";

export default function Home() {
  const [activeSection, setActiveSection] = createSignal(0);

  const sections = [
    { component: IntroductionSection, title: "Introduction" },
    { component: ProjectExpectationSection, title: "Project Expectation" },
    { component: ProjectImplementationSection, title: "Project Implementation" },
    { component: OllamaLLMSection, title: "Ollama LLM" },
    { component: PythonLibrariesSection, title: "Python Libraries" },
    { component: ContributionsSection, title: "Contributions" },
    { component: ChatSectionExplanationSection, title: "Chat Section Explanation" }
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute("data-index");
            if (indexAttr !== null) {
              const index = parseInt(indexAttr);
              setActiveSection(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".section").forEach((section) => {
      observer.observe(section);
    });
  });

  return (
    <main class="main-container">
      <Title>BMO</Title>
      
      <div class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">BMO</h1>
            <p class="hero-subtitle">
              Be More
            </p>
            <div class="hero-badges">
              <div class="badge badge-blue">Ollama Powered</div>
              <div class="badge badge-cyan">Python Based</div>
              <div class="badge badge-purple">Documentation in SolidJS</div>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-dots">
        <For each={sections}>
          {(section, index) => (
            <button
              onClick={() => {
                document.querySelector(`[data-index="${index()}"]`)?.scrollIntoView({ behavior: "smooth" });
              }}
              class={`nav-dot ${activeSection() === index() ? "nav-dot-active" : ""}`}
              title={section.title}
            />
          )}
        </For>
      </div>

      <div class="sections-container">
        <For each={sections}>
          {(section, index) => (
            <div data-index={index()} class="section">
              <div class="section-wrapper">
                <div class="section-card">
                  <div class="section-content">
                    <div class="section-number">{index() + 1}</div>
                    {section.component()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      <footer class="footer">
        <div class="footer-content">
          <p>Thank You for Reading Till the End, Have a Great Day</p>
        </div>
      </footer>

    </main>
  );
}