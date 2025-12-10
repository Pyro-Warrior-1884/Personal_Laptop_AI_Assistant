export default function CurrentView(props) {
  const latest = () => props.latest;

  return (
    <div class="view-container">
      <div class="current-display">
        <div class="display-header">
          <div class="datetime">
            {latest()?.datetime || "Loading..."}
          </div>
        </div>

        <div class="display-row">
          <span class="label">User Request:</span>
          <span class="value">
            {latest()?.request || "Loading..."}
          </span>
        </div>

        <div class="display-row">
          <span class="label">BMO Response:</span>
          <span class="value">
            {latest()?.response || "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
