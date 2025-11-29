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
from datetime import datetime

from dotenv import load_dotenv
import os

load_dotenv()

from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("Error: MONGO_URI is not set in .env")
    sys.exit(1)
    
global_record_id = 1

try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.admin.command("ping")
    mongo_db = mongo_client.get_default_database()
    if mongo_db is not None:
        mongo_db = mongo_client["BMO"]  
    bmo_collection = mongo_db["chat"]
    print("Connected to MongoDB Atlas.")
except Exception as e:
    print("Error connecting to MongoDB Atlas:", e)
    sys.exit(1)

conversation_buffer = []

MODEL_PATH = os.getenv("INPUT_VOICE_PATH")
SAMPLE_RATE = 16000
DEVICE = None

chrome_path = os.getenv("CHROME_PATH")
if chrome_path:
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
    respond("BMO Active.")
    global conversation_buffer
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
                        if "up" == prompt:
                            if conversation_buffer:
                                try:
                                    global global_record_id

                                    for exchange in conversation_buffer:

                                        record = {
                                            "id": global_record_id,
                                            "user_response": exchange["albert"]["message"],
                                            "bmo_response": exchange["bmo"]["message"],
                                            "timestamp": exchange["bmo"]["timestamp"]
                                        }

                                        bmo_collection.insert_one(record)
                                        global_record_id += 1

                                    respond("Conversation sent to database, sir.")
                                    print("BMO response: Conversation records sent to MongoDB.")

                                    conversation_buffer = []

                                except Exception as e:
                                    print("MongoDB insert error:", e)
                                    respond("Sorry Sir, I couldn't save the conversation to MongoDB.")

                            else:
                                

                                bmo_response = "BMO response: Sorry Sir, No conversation to send yet."
                                respond("Sorry Sir, No conversation to send yet.")

                        elif "hello" in prompt:
                            bmo_response = "BMO response: Yes Sir."
                            print("BMO response: Yes Sir.")
                            respond("Yes Sir.")

                        elif prompt == "watch":
                            bmo_response = "BMO response: Opening YouTube in Chrome."
                            print("BMO response: Opening YouTube in Chrome.")
                            respond("Yes Sir, Opening YouTube in Chrome.")
                            webbrowser.get("chrome").open("https://www.youtube.com")

                        elif "what's up" in prompt:
                            bmo_response = "BMO response: Opening WhatsApp."
                            print("BMO response: Opening WhatsApp.")
                            respond("Yes Sir, Opening WhatsApp.")
                            pyautogui.hotkey('win', '2')

                        elif "business account" in prompt:
                            bmo_response = "BMO response: Opening Linkedin."
                            print("BMO response: Opening Linkedin.")
                            respond("Yes Sir, Opening Linkedin.")
                            webbrowser.get("chrome").open("https://www.linkedin.com/in/albertaugustine1884/")

                        elif "code" == prompt:
                            bmo_response = "BMO response: Opening VS Code."
                            print("BMO response: Opening VS Code.")
                            respond("Yes Sir, Opening VS Code.")
                            pyautogui.hotkey('win', '3')

                        else:
                            response = local_bmo_inference(prompt)
                            bmo_response = f"BMO response: Yes sir, {response}"
                            print(f"BMO response: Yes sir, {response}")
                            respond(f"Yes sir, {response}")
                        print("\n")
                        last_sent_prompt = prompt
                        drain_text_queue()
                        last_sent_prompt = None
                        exchange = {
                            "albert": {
                                "message": f"Albert Request: {prompt}"
                            },
                            "bmo": {
                                "message": bmo_response,
                                "timestamp": datetime.utcnow().strftime("%d-%m-%Y %H:%M:%S")
                            }
                        }

                        conversation_buffer.append(exchange)

            time.sleep(0.1)
        except KeyboardInterrupt:
            break

threading.Thread(target=listen_loop, daemon=True).start()
main_loop()
