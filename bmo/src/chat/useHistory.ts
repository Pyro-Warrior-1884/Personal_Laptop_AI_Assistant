import { createSignal, createMemo, createEffect } from "solid-js";
import { client } from "../graphql/client";
import { 
  EDIT_ENTRY, 
  DELETE_ENTRY,
  GET_HISTORY, 
  GET_HISTORY_BY_TIMESTAMP,
  GET_LATEST_ENTRY 
} from "../graphql/queries";

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
  const [editingRow, setEditingRow] = createSignal(null);
  const [editFormData, setEditFormData] = createSignal({
    userRequest: "",
    bmoResponse: ""
  });
  const [isSaving, setIsSaving] = createSignal(false);

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

  const loadLatestEntry = async () => {
    try {
      const res = await client.query({
        query: GET_LATEST_ENTRY,
        fetchPolicy: "no-cache"
      });

      if (!res.data || !res.data.getLatestEntry) return null;

      return {
        request: res.data.getLatestEntry.user_response,
        response: res.data.getLatestEntry.bmo_response,
        datetime: res.data.getLatestEntry.timestamp
      };
    } catch (err) {
      console.error("Error loading latest:", err);
      return null;
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

  const handleEdit = async (timestamp, userResponse, bmoResponse) => {
    try {      
      const res = await client.mutate({
        mutation: EDIT_ENTRY,
        variables: {
          timestamp,
          user_response: userResponse,
          bmo_response: bmoResponse
        },
        fetchPolicy: "no-cache"
      });

      if (res.data && res.data.editEntry) {
        setExpandedRows((prev) => {
          const map = new Map(prev);
          map.set(timestamp, {
            userRequest: res.data.editEntry.user_response,
            bmoResponse: res.data.editEntry.bmo_response
          });
          return map;
        });

        return true;
      } else {
        throw new Error("Failed to update entry");
      }
    } catch (err) {
      console.error("Edit error:", err);
      throw err;
    }
  };

  const handleDelete = async (timestamp) => {
    try {
      const res = await client.mutate({
        mutation: DELETE_ENTRY,
        variables: { timestamp },
        fetchPolicy: "no-cache"
      });

      if (res.data.deleteEntry) {
        setTimestamps((prev) => prev.filter((t) => t.timestamp !== timestamp));

        setExpandedRows((prev) => {
          const map = new Map(prev);
          map.delete(timestamp);
          return map;
        });

        return true;
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  };

  createEffect(() => {
    loadInitialTimestamps();
  });

  const openEditModal = (timestamp) => {
    const rowData = expandedRows().get(timestamp);
    if (!rowData) return;

    setEditFormData({
      userRequest: rowData.userRequest || "",
      bmoResponse: rowData.bmoResponse || ""
    });

    setEditingRow(timestamp);
  };

  const closeEditModal = () => {
    setEditingRow(null);
    setEditFormData({ userRequest: "", bmoResponse: "" });
  };

  const saveEdit = async () => {
    const timestamp = editingRow();
    if (!timestamp) return;

    setIsSaving(true);
    try {
      await handleEdit(
        timestamp,
        editFormData().userRequest,
        editFormData().bmoResponse
      );

      closeEditModal();
    } catch (err) {
      console.error("Error saving edit:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async (timestamp) => {
    try {
      await handleDelete(timestamp);
    } catch (err) {
      console.error("Error deleting entry:", err);
      throw err;
    }
  };

  return {
    expandedRows,
    loadingRows,
    sortOrder,
    dateFilter,
    isInitialLoading,
    setDateFilter,
    filteredAndSortedData,
    toggleSortOrder,
    handleRowClick,
    handleEdit, 
    handleDelete,

    editingRow,
    editFormData,
    isSaving,
    setEditFormData,
    openEditModal,
    closeEditModal,
    saveEdit,
    confirmDelete,

    loadLatestEntry
  };
}
