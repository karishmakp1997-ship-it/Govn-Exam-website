# current_affairs/management/commands/fetch_news.py
#
# Folder structure needed:
#   current_affairs/management/__init__.py   (empty file)
#   current_affairs/management/commands/__init__.py   (empty file)
#   current_affairs/management/commands/fetch_news.py  (this file)

import time
from django.core.management.base import BaseCommand
from current_affairs.models import Article
from current_affairs.rss_fetcher import fetch_all_categories
from current_affairs.ai_processor import summarize_and_tag


class Command(BaseCommand):
    help = "Fetches latest news from Google News RSS, summarizes with AI, and saves new articles."

    def handle(self, *args, **options):
        items = fetch_all_categories()
        self.stdout.write(f"Fetched {len(items)} items from RSS.")

        created_count = 0
        skipped_count = 0

        for item in items:
            # Duplicate filtering — skip if this source URL is already saved
            if Article.objects.filter(source_url=item["link"]).exists():
                skipped_count += 1
                continue

            ai_result = summarize_and_tag(item["title"], item["summary_raw"])

            Article.objects.create(
                title=item["title"],
                category=item["category"],
                excerpt=ai_result["summary"][:500],
                content=ai_result["summary"],
                source_url=item["link"],
                source_name=item["source"],
                ai_summary=ai_result["summary"],
                image_url=item.get("image_url"),
                exam_relevance=ai_result["relevance"],
            )
            created_count += 1
            time.sleep(1)  # be gentle on the Groq free-tier rate limit

        self.stdout.write(self.style.SUCCESS(
            f"Done. Created {created_count} new articles, skipped {skipped_count} duplicates."
        ))