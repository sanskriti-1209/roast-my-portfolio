import os
import requests

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://roast-my-portfolio.netlify.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)


class PortfolioRequest(BaseModel):
    url: str


class PortfolioReview(BaseModel):
    ui_ux_score: int
    performance_score: int
    accessibility_score: int
    strengths: list[str]
    suggestions: list[str]


@app.get("/")
def home():
    return {
        "message": "Roast My Portfolio backend is working!"
    }


@app.get("/test-ai")
def test_ai():
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": "Say hello to Roast My Portfolio in one short sentence."
            }
        ],
    )

    return {
        "ai_response": response.choices[0].message.content
    }


@app.post("/review")
def review_portfolio(data: PortfolioRequest):

    response = requests.get(
        data.url,
        timeout=10,
        headers={
            "User-Agent": "Mozilla/5.0"
        }
    )

    response.raise_for_status()

    html = response.text[:12000]

    prompt = f"""
You are an expert portfolio website reviewer.

Analyze the following HTML:

{html}

Evaluate:
- UI/UX
- Performance
- Accessibility

Return ONLY valid JSON in this exact format:

{{
  "ui_ux_score": 0,
  "performance_score": 0,
  "accessibility_score": 0,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]
}}

Scores must be between 0 and 100.
Give exactly 3 strengths and exactly 5 suggestions.
Keep suggestions practical for a student developer.
"""

    ai_response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    text = ai_response.choices[0].message.content

    import json

    review = json.loads(text)

    return {
        "url": data.url,
        "review": review
    }