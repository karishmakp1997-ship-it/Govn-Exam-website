# current_affairs/rss_fetcher.py
# Switched from Google News RSS scraping to NewsAPI.org — gives real article images
# directly via urlToImage, no fragile og:image scraping needed.

import requests
from django.conf import settings

CATEGORY_QUERIES = {
    "national": "India national news",
    "economy": "India economy news",
    "international": "India international relations news",
    "science_tech": "India science technology news",
    "environment": "India environment climate news",
    "tamil_nadu": "Tamil Nadu news",
    "sports": "India sports news",
}


def fetch_articles_for_category(category, query, max_items=5):
    """Fetches the latest articles from NewsAPI.org for a given search query."""
    try:
        response = requests.get(
            "https://newsapi.org/v2/everything",
            params={
                "q": query,
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": max_items,
                "apiKey": settings.NEWSAPI_KEY,
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        print(f"[NewsAPI ERROR] {category}: {e}")
        return []

    items = []
    for article in data.get("articles", []):
        items.append({
            "title": article.get("title") or "",
            "link": article.get("url") or "",
            "source": (article.get("source") or {}).get("name", ""),
            "summary_raw": article.get("description") or "",
            "category": category,
            "image_url": article.get("urlToImage"), 
        })
    return items


def fetch_all_categories():
    """Fetches articles for every category in CATEGORY_QUERIES."""
    all_items = []
    for category, query in CATEGORY_QUERIES.items():
        all_items.extend(fetch_articles_for_category(category, query))
    return all_items