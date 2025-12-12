import { createSignal, createMemo, createEffect } from "solid-js";
import { client } from "../graphql/client";
import {
  GET_COMMANDS,
  GET_COMMAND_BY_TIMESTAMP,
  ADD_COMMAND,
  EDIT_COMMAND,
  DELETE_COMMAND
} from "../graphql/queries";
import { parseCustomDate } from "./useHistory";
import dayjs from "dayjs";

export function useCustomCommandsController() {
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

  const [showAddModal, setShowAddModal] = createSignal(false);
  const [addFormData, setAddFormData] = createSignal({
    userRequest: "",
    bmoResponse: ""
  });
  const [isAdding, setIsAdding] = createSignal(false);

  const loadInitialCommands = async () => {
    const res = await client.query({
      query: GET_COMMANDS,
      fetchPolicy: "no-cache"
    });
    const list = res.data.getCommands.map((entry, i) => ({
      id: i + 1,
      timestamp: entry.timestamp
    }));
    setTimestamps(list);
    setIsInitialLoading(false);
  };

  const fetchRowDetails = async (timestamp) => {
    if (expandedRows().has(timestamp)) return;

    setLoadingRows(prev => new Set(prev).add(timestamp));

    const res = await client.query({
      query: GET_COMMAND_BY_TIMESTAMP,
      variables: { timestamp },
      fetchPolicy: "no-cache"
    });

    const data = res.data.getCommandByTimestamp;

    setExpandedRows(prev => {
      const map = new Map(prev);
      map.set(timestamp, {
        userRequest: data.user_response,
        bmoResponse: data.bmo_response
      });
      return map;
    });

    setLoadingRows(prev => {
      const set = new Set(prev);
      set.delete(timestamp);
      return set;
    });
  };

  const handleRowClick = (timestamp) => {
    if (!expandedRows().has(timestamp) && !loadingRows().has(timestamp)) {
      fetchRowDetails(timestamp);
    }
  };

  const handleEdit = async (timestamp, userResponse, bmoResponse) => {
    const res = await client.mutate({
      mutation: EDIT_COMMAND,
      variables: {
        timestamp,
        user_response: userResponse,
        bmo_response: bmoResponse
      },
      fetchPolicy: "no-cache"
    });

    const updated = res.data.editCommand;

    setExpandedRows(prev => {
      const map = new Map(prev);
      map.set(timestamp, {
        userRequest: updated.user_response,
        bmoResponse: updated.bmo_response
      });
      return map;
    });

    return true;
  };

  const handleDelete = async (timestamp) => {
    const res = await client.mutate({
      mutation: DELETE_COMMAND,
      variables: { timestamp },
      fetchPolicy: "no-cache"
    });

    if (res.data.deleteCommand) {
      setTimestamps(prev => prev.filter(item => item.timestamp !== timestamp));
      setExpandedRows(prev => {
        const map = new Map(prev);
        map.delete(timestamp);
        return map;
      });
    }

    return true;
  };

  const addCommand = async (timestamp, userResponse, bmoResponse) => {
    const res = await client.mutate({
      mutation: ADD_COMMAND,
      variables: {
        timestamp,
        user_response: userResponse,
        bmo_response: bmoResponse
      },
      fetchPolicy: "no-cache"
    });

    if (res.data.addCommand) {
      setTimestamps(prev => [
        ...prev,
        { id: prev.length + 1, timestamp }
      ]);
    }

    return true;
  };

  const filteredAndSortedData = createMemo(() => {
    let data = [...timestamps()];

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

  createEffect(() => {
    loadInitialCommands();
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder() === "asc" ? "desc" : "asc");
  };

  const openEditModal = (timestamp) => {
    const row = expandedRows().get(timestamp);
    if (!row) return;
    setEditFormData({
      userRequest: row.userRequest || "",
      bmoResponse: row.bmoResponse || ""
    });
    setEditingRow(timestamp);
  };

  const closeEditModal = () => {
    setEditingRow(null);
    setEditFormData({ userRequest: "", bmoResponse: "" });
  };

  const saveEdit = async () => {
    const ts = editingRow();
    setIsSaving(true);
    try {
      await handleEdit(ts, editFormData().userRequest, editFormData().bmoResponse);
      closeEditModal();
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async (timestamp) => {
    await handleDelete(timestamp);
  };

  const openAddModal = () => {
    setAddFormData({ userRequest: "", bmoResponse: "" });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddFormData({ userRequest: "", bmoResponse: "" });
  };

  const saveNewEntry = async () => {
    const user = addFormData().userRequest.trim();
    const bmo = addFormData().bmoResponse.trim();

    if (!user || !bmo) {
      alert("Please enter both User Request and BMO Response.");
      return;
    }

    setIsAdding(true);
    try {
      const timestamp = dayjs().format("DD-MM-YYYY HH:mm:ss");
      await addCommand(timestamp, user, bmo);
      closeAddModal();
    } finally {
      setIsAdding(false);
    }
  };

  return {
    expandedRows,
    loadingRows,
    sortOrder,
    dateFilter,
    isInitialLoading,
    filteredAndSortedData,
    setDateFilter,
    toggleSortOrder,
    handleRowClick,

    editingRow,
    editFormData,
    isSaving,
    setEditFormData,
    openEditModal,
    closeEditModal,
    saveEdit,
    confirmDelete,

    showAddModal,
    addFormData,
    setAddFormData,
    openAddModal,
    closeAddModal,
    saveNewEntry,
    isAdding
  };
}
