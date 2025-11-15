import "./ProjectImplementationSection.css"

export default function ProjectImplementationSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Project Implementation</h2>

      <p class="section-paragraph">
        The AI Assistant is powered by a locally hosted language model optimized
        for on-device performance. The system processes voice input, converts it
        into text, generates intelligent responses, and outputs audio replies
        in real time.
      </p>
      <br></br>
      <p class="section-paragraph">
        The core logic is built using a Python-based backend designed for
        automation, enabling the assistant to interact with applications,
        execute system-level actions, and handle various user commands
        seamlessly.
      </p>
      <br></br>
      <p class="section-paragraph">
        A dedicated speech pipeline manages continuous listening, speech
        recognition, and response generation. The output audio is produced
        through an integrated text-to-speech layer, ensuring natural and clear
        communication with the user.
      </p>
    </div>
  );
}
