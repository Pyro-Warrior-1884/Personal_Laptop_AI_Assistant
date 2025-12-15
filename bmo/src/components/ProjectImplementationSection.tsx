import "./ProjectImplementationSection.css"

export default function ProjectImplementationSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Project Implementation</h2>

      {/* Overview */}
      <p class="section-paragraph">
        The BMO AI assistant is implemented using a Python-based backend powered
        by a locally hosted language model optimized for on-device performance.
        The system follows a modular design that enables real-time voice
        processing, intelligent response generation, and seamless execution of
        system-level actions.
      </p>

      {/* Environment Configuration */}
      <h3 class="section-subtitle">Environment Configuration</h3>
      <p class="section-paragraph">
        Environment variables are loaded using <strong>dotenv</strong> to
        securely manage sensitive credentials and system configurations. The
        application validates all critical configurations at startup and exits
        gracefully if any mandatory variable is missing, ensuring predictable
        runtime behavior.
      </p>

      <ul class="section-list">
        <li>MongoDB connection URI</li>
        <li>Vosk speech recognition model path</li>
        <li>ElevenLabs API key for text-to-speech</li>
        <li>Chrome executable path for browser automation</li>
      </ul>

      {/* Voice Input Pipeline */}
      <h3 class="section-subtitle">Voice Input Pipeline</h3>
      <p class="section-paragraph">
        The voice input pipeline is responsible for continuous microphone
        monitoring and real-time speech recognition. Audio input is captured
        using <strong>sounddevice</strong> and streamed in small chunks for
        processing.
      </p>

      <p class="section-paragraph">
        Each audio chunk is placed into a thread-safe queue, where it is
        processed by the <strong>Vosk</strong> speech recognition engine. The
        recognized text is then forwarded to a separate queue for command
        interpretation and response generation. This decoupled architecture
        prevents audio capture from being blocked by downstream processing.
      </p>

      {/* Concurrency Model */}
      <h3 class="section-subtitle">Concurrency Model</h3>
      <p class="section-paragraph">
        The system employs a multi-threaded concurrency model to maintain
        responsiveness during continuous operation. A dedicated background
        thread is responsible for audio listening and speech recognition, while
        the main thread processes recognized text and executes commands.
      </p>

      <p class="section-paragraph">
        Python’s <strong>queue.Queue</strong> is used to ensure safe and reliable
        communication between threads. This design allows the assistant to
        handle long-running tasks, such as LLM inference or system automation,
        without interrupting real-time voice input.
      </p>
    </div>
  );
}
