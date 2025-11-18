import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import Store from "./store";
import "./chats.css"

export default function PasswordPage() {
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [error, setError] = createSignal('');
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isFadingOut, setIsFadingOut] = createSignal(false);
  let errorTimeout;
  let fadeTimeout;

  const showError = (message) => {
    setError(message);
    setIsFadingOut(false);
    
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    
    fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 9000);
    
    errorTimeout = setTimeout(() => {
      setError('');
      setIsFadingOut(false);
    }, 10000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    if (fadeTimeout) {
      clearTimeout(fadeTimeout);
    }
    
    setError('');
    setIsFadingOut(false);

    const pwd = password().trim();

    if (pwd === '') {
      showError('Please enter a password');
      return;
    }

    if (pwd !== process.env.VITE_PASSWORD) {
      showError('Wrong password. Please try again');
      return;
    }

    setIsAuthenticated(true);
  };

  return (
    <>
      <Show
        when={isAuthenticated()}
        fallback={
          <main class="password-page">
            <Title>Enter Password</Title>
            <div class="password-container">
              <div class="password-card">
                <div class="header">
                  <div class="icon-container">
                    <svg class="lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 class="title">Enter Password</h2>
                  <p class="subtitle">Please enter the password to proceed</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div class="input-group">
                    <label class="label">Password</label>
                    <div class="input-wrapper">
                      <input
                        type={showPassword() ? 'text' : 'password'}
                        value={password()}
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        placeholder="Enter your password"
                        class="password-input"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        class="toggle-btn"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword() ? (
                          <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg class="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" class="submit-btn">
                    Continue
                  </button>

                  <a href="#" class="forgot-link">
                    Send request for the password?
                  </a>
                </form>
              </div>
              
              <Show when={error()}>
                <div class={`error-message ${isFadingOut() ? 'fade-out' : ''}`}>
                  {error()}
                </div>
              </Show>
            </div>
          </main>
        }
      >
        <Store />
      </Show>
    </>
  );
}