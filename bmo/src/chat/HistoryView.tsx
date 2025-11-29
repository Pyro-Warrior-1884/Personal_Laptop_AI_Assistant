import { createSignal, createMemo, createResource } from "solid-js";
import { client } from "../graphql/client"; // your Apollo client
import { GET_HISTORY } from "../graphql/queries";

function parseCustomDate(dateTimeStr) {
  const [datePart, timePart] = dateTimeStr.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

async function fetchHistory() {
  const res = await client.query({
    query: GET_HISTORY,
    fetchPolicy: "no-cache"
  });

  // convert backend format → frontend format
  return res.data.getHistory.map((entry, index) => ({
    id: index + 1,
    dateTime: entry.timestamp,
    userRequest: entry.user_response,
    bmoResponse: entry.bmo_response
  }));
}

export default function HistoryView() {
  const [historyData] = createResource(fetchHistory);

  const [sortOrder, setSortOrder] = createSignal("desc");
  const [dateFilter, setDateFilter] = createSignal("");

  const filteredAndSortedData = createMemo(() => {
    if (!historyData()) return [];

    let data = [...historyData()];

    if (dateFilter()) {
      const [year, month, day] = dateFilter().split("-");
      const formatted = `${day}-${month}-${year}`;

      data = data.filter((item) =>
        item.dateTime.startsWith(formatted)
      );
    }

    data.sort((a, b) => {
      const dateA = parseCustomDate(a.dateTime);
      const dateB = parseCustomDate(b.dateTime);
      return sortOrder() === "asc" ? dateA - dateB : dateB - dateA;
    });

    return data;
  });



  const toggleSortOrder = () => {
    setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
  };

  const handleEdit = (id) => {
    console.log("Edit row:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete row:", id);
  };

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
            {dateFilter() && (
              <button
                class="clear-filter-btn"
                onClick={() => setDateFilter("")}
                title="Clear filter"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button class="sort-btn" onClick={toggleSortOrder} title={`Sort ${sortOrder() === "asc" ? "descending" : "ascending"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              {sortOrder() === "desc" ? (
                <>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </>
              ) : (
                <>
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </>
              )}
            </svg>
            <span>{sortOrder() === "asc" ? "Oldest First" : "Newest First"}</span>
          </button>
        </div>
      </div>
      
      <div class="history-table-wrapper">
        {filteredAndSortedData().length === 0 ? (
          <div class="no-results">
            <p>No records found for the selected date.</p>
          </div>
        ) : (
          <table class="history-table">
            <thead>
              <tr>
                <th class="table-header">Date & Time</th>
                <th class="table-header">User Request</th>
                <th class="table-header">BMO Response</th>
                <th class="table-header">Functions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData().map((item) => (
                <tr class="table-row">
                  <td class="table-cell datetime-cell">{item.dateTime}</td>
                  <td class="table-cell request-cell">{item.userRequest}</td>
                  <td class="table-cell response-cell">{item.bmoResponse}</td>
                  <td class="table-cell actions-cell">
                    <button
                      class="action-btn edit-btn"
                      onClick={() => handleEdit(item.id)}
                      title="Edit"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      class="action-btn delete-btn"
                      onClick={() => handleDelete(item.id)}
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}