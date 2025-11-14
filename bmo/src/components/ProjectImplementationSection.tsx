export default function ProjectImplementationSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Project Implementation</h2>
      <p class="section-paragraph">
        BMO's architecture follows a modern client-server model with a SolidJS frontend communicating with a FastAPI backend. The implementation emphasizes modularity, allowing easy integration of different language models and preprocessing pipelines. State management is handled efficiently on the frontend, while the backend processes requests asynchronously, managing model inference and response generation. The system is designed with scalability in mind, supporting concurrent users and maintaining conversation contexts.
      </p>
    </div>
  );
}