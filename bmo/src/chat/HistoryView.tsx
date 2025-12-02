import { For, Show, createSignal } from "solid-js";
import { useHistoryController } from "./useHistory";

export default function HistoryView() {
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
    openEditModal,
    closeEditModal,
    saveEdit,
    confirmDelete,
    editingRow,
    editFormData,
    isSaving,
    setEditFormData
  } = useHistoryController();

  return (
    <div class="history-container">
      <div class="history-header">
        <h2 class="history-title">Interaction History</h2>
        <div class="history-controls">
          <div class="date-filter-wrapper">
            <input
              type="date"
              class="date-filter-input"
              value={dateFilter()}
              onInput={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            <Show when={dateFilter()}>
              <button
                class="clear-filter-btn"
                onClick={() => setDateFilter("")}
                title="Clear filter"
              >
                ✕
              </button>
            </Show>
          </div>
          <button
            class="sort-btn"
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

      <div class="history-table-wrapper">
        <Show
          when={!isInitialLoading()}
          fallback={
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading history...</p>
            </div>
          }
        >
          <Show
            when={filteredAndSortedData().length > 0}
            fallback={
              <div class="no-results">
                <p>No records found for the selected date.</p>
              </div>
            }
          >
            <table class="history-table">
              <thead>
                <tr>
                  <th class="table-header">Date & Time</th>
                  <th class="table-header">User Request</th>
                  <th class="table-header">BMO Response</th>
                  <th class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={filteredAndSortedData()}>
                  {(item) => {
                    const rowData = () => expandedRows().get(item.timestamp);
                    const isLoading = () => loadingRows().has(item.timestamp);
                    const isExpanded = () => expandedRows().has(item.timestamp);

                    return (
                      <tr class="table-row" classList={{ expanded: isExpanded() }}>
                        <td class="table-cell datetime-cell">{item.timestamp}</td>
                        
                        <td
                          class="table-cell request-cell clickable-cell"
                          classList={{ expanded: isExpanded(), loading: isLoading() }}
                          onClick={() => handleRowClick(item.timestamp)}
                        >
                          <Show
                            when={!isLoading()}
                            fallback={
                              <div class="cell-loading">
                                <div class="mini-spinner"></div>
                                <span>Loading...</span>
                              </div>
                            }
                          >
                            <Show
                              when={isExpanded()}
                              fallback={
                                <div class="hidden-content">
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
                        
                        <td
                          class="table-cell response-cell clickable-cell"
                          classList={{ expanded: isExpanded(), loading: isLoading() }}
                          onClick={() => handleRowClick(item.timestamp)}
                        >
                          <Show
                            when={!isLoading()}
                            fallback={
                              <div class="cell-loading">
                                <div class="mini-spinner"></div>
                                <span>Loading...</span>
                              </div>
                            }
                          >
                            <Show
                              when={isExpanded()}
                              fallback={
                                <div class="hidden-content">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                  <span>Click to reveal</span>
                                </div>
                              }
                            >
                              {rowData()?.bmoResponse || "N/A"}
                            </Show>
                          </Show>
                        </td>
                        
                        <td class="table-cell actions-cell">
                          <button
                            class="action-btn edit-btn"
                            classList={{ disabled: !isExpanded() }}
                            onClick={() => isExpanded() && openEditModal(item.timestamp)}
                            disabled={!isExpanded()}
                            title={isExpanded() ? "Edit" : "Expand row first to edit"}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            class="action-btn delete-btn"
                            onClick={() => confirmDelete(item.timestamp)}
                            title="Delete"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
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

      <Show when={editingRow()}>
        <div class="modal-overlay" onClick={closeEditModal}>
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <div class="modal-header">
              <h3>Edit Entry</h3>
              <button class="modal-close-btn" onClick={closeEditModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">User Request</label>
                <textarea
                  class="form-textarea"
                  value={editFormData().userRequest}
                  onInput={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      userRequest: e.target.value
                    }))
                  }
                  rows="4"
                  placeholder="Enter user request..."
                />
              </div>

              <div class="form-group">
                <label class="form-label">BMO Response</label>
                <textarea
                  class="form-textarea"
                  value={editFormData().bmoResponse}
                  onInput={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      bmoResponse: e.target.value
                    }))
                  }
                  rows="4"
                  placeholder="Enter BMO response..."
                />
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" onClick={closeEditModal} disabled={isSaving()}>
                Cancel
              </button>
              <button class="btn btn-primary" onClick={saveEdit} disabled={isSaving()}>
                <Show when={isSaving()}>
                  <div class="btn-spinner"></div>
                </Show>
                {isSaving() ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}