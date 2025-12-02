import { createResource } from "solid-js";
import { useHistoryController } from "./useHistory";

export default function CurrentView() {
  const { loadLatestEntry } = useHistoryController();
  const [latest] = createResource(loadLatestEntry);

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
