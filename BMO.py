import time
import threading
import queue
import json
import sys
import subprocess
import sounddevice as sd
import vosk
from elevenlabs import ElevenLabs
from elevenlabs.play import play
import webbrowser
import pyautogui

from dotenv import load_dotenv
import os

load_dotenv()

MODEL_PATH = os.getenv("INPUT_VOICE_PATH")
SAMPLE_RATE = 16000
DEVICE = None

chrome_path = os.getenv("CHROME_PATH")
webbrowser.register('chrome', None, webbrowser.BackgroundBrowser(chrome_path))

try:
    model = vosk.Model(MODEL_PATH)
except Exception:
    print("Error loading Vosk model")
    sys.exit(1)

audio_q = queue.Queue()

def callback(indata, frames, time_info, status):
    if status:
        print("Status:", status)
    audio_q.put(bytes(indata))

client = ElevenLabs(api_key=os.getenv("ELEVEN_LABS_KEY"))
VOICE_ID = os.getenv("CHOSEN_VOICE")
MODEL_ID = os.getenv("CHOSEN_MODEL")

text_queue = queue.Queue()

def listen_loop():
    rec = vosk.KaldiRecognizer(model, SAMPLE_RATE)
    with sd.RawInputStream(samplerate=SAMPLE_RATE, blocksize=8000, device=DEVICE, dtype='int16', channels=1, callback=callback):
        while True:
            data = audio_q.get()
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                if result.get("text"):
                    text_queue.put(result["text"])

def respond(text):
    try:
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=VOICE_ID,
            model_id=MODEL_ID,
            output_format="mp3_44100_128",
        )
        play(audio)
    except Exception as e:
        print(f"TTS Error: {e}")

def local_bmo_inference(prompt):
    try:
        result = subprocess.run(
            ["ollama", "run", "bmo", prompt],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60
        )
        return result.stdout.strip()
    except subprocess.TimeoutExpired:
        return "BMO timeout."
    except Exception as e:
        print(f"Ollama error: {e}")
        return "Sorry, I couldn't process that request."

def drain_text_queue():
    try:
        while not text_queue.empty():
            text_queue.get_nowait()
    except Exception:
        pass

def main_loop():
    buffer = []
    last_input_time = time.time()
    last_sent_prompt = None
    while True:
        try:
            while not text_queue.empty():
                text = text_queue.get()
                if text and text.strip():
                    buffer.append(text.strip())
                    last_input_time = time.time()
            if buffer and (time.time() - last_input_time > 5):
                prompt = " ".join(buffer).strip().lower()
                buffer.clear()
                if not prompt:
                    drain_text_queue()
                    last_sent_prompt = None
                else:
                    if prompt == last_sent_prompt:
                        drain_text_queue()
                        last_sent_prompt = None
                    else:
                        print(f"Albert Request: {prompt}")
                        if "youtube" in prompt:
                            print(f"BMO response: Opening YouTube in Chrome.")
                            respond("Opening YouTube in Chrome.")
                            webbrowser.get("chrome").open("https://www.youtube.com")

                        elif "what's up" in prompt:
                            print(f"BMO response: Opening WhatsApp.")
                            respond("Opening WhatsApp.")
                            pyautogui.hotkey('win', '2')

                        else:
                            response = local_bmo_inference(prompt)
                            print(f"BMO response: {response}")
                            respond(response)
                        print("\n")
                        last_sent_prompt = prompt
                        drain_text_queue()
                        last_sent_prompt = None
            time.sleep(0.1)
        except KeyboardInterrupt:
            break

threading.Thread(target=listen_loop, daemon=True).start()
main_loop()
