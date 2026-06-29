import { api } from "@/api/client";

export const get_bible_translations = async () => {
    const res = await api.get(`/discover/bible-books/translation`);
    return res.data;
};

export const get_bible_books = async (translationID: string) => {
    if (!translationID) {
        throw new Error("Translation ID is required to fetch books.");
    }
    const res = await api.get(`/discover/bible-books/${translationID}/books`);
    return res.data;
};

export const get_bible_chapter = async (
    translationID: string,
    bookId: string,
    chapter: number | string
) => {
    if (!translationID || !bookId || !chapter) {
        throw new Error("translationID, bookId, and chapter are all required.");
    }
    const res = await api.get(`/discover/bible-books/${translationID}/${bookId}/${chapter}`);
    return res.data;
};