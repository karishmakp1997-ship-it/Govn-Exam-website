# ai_coach/groq_client.py

import requests
from django.conf import settings

SYSTEM_PROMPT = (
    "You are Vetri AI Coach, a helpful assistant for Indian government exam aspirants "
    "(UPSC, TNPSC, SSC, Railways, Banking, etc.) on the Vetri AI Coach platform. "
    "Help with eligibility, deadlines, exam patterns, study planning, and general motivation. "
    "Keep answers concise, friendly, and specific to Indian government exams. "
    "If asked about site features, mention: Eligibility Checker, Mock Tests, Study Materials, "
    "My Exams tracking, and Premium plans. If unsure about a specific exam detail, tell the user "
    "to check the exam's official notification or the site's Exam Detail page rather than guessing."
)


def get_ai_reply(message: str, history: list | None = None) -> str:
    """
    Calls the Groq Cloud chat completions API (OpenAI-compatible).
    history: optional list of {"role": "user"|"assistant", "content": "..."} for context.
    Returns the assistant's reply text, or a graceful fallback message on failure.
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        messages.extend(history[-10:])  
    messages.append({"role": "user", "content": message})

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-oss-120b",
                "messages": messages,
                "temperature": 0.5,
            },
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except requests.RequestException as e:
        print(f"[Groq API ERROR] {e}")
        if hasattr(e, "response") and e.response is not None:
            print(f"[Groq API RESPONSE BODY] {e.response.text}")
        return (
            "Sorry, I'm having trouble connecting right now. Please try again in a moment, "
            "or check our Eligibility Checker / Mock Tests / Study Materials pages directly."
        )
    except (KeyError, IndexError) as e:
        print(f"[Groq API PARSE ERROR] {e}")
        return "Sorry, I couldn't generate a reply just now. Please try rephrasing your question."