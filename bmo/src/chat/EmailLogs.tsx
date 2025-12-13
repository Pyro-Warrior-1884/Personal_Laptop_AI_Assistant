import { For, Show } from "solid-js";
import { useEmailLogsController } from "./useEmailController";

export default function EmailLogs() {
  const {
    isInitialLoading,
    sortOrder,
    dateFilter,
    setDateFilter,
    filteredAndSortedData,
    toggleSortOrder
  } = useEmailLogsController();

  return (
    <div class="email-container">
      <div class="email-header">
        <h2 class="email-title">Email Logs</h2>
        <div class="email-controls">
          <div class="email-date-filter-wrapper">
            <input
              type="date"
              class="email-date-filter-input"
              value={dateFilter()}
              onInput={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            <Show when={dateFilter()}>
              <button
                class="email-clear-filter-btn"
                onClick={() => setDateFilter("")}
                title="Clear filter"
              >
                ✕
              </button>
            </Show>
          </div>

          <button
            class="email-sort-btn"
            onClick={toggleSortOrder}
            title={`Sort ${sortOrder() === "asc" ? "descending" : "ascending"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              {sortOrder() === "desc" ? (
                <path d="M12 5v14M19 12l-7 7-7-7" />
              ) : (
                <path d="M12 19V5M5 12l7-7 7 7" />
              )}
            </svg>
            <span>{sortOrder() === "asc" ? "Oldest First" : "Newest First"}</span>
          </button>
        </div>
      </div>

      <div class="email-table-wrapper">
        <Show
          when={!isInitialLoading()}
          fallback={
            <div class="email-loading-state">
              <div class="email-spinner"></div>
              <p>Loading Email Logs...</p>
            </div>
          }
        >
          <Show
            when={filteredAndSortedData().length > 0}
            fallback={
              <div class="email-no-results">
                <p>No records found for the selected date.</p>
              </div>
            }
          >
            <table class="email-table">
              <thead>
                <tr>
                  <th class="email-table-header">Timestamp</th>
                  <th class="email-table-header">Email</th>
                </tr>
              </thead>
              <tbody>
                <For each={filteredAndSortedData()}>
                  {(item) => (
                    <tr class="email-table-row">
                      <td class="email-table-cell email-datetime-cell">{item.timestamp}</td>
                      <td class="email-table-cell email-email-cell">{item.email_address}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </Show>
      </div>
    </div>
  );
}
