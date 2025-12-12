import { For, Show} from "solid-js";
import { useCustomCommandsController } from "./useCustomCommandsController";

export default function EmailLogs() {
  const {
    expandedRows,
    loadingRows,
    sortOrder,
    dateFilter,
    isInitialLoading,
    setDateFilter,
    filteredAndSortedData,
    toggleSortOrder,
    handleRowClick,
  } = useCustomCommandsController();


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
                  {(item) => {
                    const rowData = () => expandedRows().get(item.timestamp);
                    const isLoading = () => loadingRows().has(item.timestamp);
                    const isExpanded = () => expandedRows().has(item.timestamp);

                    return (
                      <tr class="email-table-row" classList={{ expanded: isExpanded() }}>
                        <td class="email-table-cell email-datetime-cell">{item.timestamp}</td>

                        <td
                          class="email-table-cell email-email-cell email-clickable-cell"
                          classList={{ expanded: isExpanded(), loading: isLoading() }}
                          onClick={() => handleRowClick(item.timestamp)}
                        >
                          <Show
                            when={!isLoading()}
                            fallback={
                              <div class="email-cell-loading">
                                <div class="email-mini-spinner"></div>
                                <span>Loading...</span>
                              </div>
                            }
                          >
                            <Show
                              when={isExpanded()}
                              fallback={
                                <div class="email-hidden-content">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  <span>Click to reveal</span>
                                </div>
                              }
                            >
                              {rowData()?.userRequest || "N/A"}
                            </Show>
                          </Show>
                        </td>
                      </tr>
                    );
                  }}
                </For>
              </tbody>
            </table>
          </Show>
        </Show>
      </div>
    </div>
  );
}