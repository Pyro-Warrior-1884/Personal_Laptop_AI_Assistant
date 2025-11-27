export default function CurrentView() {
  const latest = {
    request: "Sample user request text here",
    response: "Sample BMO response text here",
    datetime: "27-11-2025 14:30:45"
  };

  return (
    <div class="view-container">
      <div class="current-display">
        <div class="display-header">
          <div class="datetime">{latest.datetime}</div>
        </div>
        <div class="display-row">
          <span class="label">User Request:</span>
          <span class="value">{latest.request}</span>
        </div>
        <div class="display-row">
          <span class="label">BMO Response:</span>
          <span class="value">{latest.response}</span>
        </div>
      </div>
    </div>
  );
}