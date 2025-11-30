import { createSignal, createMemo } from "solid-js";
import { client } from "../graphql/client";
import { GET_HISTORY, GET_HISTORY_BY_TIMESTAMP } from "../graphql/queries";

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

  const handleEdit = (timestamp) => {
    console.log("Edit row with timestamp:", timestamp);
  };

  const handleDelete = (timestamp) => {
    console.log("Delete row with timestamp:", timestamp);
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
