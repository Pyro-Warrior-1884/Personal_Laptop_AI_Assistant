import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Personal Laptop AI Assistant</Title>
          <nav class="navbar">
            <div class="navbar-container">
              <div class="navbar-brand">
                <a href="/" class="brand-link">
                  <img src="/bmo.png" alt="Logo" class="logo-image" />
                </a>
              </div>
              <div class="navbar-menu">
                <a href="/" class="nav-link">Main</a>
                <a href="/chats" class="nav-link">Chats</a>
              </div>
            </div>
          </nav>
          <main class="main-content">
            <Suspense>{props.children}</Suspense>
          </main>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
