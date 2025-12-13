import { createSignal, createMemo, createEffect } from "solid-js";
import { client } from "../graphql/client";
import { GET_EMAILS } from "../graphql/queries"; 
import { parseCustomDate } from "./useHistory";

export function useEmailLogsController() {
  const [emails, setEmails] = createSignal([]);
  const [sortOrder, setSortOrder] = createSignal("desc");
  const [dateFilter, setDateFilter] = createSignal("");
  const [isInitialLoading, setIsInitialLoading] = createSignal(true);

  const loadEmails = async () => {
    const res = await client.query({
      query: GET_EMAILS,
      fetchPolicy: "no-cache"
    });

    setEmails(res.data.getEmails || []);
    setIsInitialLoading(false);
  };

  createEffect(() => {
    loadEmails();
  });

  const filteredAndSortedData = createMemo(() => {
    let data = [...emails()];

    if (dateFilter()) {
      const [y, m, d] = dateFilter().split("-");
      const formatted = `${d}-${m}-${y}`;
      data = data.filter(i => i.timestamp.startsWith(formatted));
    }

    data.sort((a, b) => {
      const da = parseCustomDate(a.timestamp);
      const db = parseCustomDate(b.timestamp);
      return sortOrder() === "asc" ? da - db : db - da;
    });

    return data;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
  };

  return {
    sortOrder,
    dateFilter,
    isInitialLoading,
    filteredAndSortedData,
    setDateFilter,
    toggleSortOrder
  };
}
