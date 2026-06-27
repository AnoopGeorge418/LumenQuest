import random

import httpx

from app.core.config.config import APP_SETTINGS
from app.modules.discover.schema import ResponseBibleBookSchema, ResponseBibleChapterSchema, ResponseBibleTranslationSchema


class BibleApiClient:
    """Fetches data from AoLabs Free Bible API and Formats and organizes into readable clean format."""

    def __init__(self):
        self.BASE_URL = APP_SETTINGS.BIBLE_BASE_API_URL
        self.BIBLE_DEFAULT_COVER_URL = {
            "image1": "https://pub-06cf38bf398a4f58b7c303fe9d4bdbf5.r2.dev/bible_covers/bible.png",
            "image2": "https://pub-06cf38bf398a4f58b7c303fe9d4bdbf5.r2.dev/bible_covers/bible2.png",
        }

    async def get_bible_translation_list(self) -> list[ResponseBibleTranslationSchema]:
        """Fetch meta data for Books based on Translation."""
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{self.BASE_URL}/available_translations.json")
            response.raise_for_status()  # error handling
            res = response.json()
            translations = res["translations"]

            cover_images = list(self.BIBLE_DEFAULT_COVER_URL.values())

            return [
                ResponseBibleTranslationSchema(
                    id=translation["id"],
                    english_name=translation["englishName"],
                    language=translation["languageEnglishName"],
                    available_formats=translation["availableFormats"],
                    number_of_books=translation["numberOfBooks"],
                    total_number_of_chapters=translation["totalNumberOfChapters"],
                    total_number_of_verses=translation["totalNumberOfVerses"],
                    cover_image = random.choice(cover_images)
                )
                for translation in translations
            ]

    async def get_bible_book(self, translation: str) -> list[ResponseBibleBookSchema]:
        """Fetches Books information"""

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.BASE_URL}/{translation}/books.json")
            response.raise_for_status()
            res = response.json()
            books = res["books"]

            return [
                ResponseBibleBookSchema(
                    id = book["id"],
                    translationId = book["translationId"],
                    name = book["name"],
                    title = book["title"],
                    order = book["order"],
                    number_of_chapters = book["numberOfChapters"],
                    first_chapter_number = book["firstChapterNumber"],
                    first_chapter_api_link = book["firstChapterApiLink"],
                    last_chapter_number = book["lastChapterNumber"],
                    last_chapter_api_link = book["lastChapterApiLink"],
                    total_number_of_verses = book["totalNumberOfVerses"]
                )
                for book in books
            ]
            
    async def get_bible_chapter(self, translation: str, books: str, chapter: str) -> ResponseBibleChapterSchema:
        """Fetcher chapter for book"""
        
        async with httpx.AsyncClient() as client:
            
            response = await client.get(f"{self.BASE_URL}/{translation}/{books}/{chapter}.json")
            response.raise_for_status()
            res = response.json()
            chapters = res["chapter"]

            chapter_number = chapters["number"]

            # content
            chapter_content = chapters["content"]
            
            current_heading = None
            content = []
            
            for item in chapter_content:
                if item["type"] == "heading":
                    current_heading = item["content"][0]
            
                elif item["type"] == "verse":
                    content.append({
                        "chapter_heading": current_heading,
                        "verse_number": item["number"],
                        "verse_text": "".join(
                            part
                            for part in item["content"]
                            if isinstance(part, str)
                        )
                    })
            
            return ResponseBibleChapterSchema(
                chapter_number=chapter_number,
                content=content
            )
    