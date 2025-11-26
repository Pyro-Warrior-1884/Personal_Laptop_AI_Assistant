import { Title } from "@solidjs/meta";
import "./store.css";

export default function Store() {
  return (
    <div class="store-page">
      <Title>Store</Title>
      <div class="store-content">
        <h1 class="store-title">Welcome to Store</h1>
        <p class="store-subtitle">You have successfully authenticated!</p>
      </div>
    </div>
  );
}