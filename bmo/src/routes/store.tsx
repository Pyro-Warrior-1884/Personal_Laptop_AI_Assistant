import { Title } from "@solidjs/meta";

export default function Store() {
  return (
    <div class="store-page">
      <Title>Store</Title>
      <style>{`
        .store-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a1628 0%, #0d2847 50%, #1a3a5c 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .store-content {
          text-align: center;
        }

        .store-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .store-subtitle {
          font-size: 20px;
          color: #93c5fd;
        }
      `}</style>
      <div class="store-content">
        <h1 class="store-title">Welcome to Store</h1>
        <p class="store-subtitle">You have successfully authenticated!</p>
      </div>
    </div>
  );
}