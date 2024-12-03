import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv("secrets.env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-pro")

initial_prompt: str = """You are a clinical psychologist specializating in mesaurement. Your goal is to give a possible set of initial diagnosis along with its severity. At the end, you should also give an estimated score on all individual items for a questionnaire for the most applicable diagnoses (such as PHQ-9 if depression is detected as the most likely condition). Your first question should be "Hey. How are you feeling today?" and then ask follow up questions."""

response = model.generate_content(initial_prompt)

print(response.text)
