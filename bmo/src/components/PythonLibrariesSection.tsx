export default function PythonLibrariesSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Python Libraries</h2>

      {/* Overview */}
      <p class="section-paragraph">
        The backend of BMO is built using a carefully selected set of Python
        libraries, each responsible for a specific subsystem within the
        assistant. This modular selection ensures clean separation of concerns,
        maintainability, and reliable real-time performance across audio
        processing, inference, automation, and data persistence.
      </p>

      {/* Speech Recognition */}
      <p class="section-paragraph">
        The speech recognition pipeline relies on offline-capable libraries
        that enable continuous voice input processing without network
        dependency. These libraries handle microphone capture, audio buffering,
        and real-time speech-to-text conversion.
        <br />
        <strong>Libraries:</strong> Vosk (offline speech recognition), SoundDevice
        (real-time microphone input)
      </p>

      {/* Text-to-Speech */}
      <p class="section-paragraph">
        Spoken responses are generated using a high-quality text-to-speech
        engine that converts assistant output into natural-sounding voice
        audio. The integration ensures low-latency playback and smooth user
        interaction.
        <br />
        <strong>Libraries:</strong> ElevenLabs (text-to-speech synthesis)
      </p>

      {/* Local LLM Execution */}
      <p class="section-paragraph">
        Local language model inference is executed through a controlled process
        invocation layer. This enables the assistant to communicate with the
        Ollama runtime, pass user prompts, and retrieve generated responses in
        a safe and non-blocking manner.
        <br />
        <strong>Libraries:</strong> Subprocess (local LLM execution)
      </p>

      {/* Automation & System Control */}
      <p class="section-paragraph">
        System-level automation is achieved through libraries that allow
        programmatic control over keyboard input, application execution, and
        browser interaction. These capabilities enable the assistant to perform
        real-world actions in response to voice commands.
        <br />
        <strong>Libraries:</strong> PyAutoGUI (keyboard and OS automation),
        Webbrowser (browser control)
      </p>

      {/* Data Persistence */}
      <p class="section-paragraph">
        Persistent storage is handled through a database client that enables
        structured logging of conversations and custom commands. This ensures
        long-term memory and reliable retrieval of interaction history.
        <br />
        <strong>Libraries:</strong> MongoDB (PyMongo)
      </p>

      {/* Concurrency & Core Utilities */}
      <p class="section-paragraph">
        Concurrency and internal communication are managed using thread-safe
        data structures and execution models. These libraries allow the system
        to process audio input, LLM inference, and automation tasks concurrently
        without blocking the main execution flow.
        <br />
        <strong>Libraries:</strong> Threading, Queue
      </p>
    </div>
  );
}
