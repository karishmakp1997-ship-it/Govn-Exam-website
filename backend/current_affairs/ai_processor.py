# current_affairs/ai_processor.py

import requests
import re
from django.conf import settings

SYSTEM_PROMPT = (
    "You summarize Indian current affairs news for government exam aspirants "
    "(UPSC, TNPSC, SSC, Banking, Railways, Defence exams). "
    "Given a news headline and raw snippet, respond in EXACTLY this format, nothing else:\n"
    "SUMMARY: <one or two plain sentences summarizing the news, no fluff>\n"
    "RELEVANCE: <comma-separated list of which exams this is relevant to, from: UPSC, TNPSC, SSC, Banking, Railways, Defence — "
    "pick only the ones that genuinely apply, at least one>"
)


def summarize_and_tag(title: str, raw_snippet: str) -> dict:
    """
    Calls Groq to generate a short summary and exam-relevance tags for one article.
    Returns {"summary": "...", "relevance": "UPSC, SSC"} — falls back to safe defaults on failure.
    """
    user_content = f"Headline: {title}\nSnippet: {raw_snippet}"

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
                "temperature": 0.3,
                "max_tokens": 120,
            },
            timeout=20,
        )
        response.raise_for_status()
        text = response.json()["choices"][0]["message"]["content"]

        summary_match = re.search(r"SUMMARY:\s*(.+)", text)
        relevance_match = re.search(r"RELEVANCE:\s*(.+)", text)

        summary = summary_match.group(1).strip() if summary_match else raw_snippet[:200]
        relevance = relevance_match.group(1).strip() if relevance_match else "UPSC"

        return {"summary": summary, "relevance": relevance}
    except Exception as e:
        print(f"[AI Processor ERROR] {e}")
        return {"summary": raw_snippet[:200] or title, "relevance": "UPSC"}