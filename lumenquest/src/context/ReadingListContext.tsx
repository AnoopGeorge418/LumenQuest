import { createContext, useContext, useState, ReactNode } from "react";

export type BookEntry = {
    id: string;
    name: string;
    translationId: string;
    numberOfChapters: number;
    totalVerses: number;
    firstChapter: number;
    lastChapter: number;
    order?: number;
    addedAt: number; // timestamp
};

type ReadingListContextType = {
    bookmarks: BookEntry[];
    planned: BookEntry[];
    addBookmark: (book: BookEntry) => void;
    removeBookmark: (id: string, translationId: string) => void;
    isBookmarked: (id: string, translationId: string) => boolean;
    addPlanned: (book: BookEntry) => void;
    removePlanned: (id: string, translationId: string) => void;
    isPlanned: (id: string, translationId: string) => boolean;
};

const ReadingListContext = createContext<ReadingListContextType | null>(null);

export const ReadingListProvider = ({ children }: { children: ReactNode }) => {
    const [bookmarks, setBookmarks] = useState<BookEntry[]>([]);
    const [planned, setPlanned] = useState<BookEntry[]>([]);

    const makeKey = (id: string, translationId: string) => `${translationId}::${id}`;

    const addBookmark = (book: BookEntry) => {
        setBookmarks((prev) => {
            if (prev.some((b) => makeKey(b.id, b.translationId) === makeKey(book.id, book.translationId))) return prev;
            return [book, ...prev];
        });
    };

    const removeBookmark = (id: string, translationId: string) => {
        setBookmarks((prev) => prev.filter((b) => makeKey(b.id, b.translationId) !== makeKey(id, translationId)));
    };

    const isBookmarked = (id: string, translationId: string) =>
        bookmarks.some((b) => makeKey(b.id, b.translationId) === makeKey(id, translationId));

    const addPlanned = (book: BookEntry) => {
        setPlanned((prev) => {
            if (prev.some((b) => makeKey(b.id, b.translationId) === makeKey(book.id, book.translationId))) return prev;
            return [book, ...prev];
        });
    };

    const removePlanned = (id: string, translationId: string) => {
        setPlanned((prev) => prev.filter((b) => makeKey(b.id, b.translationId) !== makeKey(id, translationId)));
    };

    const isPlanned = (id: string, translationId: string) =>
        planned.some((b) => makeKey(b.id, b.translationId) === makeKey(id, translationId));

    return (
        <ReadingListContext.Provider
            value={{ bookmarks, planned, addBookmark, removeBookmark, isBookmarked, addPlanned, removePlanned, isPlanned }}
        >
            {children}
        </ReadingListContext.Provider>
    );
};

export const useReadingList = () => {
    const ctx = useContext(ReadingListContext);
    if (!ctx) throw new Error("useReadingList must be used within ReadingListProvider");
    return ctx;
};