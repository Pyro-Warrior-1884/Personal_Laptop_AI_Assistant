import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import "./store.css";
import CurrentView from "../chat/CurrentView";
import HistoryView from "../chat/HistoryView";

type Tab = "current" | "history";

export default function Store() {
  const [activeTab, setActiveTab] = createSignal<Tab>("current");

  return (
    <div class="store-page">
      <Title>Assistant</Title>
      
      <div class="store-container">
        <div class="tab-navigation">
          <button
            class={`tab-button ${activeTab() === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            Latest
          </button>
          <button
            class={`tab-button ${activeTab() === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        <div class="tab-content">
          {activeTab() === "current" ? (
            <CurrentView />
          ) : (
            <HistoryView />
          )}
        </div>
      </div>
    </div>
  );
}