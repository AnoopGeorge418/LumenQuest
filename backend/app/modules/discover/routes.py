from fastapi import APIRouter

from app.modules.discover.bible_client import BibleApiClient
from app.modules.discover.schema import ResponseBibleBookSchema, ResponseBibleChapterSchema, ResponseBibleTranslationSchema

bible_client = BibleApiClient()

discover_route = APIRouter(prefix="/discover")

# Bible Routes
@discover_route.get("/bible-books/translation", response_model=list[ResponseBibleTranslationSchema])
async def get_bible_translations_lists():
    return await bible_client.get_bible_translation_list()

@discover_route.get('/bible-books/{translation}/books', response_model=list[ResponseBibleBookSchema])
async def get_bible_book(translation: str):
	return await bible_client.get_bible_book(translation)

@discover_route.get("/bible-books/{translation}/{books}/{chapter}", response_model=ResponseBibleChapterSchema)
async def get_bible_chapters(translation: str, books: str, chapter: str):
    return await bible_client.get_bible_chapter(translation, books, chapter)
    
