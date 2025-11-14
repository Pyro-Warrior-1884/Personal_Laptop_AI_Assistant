export default function PythonLibrariesSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Python Libraries</h2>
      <p class="section-paragraph">
        BMO leverages a carefully selected suite of Python libraries to deliver its functionality. FastAPI serves as the high-performance web framework, handling HTTP requests with asynchronous support. Pydantic ensures data validation and settings management, while Uvicorn provides the ASGI server implementation. Additional libraries include httpx for making HTTP requests to the Ollama API, python-multipart for handling file uploads, and CORS middleware for secure cross-origin communication with the frontend application.
      </p>
    </div>
  );
}