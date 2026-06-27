import { api } from "@/api/client"

export const get_bible_translations = async () => {
    const res = await api.get(`/discover/bible-books/translation`)
    return res.data
}

export const get_bible_books = async () => {
    const res = await api.get(`/discover/bible-books/{translation}/books`)
    return res.data
}
