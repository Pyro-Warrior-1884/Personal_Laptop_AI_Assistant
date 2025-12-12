import { For, Show} from "solid-js";
import { useCustomCommandsController } from "./useCustomCommandsController";

export default function CustomCommands() {
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
    setEditFormData,

    showAddModal,
    addFormData,
    setAddFormData,
    openAddModal,
    closeAddModal,
    saveNewEntry,
    isAdding
  } = useCustomCommandsController();


  return (
    <div class="custom-container">
      <div class="custom-header">
        <h2 class="custom-title">Custom Commands</h2>
        <div class="custom-controls">
          <div class="custom-date-filter-wrapper">
            <input
              type="date"
              class="custom-date-filter-input"
              value={dateFilter()}
              onInput={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            <Show when={dateFilter()}>
              <button
                class="custom-clear-filter-btn"
                onClick={() => setDateFilter("")}
                title="Clear filter"
              >
                ✕
              </button>
            </Show>
          </div>

          <button
            class="custom-sort-btn"
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

          <button class="custom-add-btn" onClick={openAddModal} title="Add new entry">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      <div class="custom-table-wrapper">
        <Show
          when={!isInitialLoading()}
          fallback={
            <div class="custom-loading-state">
              <div class="custom-spinner"></div>
              <p>Loading Custom Commands...</p>
            </div>
          }
        >
          <Show
            when={filteredAndSortedData().length > 0}
            fallback={
              <div class="custom-no-results">
                <p>No records found for the selected date.</p>
              </div>
            }
          >
            <table class="custom-table">
              <thead>
                <tr>
                  <th class="custom-table-header">Date & Time</th>
                  <th class="custom-table-header">User Request</th>
                  <th class="custom-table-header">BMO Response</th>
                  <th class="custom-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={filteredAndSortedData()}>
                  {(item) => {
                    const rowData = () => expandedRows().get(item.timestamp);
                    const isLoading = () => loadingRows().has(item.timestamp);
                    const isExpanded = () => expandedRows().has(item.timestamp);

                    return (
                      <tr class="custom-table-row" classList={{ expanded: isExpanded() }}>
                        <td class="custom-table-cell custom-datetime-cell">{item.timestamp}</td>

                        <td
                          class="custom-table-cell custom-request-cell custom-clickable-cell"
                          classList={{ expanded: isExpanded(), loading: isLoading() }}
                          onClick={() => handleRowClick(item.timestamp)}
                        >
                          <Show
                            when={!isLoading()}
                            fallback={
                              <div class="custom-cell-loading">
                                <div class="custom-mini-spinner"></div>
                                <span>Loading...</span>
                              </div>
                            }
                          >
                            <Show
                              when={isExpanded()}
                              fallback={
                                <div class="custom-hidden-content">
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
                          class="custom-table-cell custom-response-cell custom-clickable-cell"
                          classList={{ expanded: isExpanded(), loading: isLoading() }}
                          onClick={() => handleRowClick(item.timestamp)}
                        >
                          <Show
                            when={!isLoading()}
                            fallback={
                              <div class="custom-cell-loading">
                                <div class="custom-mini-spinner"></div>
                                <span>Loading...</span>
                              </div>
                            }
                          >
                            <Show
                              when={isExpanded()}
                              fallback={
                                <div class="custom-hidden-content">
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

                        <td class="custom-table-cell custom-actions-cell">
                          <button
                            class="custom-action-btn custom-edit-btn"
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
                            class="custom-action-btn custom-delete-btn"
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
        <div class="custom-modal-overlay-edit" onClick={closeEditModal}>
          <div class="custom-modal-content-edit" onClick={(e) => e.stopPropagation()}>
            <div class="custom-modal-header-edit">
              <h3>Edit Entry</h3>
              <button class="custom-modal-close-btn-edit" onClick={closeEditModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="custom-modal-body-edit">
              <div class="custom-form-group">
                <label class="custom-form-label">User Request</label>
                <textarea
                  class="custom-form-textarea"
                  value={editFormData().userRequest}
                  onInput={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      userRequest: e.target.value
                    }))
                  }
                  rows="4"
                />
              </div>

              <div class="custom-form-group">
                <label class="custom-form-label">BMO Response</label>
                <textarea
                  class="custom-form-textarea"
                  value={editFormData().bmoResponse}
                  onInput={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      bmoResponse: e.target.value
                    }))
                  }
                  rows="4"
                />
              </div>
            </div>

            <div class="custom-modal-footer-edit">
              <button class="custom-btn custom-btn-secondary" onClick={closeEditModal} disabled={isSaving()}>
                Cancel
              </button>
              <button class="custom-btn custom-btn-primary" onClick={saveEdit} disabled={isSaving()}>
                <Show when={isSaving()}>
                  <div class="custom-btn-spinner"></div>
                </Show>
                {isSaving() ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={showAddModal()}>
        <div class="custom-modal-overlay-edit" onClick={closeAddModal}>
          <div class="custom-modal-content-edit" onClick={(e) => e.stopPropagation()}>
            <div class="custom-modal-header-edit">
              <h3>Add New Entry</h3>
              <button class="custom-modal-close-btn-edit" onClick={closeAddModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="custom-modal-body-edit">
              <div class="custom-form-group">
                <label class="custom-form-label">User Request</label>
                <textarea
                  class="custom-form-textarea"
                  placeholder="Enter User Input"
                  value={addFormData().userRequest}
                  onInput={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      userRequest: e.target.value
                    }))
                  }
                  rows="4"
                />
              </div>

              <div class="custom-form-group">
                <label class="custom-form-label">BMO Response</label>
                <textarea
                  class="custom-form-textarea"
                  placeholder="Enter BMO Response"
                  value={addFormData().bmoResponse}
                  onInput={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      bmoResponse: e.target.value
                    }))
                  }
                  rows="4"
                />
              </div>
            </div>

            <div class="custom-modal-footer-edit">
              <button class="custom-btn custom-btn-secondary" onClick={closeAddModal} disabled={isAdding()}>
                Cancel
              </button>
              <button class="custom-btn custom-btn-primary" onClick={saveNewEntry} disabled={isAdding()}>
                <Show when={isAdding()}>
                  <div class="custom-btn-spinner"></div>
                </Show>
                {isAdding() ? "Adding..." : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
