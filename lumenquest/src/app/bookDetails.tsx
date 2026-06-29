import { get_bible_books } from "@/api/endpoints/books/bibleApi";
import { useAppTheme } from "@/context/ThemeContext";
import { useReadingList } from "@/context/ReadingListContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const BookDetails = () => {
    const theme = useAppTheme();
    const router = useRouter();
    const { addBookmark, removeBookmark, isBookmarked, addPlanned, removePlanned, isPlanned } = useReadingList();

    const [book, setBook] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const params = useLocalSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const translationId = Array.isArray(params.translationId) ? params.translationId[0] : params.translationId;

    const bookmarked = isBookmarked(id, translationId);
    const planned = isPlanned(id, translationId);

    useEffect(() => {
        const fetchBookInfo = async () => {
            if (!translationId || !id) return;
            try {
                setLoading(true);
                const data = await get_bible_books(translationId);
                const matched = data?.find((b: any) => b.id === id) ?? null;
                setBook(matched);
            } catch (err: any) {
                console.log("Book fetch error: ", err);
                setBook(null);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchBookInfo, 300);
        return () => clearTimeout(delay);
    }, [id, translationId]);

    const toEntry = () => ({
        id: book.id,
        name: book.name ?? book.title,
        translationId,
        numberOfChapters: book.number_of_chapters,
        totalVerses: book.total_number_of_verses,
        firstChapter: book.first_chapter_number,
        lastChapter: book.last_chapter_number,
        order: book.order,
        addedAt: Date.now(),
    });

    const handleToggleBookmark = () => {
        if (!book) return;
        bookmarked ? removeBookmark(id, translationId) : addBookmark(toEntry());
    };

    const handleTogglePlanned = () => {
        if (!book) return;
        planned ? removePlanned(id, translationId) : addPlanned(toEntry());
    };

    const handleReadNow = () => {
        if (!book) return;
        router.push({
            pathname: "/readerEngine",
            params: {
                translationId,
                bookId: book.id,
                bookName: book.name ?? book.title,
                chapter: book.first_chapter_number,
                firstChapter: book.first_chapter_number,
                lastChapter: book.last_chapter_number,
            },
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={theme?.textSecondary} />
            </SafeAreaView>
        );
    }

    if (!book) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background, justifyContent: "center" }}>
                <Text style={{ color: theme?.textSecondary, textAlign: "center", fontFamily: "Playfair-Regular", fontSize: 18 }}>
                    Book not found.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background }}>
            <View style={styles.container}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme?.textPrimary ?? "#000"} />
                </Pressable>

                {/* Hero */}
                <View style={styles.hero}>
                    <View style={[styles.heroIconCircle, { backgroundColor: theme?.card }]}>
                        <Ionicons name="book" size={40} color={theme?.primary ?? theme?.textPrimary} />
                    </View>
                    <Text style={[styles.title, { color: theme?.textPrimary }]} numberOfLines={2}>
                        {book.name ?? book.title}
                    </Text>
                    <Text style={[styles.subtitle, { color: theme?.textSecondary }]}>
                        Book {book.order} of the Bible · {translationId}
                    </Text>
                </View>

                {/* Stat chips */}
                <View style={styles.statsRow}>
                    <View style={[styles.statChip, { backgroundColor: theme?.card }]}>
                        <Text style={[styles.statNumber, { color: theme?.textPrimary }]}>{book.number_of_chapters}</Text>
                        <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>Chapters</Text>
                    </View>
                    <View style={[styles.statChip, { backgroundColor: theme?.card }]}>
                        <Text style={[styles.statNumber, { color: theme?.textPrimary }]}>{book.total_number_of_verses}</Text>
                        <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>Verses</Text>
                    </View>
                    <View style={[styles.statChip, { backgroundColor: theme?.card }]}>
                        <Text style={[styles.statNumber, { color: theme?.textPrimary }]}>
                            {Math.round(book.total_number_of_verses / book.number_of_chapters)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme?.textSecondary }]}>Avg/Ch</Text>
                    </View>
                </View>

                {/* Status badges */}
                <View style={styles.badgeRow}>
                    {bookmarked && (
                        <View style={[styles.badge, { backgroundColor: `${theme?.primary}22` }]}>
                            <Ionicons name="bookmark" size={12} color={theme?.primary} />
                            <Text style={[styles.badgeText, { color: theme?.primary }]}>Bookmarked</Text>
                        </View>
                    )}
                    {planned && (
                        <View style={[styles.badge, { backgroundColor: `${theme?.primary}22` }]}>
                            <Ionicons name="checkmark-circle" size={12} color={theme?.primary} />
                            <Text style={[styles.badgeText, { color: theme?.primary }]}>Plan to Read</Text>
                        </View>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actionsBlock}>
                    <Pressable
                        style={[styles.primaryButton, { backgroundColor: theme?.primary ?? "#4A4A4A" }]}
                        onPress={handleReadNow}
                    >
                        <Ionicons name="play" size={16} color="#fff" />
                        <Text style={styles.primaryButtonText}>Read Now</Text>
                    </Pressable>

                    <View style={styles.secondaryRow}>
                        <Pressable
                            style={[
                                styles.secondaryButton,
                                {
                                    borderColor: planned ? "transparent" : theme?.primary ?? "#4A4A4A",
                                    backgroundColor: planned ? theme?.card : "transparent",
                                },
                            ]}
                            onPress={handleTogglePlanned}
                        >
                            <Ionicons
                                name={planned ? "checkmark-circle" : "add-circle-outline"}
                                size={17}
                                color={theme?.primary ?? "#4A4A4A"}
                            />
                            <Text style={[styles.secondaryButtonText, { color: theme?.primary ?? "#4A4A4A" }]}>
                                {planned ? "Planned" : "Plan To Read"}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.bookmarkButton, { backgroundColor: theme?.card }]}
                            onPress={handleToggleBookmark}
                        >
                            <Ionicons
                                name={bookmarked ? "bookmark" : "bookmark-outline"}
                                size={20}
                                color={bookmarked ? theme?.primary : theme?.textPrimary ?? "#000"}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default BookDetails;

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
    backButton: { width: 32, height: 32, justifyContent: "center" },
    hero: { alignItems: "center", marginTop: 20, gap: 6 },
    heroIconCircle: {
        width: 84, height: 84, borderRadius: 42,
        justifyContent: "center", alignItems: "center", marginBottom: 8,
    },
    title: { fontFamily: "PlayfairDisplay-Regular", fontSize: 26, textAlign: "center" },
    subtitle: { fontFamily: "Playfair-Regular", fontSize: 14 },
    statsRow: { flexDirection: "row", gap: 10, marginTop: 28 },
    statChip: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", gap: 2 },
    statNumber: { fontFamily: "Playfair-Bold", fontSize: 18 },
    statLabel: { fontFamily: "Playfair-Regular", fontSize: 11 },
    badgeRow: { flexDirection: "row", gap: 8, marginTop: 16, justifyContent: "center" },
    badge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    badgeText: { fontFamily: "Playfair-Bold", fontSize: 11 },
    actionsBlock: { marginTop: "auto", marginBottom: 24, gap: 10 },
    primaryButton: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 8, paddingVertical: 16, borderRadius: 14,
    },
    primaryButtonText: { color: "#fff", fontFamily: "Playfair-Bold", fontSize: 16 },
    secondaryRow: { flexDirection: "row", gap: 10 },
    secondaryButton: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 6, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5,
    },
    secondaryButtonText: { fontFamily: "Playfair-Bold", fontSize: 14 },
    bookmarkButton: { width: 48, borderRadius: 12, justifyContent: "center", alignItems: "center" },
});
