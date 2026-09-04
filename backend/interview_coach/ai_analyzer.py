# interview_coach/ai_analyzer.py

import requests
import re
from django.conf import settings

SYSTEM_PROMPT = (
    "You are an expert interview panel member evaluating a candidate's mock interview "
    "for an Indian government job (UPSC/TNPSC/SSC/Banking/Railways). "
    "Given the full question-and-answer transcript, score the candidate on 4 dimensions, "
    "each out of 100, and give 2-3 sentences of improvement areas. "
    "Respond in EXACTLY this format, nothing else:\n"
    "KNOWLEDGE: <score>\n"
    "COMMUNICATION: <score>\n"
    "RELEVANCE: <score>\n"
    "CONFIDENCE: <score>\n"
    "IMPROVEMENT: <2-3 sentences, specific and constructive, plain text no lists>"
)


def analyze_interview(transcript: list) -> dict:
    """
    transcript: list of {"question": "...", "answer": "..."}
    Returns {"knowledge_score", "communication_score", "relevance_score", "confidence_score", "improvement_areas"}
    Falls back to safe neutral defaults on failure.
    """
    transcript_text = "\n\n".join(
        f"Q: {t['question']}\nA: {t['answer']}" for t in transcript
    )

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
                    {"role": "user", "content": transcript_text},
                ],
                "temperature": 0.4,
                "max_tokens": 300,
            },
            timeout=25,
        )
        response.raise_for_status()
        text = response.json()["choices"][0]["message"]["content"]

        def extract_score(label, default=60):
            match = re.search(rf"{label}:\s*(\d+)", text)
            return min(100, max(0, int(match.group(1)))) if match else default

        improvement_match = re.search(r"IMPROVEMENT:\s*(.+)", text, re.DOTALL)
        improvement = improvement_match.group(1).strip() if improvement_match else "Keep practicing — focus on clear, structured answers."

        return {
            "knowledge_score": extract_score("KNOWLEDGE"),
            "communication_score": extract_score("COMMUNICATION"),
            "relevance_score": extract_score("RELEVANCE"),
            "confidence_score": extract_score("CONFIDENCE"),
            "improvement_areas": improvement,
        }
    except Exception as e:
        print(f"[Interview Analyzer ERROR] {e}")
        return {
            "knowledge_score": 60,
            "communication_score": 60,
            "relevance_score": 60,
            "confidence_score": 60,
            "improvement_areas": "We couldn't fully analyze your interview this time. Try again for detailed feedback.",
        }