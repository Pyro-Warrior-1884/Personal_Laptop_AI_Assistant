import "./ProjectExpectationSection.css"

export default function ProjectExpectationSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Project Expectation</h2>

      <p class="section-paragraph">
        The primary goal of the BMO project is to deliver a hands-free,
        voice-controlled AI assistant that operates efficiently on local
        hardware while maintaining natural, high-quality user interactions.
        The system is designed to minimize reliance on cloud-based Large
        Language Models, thereby ensuring reduced latency, improved performance,
        and enhanced data privacy.
      </p>

      <p class="section-paragraph">
        The key expectations of this project include:
      </p>

      <ul class="section-list">
        <li>Hands-free interaction using voice commands</li>
        <li>Low-latency local inference without relying on cloud LLMs</li>
        <li>Extensibility, allowing new commands to be created dynamically</li>
        <li>Persistent memory for storing conversations and custom commands</li>
        <li>Natural interaction using high-quality text-to-speech responses</li>
        <li>System-level control such as opening applications and websites</li>
      </ul>

      <p class="section-paragraph">
        These expectations are fulfilled through the integration of offline
        speech recognition, local LLM inference, database persistence, and
        operating system–level automation into a unified and efficient workflow.
      </p>
    </div>
  );
}
