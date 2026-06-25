from typing import Any, Literal, Union

from pydantic import BaseModel


class ResponseBibleTranslationSchema(BaseModel):
    id: str
    english_name: str
    language: str
    available_formats: list[str]
    number_of_books: int
    total_number_of_chapters: int
    total_number_of_verses: int


class ResponseBibleBookSchema(BaseModel):
    id: str
    translationId: str
    name: str
    title: str
    order: int
    number_of_chapters: int
    first_chapter_number: int
    first_chapter_api_link: str
    last_chapter_number: int
    last_chapter_api_link: str
    total_number_of_verses: int


class ResponseBibleChapterSchema(BaseModel):
    chapter_number: int 
    chapter_heading: list[Any]
    verse_number: list[Any]
    verse_content: list[Any]

