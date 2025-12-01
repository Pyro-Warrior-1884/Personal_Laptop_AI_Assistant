import { createSignal, createMemo } from "solid-js";
import { client } from "../graphql/client";
import { EDIT_ENTRY, DELETE_ENTRY ,GET_HISTORY, GET_HISTORY_BY_TIMESTAMP } from "../graphql/queries";

export function parseCustomDate(dateTimeStr: string) {
  const [datePart, timePart] = dateTimeStr.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds || 0);
}

export function useHistoryController() {
  const [timestamps, setTimestamps] = createSignal([]);
  const [expandedRows, setExpandedRows] = createSignal(new Map());
  const [loadingRows, setLoadingRows] = createSignal(new Set());
  const [sortOrder, setSortOrder] = createSignal("desc");
  const [dateFilter, setDateFilter] = createSignal("");
  const [isInitialLoading, setIsInitialLoading] = createSignal(true);

  const loadInitialTimestamps = async () => {
    try {
      const res = await client.query({
        query: GET_HISTORY,
        fetchPolicy: "no-cache"
      });

      const timestampList = res.data.getHistory.map((entry, index) => ({
        id: index + 1,
        timestamp: entry.timestamp
      }));

      setTimestamps(timestampList);
    } catch (error) {
      console.error("Error fetching timestamps:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const filteredAndSortedData = createMemo(() => {
    let data = [...timestamps()];

    if (dateFilter()) {
      const [year, month, day] = dateFilter().split("-");
      const formatted = `${day}-${month}-${year}`;
      data = data.filter((item) => item.timestamp.startsWith(formatted));
    }

    data.sort((a, b) => {
      const dateA = parseCustomDate(a.timestamp);
      const dateB = parseCustomDate(b.timestamp);
      return sortOrder() === "asc" ? dateA - dateB : dateB - dateA;
    });

    return data;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
  };

  const fetchRowDetails = async (timestamp) => {
    if (expandedRows().has(timestamp)) return;

    setLoadingRows(prev => new Set(prev).add(timestamp));

    try {
      const res = await client.query({
        query: GET_HISTORY_BY_TIMESTAMP,
        variables: { timestamp },
        fetchPolicy: "no-cache"
      });

      const data = res.data.getHistoryByTimestamp;

      setExpandedRows(prev => {
        const newMap = new Map(prev);
        newMap.set(timestamp, {
          userRequest: data.user_response,
          bmoResponse: data.bmo_response
        });
        return newMap;
      });
    } catch (error) {
      console.error("Error loading row:", error);
    } finally {
      setLoadingRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(timestamp);
        return newSet;
      });
    }
  };

  const handleRowClick = (timestamp) => {
    if (!expandedRows().has(timestamp) && !loadingRows().has(timestamp)) {
      fetchRowDetails(timestamp);
    }
  };

  const handleEdit = async (timestamp) => {
    try {
      // Example: fetch existing data to show in UI (optional)
      const existing = expandedRows().get(timestamp);

      const user_response = prompt(
        "Edit User Request:",
        existing?.userRequest || ""
      );
      const bmo_response = prompt(
        "Edit BMO Response:",
        existing?.bmoResponse || ""
      );

      const res = await client.mutate({
        mutation: EDIT_ENTRY,
        variables: {
          timestamp,
          user_response,
          bmo_response
        },
        fetchPolicy: "no-cache"
      });

      // Update UI
      setExpandedRows((prev) => {
        const map = new Map(prev);
        map.set(timestamp, {
          userRequest: res.data.editEntry.user_response,
          bmoResponse: res.data.editEntry.bmo_response
        });
        return map;
      });

      alert("Entry updated successfully!");
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to edit entry.");
    }
  };

  const handleDelete = async (timestamp) => {
    try {
      const confirmDelete = confirm("Are you sure you want to delete this entry?");
      if (!confirmDelete) return;

      const res = await client.mutate({
        mutation: DELETE_ENTRY,
        variables: { timestamp },
        fetchPolicy: "no-cache"
      });

      if (res.data.deleteEntry) {
        // Remove from timestamps list
        setTimestamps((prev) => prev.filter((t) => t.timestamp !== timestamp));

        // Remove from expanded rows
        setExpandedRows((prev) => {
          const map = new Map(prev);
          map.delete(timestamp);
          return map;
        });

        alert("Entry deleted successfully!");
      } else {
        alert("Failed to delete entry.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed.");
    }
  };

  return {    
    timestamps,
    expandedRows,
    loadingRows,
    sortOrder,
    dateFilter,
    isInitialLoading,

    setDateFilter,
    setSortOrder,

    loadInitialTimestamps,
    filteredAndSortedData,
    toggleSortOrder,
    fetchRowDetails,
    handleRowClick,
    handleEdit,
    handleDelete
  };
}
