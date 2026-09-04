# performance/ai_insight.py

import requests
from django.conf import settings

SYSTEM_PROMPT = (
    "You are an AI performance coach for an Indian government exam prep platform. "
    "Given a student's subject-wise accuracy data, write ONE short, encouraging but honest "
    "insight (2-3 sentences max) pointing out their weakest subject and a concrete next step "
    "(e.g. revise a specific subject, take a focused quiz). Keep it plain, conversational, no lists, no bold."
)


def generate_performance_insight(subject_mastery: list) -> str:
    if not subject_mastery:
        return "Complete a few mock tests to unlock your personalized performance insights."

    weakest = min(subject_mastery, key=lambda s: s["accuracy"])
    user_content = f"Subject accuracy data: {subject_mastery}. Weakest subject: {weakest['subject']} at {weakest['accuracy']}%."

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "openai/gpt-oss-120b",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content},
                ],
                "temperature": 0.5,
                "max_tokens": 100,
            },
            timeout=15,
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[Performance Insight ERROR] {e}")
        weakest = min(subject_mastery, key=lambda s: s["accuracy"])
        return f"Your accuracy in {weakest['subject']} is {weakest['accuracy']}%. Consider revisiting this subject before your next mock test."