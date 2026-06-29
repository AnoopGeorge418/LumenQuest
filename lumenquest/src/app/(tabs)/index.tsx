import { useAppTheme } from "@/context/ThemeContext";
import { useReadingList, BookEntry } from "@/context/ReadingListContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
    get_bible_translations,
    get_bible_books,
    get_bible_chapter,
} from "@/api/endpoints/books/bibleApi";

const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
};

const getDayOfYear = () =>
    Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const SectionLabel = ({ text, theme }: { text: string; theme: any }) => (
    <Text style={[styles.sectionLabel, { color: theme?.textSecondary }]}>
        {text.toUpperCase()}
    </Text>
);

const BookRow = ({
    book,
    onPress,
    theme,
    showDivider,
    iconName,
}: {
    book: BookEntry;
    onPress: () => void;
    theme: any;
    showDivider: boolean;
    iconName: keyof typeof Ionicons.glyphMap;
}) => (
    <>
        <Pressable onPress={onPress} style={styles.bookRow}>
            <View style={[styles.bookRowIconWrap, { backgroundColor: `${theme?.primary}18` }]}>
                <Ionicons name={iconName} size={16} color={theme?.primary} />
            </View>
            <View style={styles.bookRowBody}>
                <Text style={[styles.bookRowTitle, { color: theme?.textPrimary }]} numberOfLines={1}>
                    {book.name}
                </Text>
                <Text style={[styles.bookRowMeta, { color: theme?.textSecondary }]}>
                    {book.numberOfChapters} chapters · {book.translationId}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={theme?.textSecondary} style={{ opacity: 0.5 }} />
        </Pressable>
        {showDivider && (
            <View style={[styles.rowDivider, { backgroundColor: theme?.card }]} />
        )}
    </>
);

