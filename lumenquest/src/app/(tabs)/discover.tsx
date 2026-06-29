import { Card } from "@/components/card";
import { SearchBox } from "@/components/SearchBox";
import { Spacing } from "@/constants/spacing";
import { useAppTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get_bible_translations, get_bible_books } from "@/api/endpoints/books/bibleApi";
import { FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Discover = () => {
    const theme = useAppTheme();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [translations, setTranslations] = useState<any[]>([]);
    const [selectedTranslationId, setSelectedTranslationId] = useState<string | null>(null);
    const [apiResults, setApiResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const data = await get_bible_translations();
                setTranslations(data);
                if (data && data.length > 0) {
                    setSelectedTranslationId(data[0].id);
                }
            } catch (err: any) {
                console.error("Error fetching translations: ", err);
            }
        };
        fetchTranslations();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!selectedTranslationId || searchQuery.trim().length === 0) {
                setApiResults([]);
                return;
            }
            try {
                setLoading(true);
                const data = await get_bible_books(selectedTranslationId);

                const selectedTranslation = translations.find((t) => t.id === selectedTranslationId);
                const fallbackCover = selectedTranslation?.cover_image ?? null;

                const filtered = (data ?? []).filter((book: any) =>
                    (book.name ?? book.title ?? "")
                        .toLowerCase()
                        .includes(searchQuery.trim().toLowerCase())
                );

                const normalized = filtered.map((book: any) => ({
                    ...book,
                    cover_image: fallbackCover,
                }));

                setApiResults(normalized);
            } catch (err: any) {
                console.error("Search Error: ", err);
                setApiResults([]);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchBooks, 400);
        return () => clearTimeout(delay);
    }, [searchQuery, selectedTranslationId, translations]);

    const handleCardPress = (id: string) => {
        router.push({
            pathname: "/bookDetails",
            params: { id: id, translationId: selectedTranslationId },
        });
    };

    const selectedTranslation = translations.find((t) => t.id === selectedTranslationId);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background }}>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={[styles.screenTitle, { color: theme?.textPrimary }]}>Discover</Text>

                <View style={{ marginTop: 14 }}>
                    <SearchBox
                        placeholder="Search for books, author, genres and more..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>

                {/* Translation selector */}
                {translations.length > 0 && (
                    <View style={{ marginTop: 14 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {translations.map((t) => {
                                const isActive = t.id === selectedTranslationId;
                                return (
                                    <Pressable
                                        key={t.id}
                                        onPress={() => setSelectedTranslationId(t.id)}
                                        style={[
                                            styles.translationPill,
                                            {
                                                backgroundColor: isActive
                                                    ? theme?.primary ?? "#4A4A4A"
                                                    : theme?.card,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.translationPillText,
                                                { color: isActive ? "#fff" : theme?.textSecondary },
                                            ]}
                                        >
                                            {t.id}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                        {selectedTranslation && (
                            <Text style={[styles.translationFullName, { color: theme?.textSecondary }]}>
                                {selectedTranslation.english_name}
                            </Text>
                        )}
                    </View>
                )}

                {searchQuery.trim().length > 0 && (
                    <View style={{ marginTop: 18 }}>
                        <Text style={[styles.results, { color: theme?.textSecondary }]}>
                            {!loading && `${apiResults.length} result${apiResults.length === 1 ? "" : "s"} for `}
                            <Text style={{ fontFamily: "Playfair-Bold", color: theme?.textPrimary }}>
                                "{searchQuery}"
                            </Text>
                        </Text>

                        <View style={{ marginTop: Spacing.lg }}>
                            {loading && (
                                <View style={styles.centerState}>
                                    <Ionicons name="hourglass-outline" size={26} color={theme?.textSecondary} />
                                    <Text style={[styles.stateText, { color: theme?.textSecondary }]}>
                                        Searching...
                                    </Text>
                                </View>
                            )}

                            {!loading && apiResults.length === 0 && (
                                <View style={styles.centerState}>
                                    <Ionicons name="search-outline" size={28} color={theme?.textSecondary} />
                                    <Text style={[styles.stateText, { color: theme?.textSecondary }]}>
                                        No books found.
                                    </Text>
                                </View>
                            )}

                            {apiResults.length > 0 && (
                                <FlatList
                                    data={apiResults}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}
                                    columnWrapperStyle={{ justifyContent: "space-between", gap: 12 }}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View style={{ flex: 1, marginTop: Spacing.lg, marginRight: 10 }}>
                                            <Pressable onPress={() => handleCardPress(item.id)} style={{ flex: 1 }}>
                                                <Card
                                                    id={item.id}
                                                    title={item.name ?? item.title}
                                                    image={item.cover_image}
                                                    description={`${item.number_of_chapters} chapters`}
                                                />
                                            </Pressable>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                )}

                {searchQuery.trim().length === 0 && (
                    <View style={[styles.centerState, { marginTop: 60 }]}>
                        <Ionicons name="book-outline" size={32} color={theme?.textSecondary} />
                        <Text style={[styles.stateText, { color: theme?.textSecondary }]}>
                            Search to discover books
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Discover;

const styles = StyleSheet.create({
    screenTitle: {
        fontFamily: "PlayfairDisplay-Regular",
        fontSize: 28,
        marginTop: 4,
    },
    results: {
        fontFamily: "Playfair-Regular",
        fontSize: 15,
    },
    translationPill: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginRight: 8,
    },
    translationPillText: {
        fontFamily: "Playfair-Bold",
        fontSize: 12,
    },
    translationFullName: {
        fontFamily: "Playfair-Regular",
        fontSize: 12,
        marginTop: 6,
    },
    centerState: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 30,
    },
    stateText: {
        fontFamily: "Playfair-Regular",
        fontSize: 14,
    },
});
