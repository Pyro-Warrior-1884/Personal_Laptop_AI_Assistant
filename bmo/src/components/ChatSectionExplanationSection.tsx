import "./ChatSectionExplanationSection.css"

export default function ChatSectionExplanationSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Chat Section Explanation</h2>

      {/* Overview */}
      <p class="section-paragraph">
        The chat handling mechanism in BMO is designed to manage structured
        conversations between the user and the assistant in a reliable and
        persistent manner. Each interaction is captured as a request–response
        exchange, enabling the system to maintain conversational context and
        store meaningful interaction history.
      </p>

      {/* Conversation Buffer */}
      <p class="section-paragraph">
        During runtime, conversations are first stored in an in-memory
        conversation buffer. Each exchange consists of the user’s spoken
        request, the assistant’s generated response, and a corresponding
        timestamp. This buffering approach allows the assistant to operate
        efficiently without performing frequent database writes.
      </p>

      {/* Persistence & Upload */}
      <p class="section-paragraph">
        When explicitly instructed by the user, the buffered conversation data
        is uploaded to a MongoDB database for long-term storage. Each record is
        stored in a structured format, ensuring consistency and enabling future
        retrieval, review, or analysis of past interactions.
      </p>

      {/* Custom Commands */}
      <p class="section-paragraph">
        In addition to standard conversations, the chat system supports dynamic
        custom command creation. Users can define new request–response pairs
        during runtime, which are immediately stored in the database and loaded
        into memory. This allows the assistant to expand its capabilities over
        time without requiring code modifications or restarts.
      </p>

      {/* Design Outcome */}
      <p class="section-paragraph">
        This chat architecture balances responsiveness, reliability, and
        extensibility. By separating real-time interaction from persistent
        storage, the system ensures smooth conversational flow while maintaining
        a scalable and maintainable backend design.
      </p>
    </div>
  );
}