const EmptyShelf = ({
    icon,
    message,
    theme,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    message: string;
    theme: any;
}) => (
    <View style={[styles.emptyShelf, { borderColor: `${theme?.textSecondary}20` }]}>
        <Ionicons name={icon} size={22} color={theme?.textSecondary} style={{ opacity: 0.4 }} />
        <Text style={[styles.emptyShelfText, { color: theme?.textSecondary }]}>{message}</Text>
    </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// Home screen
// ─────────────────────────────────────────────────────────────────────────────

const Home = () => {
    const theme = useAppTheme();
    const router = useRouter();
    const { bookmarks, planned } = useReadingList();

    const [dailyVerse, setDailyVerse] = useState<{ text: string; ref: string } | null>(null);
    const [verseLoading, setVerseLoading] = useState(true);

    useEffect(() => {
        const fetchDailyVerse = async () => {
            try {
                setVerseLoading(true);
                const translations = await get_bible_translations();
                if (!translations?.length) return;
                const tid = translations[0].id;
                const books = await get_bible_books(tid);
                if (!books?.length) return;

                const doy = getDayOfYear();
                const book = books[doy % books.length];
                const chapterNum = book.first_chapter_number ?? 1;
                const chapter = await get_bible_chapter(tid, book.id, chapterNum);
                if (!chapter?.content?.length) return;

                const verse = chapter.content[doy % Math.min(chapter.content.length, 20)];
                setDailyVerse({
                    text: verse.verse_text,
                    ref: `${book.name ?? book.title} ${chapterNum}:${verse.verse_number} · ${tid}`,
                });
            } catch {
                // silent — empty state handles it
            } finally {
                setVerseLoading(false);
            }
        };
        fetchDailyVerse();
    }, []);

    const goToBook = (book: BookEntry) =>
        router.push({ pathname: "/bookDetails", params: { id: book.id, translationId: book.translationId } });

    const goToReader = (book: BookEntry) =>
        router.push({
            pathname: "/readerEngine",
            params: {
                translationId: book.translationId,
                bookId: book.id,
                bookName: book.name,
                chapter: book.firstChapter,
                firstChapter: book.firstChapter,
                lastChapter: book.lastChapter,
            },
        });

    const hasActivity = bookmarks.length > 0 || planned.length > 0;

    return (
        <SafeAreaView style={[styles.root, { backgroundColor: theme?.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: theme?.textSecondary }]}>
                            {getGreeting()}
                        </Text>
                        <Text style={[styles.wordmark, { color: theme?.textPrimary }]}>
                            LumenQuest
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => router.push("/discover")}
                        style={[styles.iconBtn, { backgroundColor: theme?.card }]}
                        accessibilityLabel="Search books"
                    >
                        <Ionicons name="search-outline" size={19} color={theme?.textPrimary} />
                    </Pressable>
                </View>

                {/* ── Verse of the day ───────────────────────────────── */}
                <View style={[styles.verseCard, { backgroundColor: theme?.primary ?? "#4A4A4A" }]}>
                    <View style={styles.verseCardTop}>
                        <Ionicons name="sunny-outline" size={13} color="rgba(255,255,255,0.55)" />
                        <Text style={styles.verseCardEyebrow}>Verse of the day</Text>
                    </View>

                    {verseLoading ? (
                        <ActivityIndicator
                            color="rgba(255,255,255,0.5)"
                            size="small"
                            style={{ marginTop: 16, marginBottom: 4 }}
                        />
                    ) : dailyVerse ? (
                        <>
                            <Text style={styles.verseCardText} numberOfLines={5}>
                                {dailyVerse.text}
                            </Text>
                            <Text style={styles.verseCardRef}>{dailyVerse.ref}</Text>
                        </>
                    ) : (
                        <Text style={styles.verseCardText}>
                            Discover books to see a verse here.
                        </Text>
                    )}
                </View>

                {/* ── Activity stats ─────────────────────────────────── */}
                {hasActivity && (
                    <View style={styles.statsRow}>
                        <View style={[styles.statPill, { backgroundColor: theme?.card }]}>
                            <Ionicons name="bookmark" size={14} color={theme?.primary} />
                            <Text style={[styles.statNum, { color: theme?.textPrimary }]}>
                                {bookmarks.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>
                                {bookmarks.length === 1 ? "bookmark" : "bookmarks"}
                            </Text>
                        </View>
                        <View style={[styles.statPill, { backgroundColor: theme?.card }]}>
                            <Ionicons name="time-outline" size={14} color={theme?.primary} />
                            <Text style={[styles.statNum, { color: theme?.textPrimary }]}>
                                {planned.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>
                                {planned.length === 1 ? "planned" : "to read"}
                            </Text>
                        </View>
                        <View style={[styles.statPill, { backgroundColor: theme?.card }]}>
                            <Ionicons name="layers-outline" size={14} color={theme?.primary} />
                            <Text style={[styles.statNum, { color: theme?.textPrimary }]}>
                                {bookmarks.reduce((s, b) => s + b.numberOfChapters, 0)}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>
                                chapters
                            </Text>
                        </View>
                    </View>
                )}

                {/* ── Quick actions ──────────────────────────────────── */}
                <View style={styles.actions}>
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: theme?.primary ?? "#4A4A4A" }]}
                        onPress={() => router.push("/discover")}
                    >
                        <Ionicons name="compass-outline" size={18} color="#fff" />
                        <Text style={styles.actionBtnText}>Discover</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.actionBtn, styles.actionBtnSecondary, { backgroundColor: theme?.card }]}
                        onPress={() => {
                            if (bookmarks.length > 0) goToReader(bookmarks[0]);
                            else router.push("/discover");
                        }}
                    >
                        <Ionicons name="play-outline" size={18} color={theme?.textPrimary} />
                        <Text style={[styles.actionBtnTextSecondary, { color: theme?.textPrimary }]}>
                            {bookmarks.length > 0 ? "Continue reading" : "Start reading"}
                        </Text>
                    </Pressable>
                </View>

                {/* ── Bookmarks ──────────────────────────────────────── */}
                <View style={styles.section}>
                    <SectionLabel text="Bookmarked" theme={theme} />

                    {bookmarks.length > 0 ? (
                        <View style={[styles.shelf, { backgroundColor: theme?.card }]}>
                            {bookmarks.slice(0, 6).map((book, i) => (
                                <BookRow
                                    key={`${book.translationId}-${book.id}`}
                                    book={book}
                                    onPress={() => goToBook(book)}
                                    theme={theme}
                                    iconName="bookmark"
                                    showDivider={i < Math.min(bookmarks.length, 6) - 1}
                                />
                            ))}
                            {bookmarks.length > 6 && (
                                <Pressable
                                    onPress={() => router.push("/discover")}
                                    style={[styles.seeMore, { borderTopColor: `${theme?.textSecondary}15` }]}
                                >
                                    <Text style={[styles.seeMoreText, { color: theme?.primary }]}>
                                        {bookmarks.length - 6} more
                                    </Text>
                                    <Ionicons name="chevron-forward" size={13} color={theme?.primary} />
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        <EmptyShelf
                            icon="bookmark-outline"
                            message="Tap the bookmark icon on any book to save it here."
                            theme={theme}
                        />
                    )}
                </View>

                {/* ── Plan to read ───────────────────────────────────── */}
                <View style={styles.section}>
                    <SectionLabel text="Plan to read" theme={theme} />

                    {planned.length > 0 ? (
                        <View style={[styles.shelf, { backgroundColor: theme?.card }]}>
                            {planned.slice(0, 6).map((book, i) => (
                                <BookRow
                                    key={`${book.translationId}-${book.id}`}
                                    book={book}
                                    onPress={() => goToBook(book)}
                                    theme={theme}
                                    iconName="time-outline"
                                    showDivider={i < Math.min(planned.length, 6) - 1}
                                />
                            ))}
                            {planned.length > 6 && (
                                <Pressable
                                    style={[styles.seeMore, { borderTopColor: `${theme?.textSecondary}15` }]}
                                >
                                    <Text style={[styles.seeMoreText, { color: theme?.primary }]}>
                                        {planned.length - 6} more
                                    </Text>
                                    <Ionicons name="chevron-forward" size={13} color={theme?.primary} />
                                </Pressable>
                            )}
                        </View>
                    ) : (
                        <EmptyShelf
                            icon="time-outline"
                            message="Add books from Discover to build your reading list."
                            theme={theme}
                        />
                    )}
                </View>

                {/* ── Footer explore nudge ───────────────────────────── */}
                <Pressable
                    style={[styles.exploreRow, { backgroundColor: theme?.card }]}
                    onPress={() => router.push("/discover")}
                >
                    <View style={[styles.exploreIcon, { backgroundColor: `${theme?.primary}18` }]}>
                        <Ionicons name="library-outline" size={18} color={theme?.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.exploreTitle, { color: theme?.textPrimary }]}>
                            Explore the Bible
                        </Text>
                        <Text style={[styles.exploreSub, { color: theme?.textSecondary }]}>
                            66 books · multiple translations
                        </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={theme?.textSecondary} style={{ opacity: 0.5 }} />
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingBottom: 48 },

    // Header
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 22,
    },
    greeting: {
        fontFamily: "Playfair-Regular",
        fontSize: 12,
        letterSpacing: 0.3,
        marginBottom: 2,
    },
    wordmark: {
        fontFamily: "PlayfairDisplay-Regular",
        fontSize: 28,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    // Verse card
    verseCard: {
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
    },
    verseCardTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 14,
    },
    verseCardEyebrow: {
        fontFamily: "Playfair-Bold",
        fontSize: 10,
        letterSpacing: 1.2,
        color: "rgba(255,255,255,0.55)",
        textTransform: "uppercase",
    },
    verseCardText: {
        fontFamily: "PlayfairDisplay-Regular",
        fontSize: 15,
        color: "#fff",
        lineHeight: 24,
        marginBottom: 12,
    },
    verseCardRef: {
        fontFamily: "Playfair-Regular",
        fontSize: 11,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 0.3,
    },

    // Stats
    statsRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 14,
    },
    statPill: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: "center",
        gap: 3,
    },
    statNum: {
        fontFamily: "Playfair-Bold",
        fontSize: 17,
        marginTop: 2,
    },
    statLabel: {
        fontFamily: "Playfair-Regular",
        fontSize: 10,
        letterSpacing: 0.2,
    },

    // Actions
    actions: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 28,
    },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        paddingVertical: 13,
        borderRadius: 12,
    },
    actionBtnSecondary: {},
    actionBtnText: {
        fontFamily: "Playfair-Bold",
        fontSize: 14,
        color: "#fff",
    },
    actionBtnTextSecondary: {
        fontFamily: "Playfair-Bold",
        fontSize: 14,
    },

    // Section
    section: { marginBottom: 24 },
    sectionLabel: {
        fontFamily: "Playfair-Bold",
        fontSize: 10,
        letterSpacing: 1.4,
        marginBottom: 10,
    },

    // Shelf (card list)
    shelf: {
        borderRadius: 14,
        overflow: "hidden",
    },

    // Book row
    bookRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
    },
    bookRowIconWrap: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
    },
    bookRowBody: { flex: 1 },
    bookRowTitle: {
        fontFamily: "Playfair-Bold",
        fontSize: 14,
        marginBottom: 2,
    },
    bookRowMeta: {
        fontFamily: "Playfair-Regular",
        fontSize: 12,
    },
    rowDivider: {
        height: 1,
        marginLeft: 60,
        opacity: 0.5,
    },

    // See more
    seeMore: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 11,
        borderTopWidth: 1,
    },
    seeMoreText: {
        fontFamily: "Playfair-Bold",
        fontSize: 12,
        letterSpacing: 0.2,
    },

    // Empty shelf
    emptyShelf: {
        borderRadius: 14,
        borderWidth: 1,
        borderStyle: "dashed",
        paddingVertical: 22,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    emptyShelfText: {
        fontFamily: "Playfair-Regular",
        fontSize: 13,
        flex: 1,
        lineHeight: 19,
        opacity: 0.7,
    },

    // Explore row
    exploreRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderRadius: 14,
        padding: 14,
    },
    exploreIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    exploreTitle: {
        fontFamily: "Playfair-Bold",
        fontSize: 14,
        marginBottom: 2,
    },
    exploreSub: {
        fontFamily: "Playfair-Regular",
        fontSize: 12,
    },
});
