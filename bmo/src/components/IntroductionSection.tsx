import "./IntroductionSection.css"

export default function IntroductionSection() {
  return (
    <div class="section-text-intro">
      <h2 class="section-title-intro">Introduction</h2>

      <p class="section-paragraph-intro">
        This project implements <strong>BMO</strong>, a fully voice-controlled
        personal AI assistant designed to operate primarily on a local system,
        with cloud integrations used only where necessary. The assistant
        continuously listens to the user’s voice, converts speech to text,
        interprets commands, generates responses using text-to-speech, executes
        system or web-based actions, and optionally logs conversations to a
        database.
      </p>

      <p class="section-paragraph-intro">
        BMO is designed to support the following core functionalities:
      </p>

      <ul class="section-list-intro">
        <li>Real-time voice interaction</li>
        <li>Local Large Language Model (LLM) inference</li>
        <li>Custom voice command creation</li>
        <li>System and application automation</li>
        <li>Persistent conversation storage</li>
      </ul>

      <p class="section-paragraph-intro">
        The overall architecture follows a modular and event-driven design,
        optimized for real-time responsiveness, extensibility, and efficient
        resource usage. This structure allows the assistant to remain responsive
        while handling concurrent audio processing, command execution, and
        background tasks.
      </p>
    </div>
  );
}
