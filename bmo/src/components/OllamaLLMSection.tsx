import "./OllamaLLMSection.css";

export default function OllamaLLMSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Ollama LLM</h2>
      <p class="section-paragraph">
        Ollama serves as the core engine responsible for all local language
        model processing within the BMO system. It provides a dedicated runtime
        designed to load, manage, and optimize large language models directly
        on the host machine. This enables the assistant to perform inference
        without relying on external cloud services, ensuring full data
        privacy and offline operability.
      </p>
      <br></br>
      <p class="section-paragraph">
        The Python backend communicates with Ollama through lightweight
        command-based execution, sending user prompts and retrieving model
        outputs in real time. Ollama handles tokenization, context management,
        and streaming of generated responses, allowing the system to process
        natural language efficiently even on machines with limited resources.
      </p>
      <br></br>
      <p class="section-paragraph">
        In this project, Ollama also manages model lifecycle operations such
        as loading, unloading, caching, and batching requests. These
        optimizations reduce inference latency and minimize memory overhead,
        enabling continuous interaction between the speech recognition module
        and the response generation pipeline. The result is a highly responsive
        assistant that can understand queries, perform reasoning, and generate
        context-aware replies with minimal delay.
      </p>
      <br></br>
      <p class="section-paragraph">
        By leveraging Ollama's local execution capabilities, BMO gains a
        reliable and secure foundation for language understanding. This
        architecture ensures predictable performance, hardware-level control,
        and the ability to scale or replace models depending on future
        requirements—without modifying the higher-level application logic.
      </p>
    </div>
  );
}
