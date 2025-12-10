import { Title } from "@solidjs/meta";
import { createSignal, onMount } from "solid-js";
import "./store.css";
import CurrentView from "../chat/CurrentView";
import HistoryView from "../chat/HistoryView";
import CustomCommands from "../chat/CustomCommands"; 
import { useHistoryController } from "../chat/useHistory";

type Tab = "current" | "history" | "commands"; 

export default function Store() {
  const [activeTab, setActiveTab] = createSignal<Tab>("current");
  const [latest, setLatest] = createSignal(null);

  const { loadLatestEntry } = useHistoryController();

  onMount(async () => {
    const data = await loadLatestEntry();
    setLatest(data);
  });

  async function switchTab(tab: Tab) {
    setActiveTab(tab);

    if (tab === "current") {
      const data = await loadLatestEntry();
      setLatest(data);
    }
  }

  return (
    <div class="store-page">
      <Title>Assistant</Title>

      <div class="store-container">
        <div class="tab-navigation">
          <button
            class={`tab-button ${activeTab() === "current" ? "active" : ""}`}
            onClick={() => switchTab("current")}
          >
            Latest
          </button>

          <button
            class={`tab-button ${activeTab() === "history" ? "active" : ""}`}
            onClick={() => switchTab("history")}
          >
            History
          </button>

          <button
            class={`tab-button ${activeTab() === "commands" ? "active" : ""}`}
            onClick={() => switchTab("commands")}
          >
            Custom Commands
          </button>
        </div>

        <div class="tab-content">
          {activeTab() === "current" ? (
            <CurrentView latest={latest()} />
          ) : activeTab() === "history" ? (
            <HistoryView />
          ) : (
            <CustomCommands /> 
          )}
        </div>
      </div>
    </div>
  );
}
