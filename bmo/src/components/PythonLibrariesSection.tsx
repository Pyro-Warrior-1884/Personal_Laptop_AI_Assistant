export default function PythonLibrariesSection() {
  return (
    <div class="section-text">
      <h2 class="section-title">Python Libraries</h2>

      <p class="section-paragraph">
        The backend of BMO is built upon a combination of Python libraries that
        enable audio processing, automation, model inference, and data
        persistence. These tools form the operational core of the assistant
        and ensure reliable communication between the speech pipeline, the
        local language model, and the system-level automation layer.<br />
        <strong>Libraries:</strong> threading, queue, subprocess, json, time, datetime
      </p>
      <br />

      <p class="section-paragraph">
        The audio subsystem uses libraries dedicated to capturing microphone
        input, buffering raw audio, and converting speech into text through a
        continuous recognition loop. This enables real-time voice processing
        while handling fluctuations in audio quality.<br />
        <strong>Libraries:</strong> sounddevice, vosk
      </p>
      <br />

      <p class="section-paragraph">
        For generating spoken responses, the system integrates a client that
        transforms text output into natural voice audio. It manages API
        requests, handles streaming playback, and ensures smooth delivery of
        assistant responses.<br />
        <strong>Libraries:</strong> elevenlabs, elevenlabs.play
      </p>
      <br />

      <p class="section-paragraph">
        The automation module relies on libraries that interact with the local
        operating system, enabling the assistant to trigger key presses,
        execute system commands, and open applications programmatically.<br />
        <strong>Libraries:</strong> pyautogui, webbrowser, os, sys
      </p>
      <br />

      <p class="section-paragraph">
        Additional utilities support environment configuration, concurrency,
        and interaction with external processes. These libraries ensure stable
        operation, non-blocking execution, and consistent runtime behavior
        across all modules.<br />
        <strong>Libraries:</strong> dotenv, threading, subprocess, queue
      </p>
      <br />

      <p class="section-paragraph">
        The project also incorporates a realtime database client for storing
        structured interaction logs. This allows the assistant to persist
        conversations securely and access them later for review or analysis.<br />
        <strong>Libraries:</strong> firebase_admin
      </p>
      <br />
    </div>
  );
}
