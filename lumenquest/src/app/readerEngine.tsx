import { get_bible_chapter } from "@/api/endpoints/books/bibleApi";
import { useAppTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const FONT_SIZES = {
    small: { verse: 15, lineHeight: 25, heading: 17 },
    medium: { verse: 18, lineHeight: 30, heading: 20 },
    large: { verse: 21, lineHeight: 35, heading: 23 },
};

const READING_THEMES = {
    default: { bg: null, card: null, text: null },
    sepia: { bg: "#F4ECD8", card: "#FBF3E2", text: "#3B2F1E" },
    night: { bg: "#15171C", card: "#1D2026", text: "#D8DCE2" },
};

type FontSizeKey = keyof typeof FONT_SIZES;
type ThemeKey = keyof typeof READING_THEMES;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReaderEngine = () => {
    const appTheme = useAppTheme();
    const router = useRouter();
    const params = useLocalSearchParams();

    const translationId = Array.isArray(params.translationId) ? params.translationId[0] : params.translationId;
    const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;
    const bookName = Array.isArray(params.bookName) ? params.bookName[0] : params.bookName;
    const firstChapter = Number(Array.isArray(params.firstChapter) ? params.firstChapter[0] : params.firstChapter);
    const lastChapter = Number(Array.isArray(params.lastChapter) ? params.lastChapter[0] : params.lastChapter);
    const initialChapter = Number(Array.isArray(params.chapter) ? params.chapter[0] : params.chapter) || firstChapter;

    const [currentChapter, setCurrentChapter] = useState(initialChapter);
    const [chapterData, setChapterData] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [fontSize, setFontSize] = useState<FontSizeKey>("medium");
    const [readingTheme, setReadingTheme] = useState<ThemeKey>("default");
    const [showSettings, setShowSettings] = useState(false);
    const [showChapterPicker, setShowChapterPicker] = useState(false);
    const [chromeVisible, setChromeVisible] = useState(true);
    const [highlightedVerses, setHighlightedVerses] = useState<Set<number>>(new Set());

    const scrollProgress = useRef(new Animated.Value(0)).current;
    const chromeOpacity = useRef(new Animated.Value(1)).current;
    const [contentHeight, setContentHeight] = useState(1);
    const [scrollViewHeight, setScrollViewHeight] = useState(1);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const fetchChapter = async () => {
            if (!translationId || !bookId || !currentChapter) return;
            try {
                setLoading(true);
                const data = await get_bible_chapter(translationId, bookId, currentChapter);
                setChapterData(data);
                scrollProgress.setValue(0);
                setHighlightedVerses(new Set());
            } catch (err: any) {
                console.log("Chapter fetch error: ", err);
                setChapterData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchChapter();
    }, [translationId, bookId, currentChapter]);

    const goToPrevChapter = () => {
        if (currentChapter > firstChapter) setCurrentChapter((prev) => prev - 1);
    };

    const goToNextChapter = () => {
        if (currentChapter < lastChapter) setCurrentChapter((prev) => prev + 1);
    };

    const handleScroll = (e: any) => {
        const y = e.nativeEvent.contentOffset.y;
        scrollProgress.setValue(y);

        const delta = y - lastScrollY.current;
        if (Math.abs(delta) > 6) {
            if (delta > 0 && y > 40 && chromeVisible) {
                setChromeVisible(false);
                Animated.timing(chromeOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
            } else if (delta < 0 && !chromeVisible) {
                setChromeVisible(true);
                Animated.timing(chromeOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            }
            lastScrollY.current = y;
        }
    };

    const toggleVerseHighlight = (verseNumber: number) => {
        setHighlightedVerses((prev) => {
            const next = new Set(prev);
            if (next.has(verseNumber)) next.delete(verseNumber);
            else next.add(verseNumber);
            return next;
        });
    };

    const maxScroll = Math.max(contentHeight - scrollViewHeight, 1);
    const progressWidth = scrollProgress.interpolate({
        inputRange: [0, maxScroll],
        outputRange: ["0%", "100%"],
        extrapolate: "clamp",
    });

    const activeTheme = READING_THEMES[readingTheme];
    const bg = activeTheme.bg ?? appTheme?.background;
    const cardBg = activeTheme.card ?? appTheme?.card;
    const textColor = activeTheme.text ?? appTheme?.textPrimary;
    const secondaryColor = activeTheme.text ? `${activeTheme.text}99` : appTheme?.textSecondary;

    let lastHeading: string | null = null;
    const sizes = FONT_SIZES[fontSize];
    const bookNameUpper = (bookName ?? "").toString().toUpperCase();
    const chapterRange = Array.from(
        { length: lastChapter - firstChapter + 1 },
        (_, i) => firstChapter + i
    );

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: bg }]}>
            {/* Top bar */}
            <Animated.View style={[styles.topBar, { opacity: chromeOpacity }]} pointerEvents={chromeVisible ? "auto" : "none"}>
                <Pressable onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="chevron-back" size={24} color={textColor ?? "#000"} />
                </Pressable>

                <Pressable onPress={() => setShowChapterPicker(true)} style={styles.titlePress}>
                    <Text style={[styles.navTitle, { color: textColor }]} numberOfLines={1}>
                        {bookNameUpper} <Text style={{ color: secondaryColor }}>·</Text> CHAPTER {currentChapter}
                    </Text>
                    <Ionicons name="chevron-down" size={12} color={secondaryColor} style={{ marginTop: 2 }} />
                </Pressable>

                <Pressable onPress={() => setShowSettings((prev) => !prev)} style={styles.iconButton}>
                    <Ionicons name={showSettings ? "options" : "options-outline"} size={20} color={textColor ?? "#000"} />
                </Pressable>
            </Animated.View>

            {/* Reading progress bar */}
            <View style={[styles.progressTrack, { backgroundColor: cardBg }]}>
                <Animated.View
                    style={[styles.progressFill, { width: progressWidth, backgroundColor: appTheme?.primary ?? "#4A4A4A" }]}
                />
            </View>

            {/* Settings panel: font size + reading theme */}
            {showSettings && (
                <Animated.View style={[styles.settingsPanel, { backgroundColor: cardBg, opacity: chromeOpacity }]}>
                    <Text style={[styles.settingsLabel, { color: secondaryColor }]}>Text size</Text>
                    <View style={styles.settingsOptions}>
                        {(Object.keys(FONT_SIZES) as FontSizeKey[]).map((key) => (
                            <Pressable
                                key={key}
                                onPress={() => setFontSize(key)}
                                style={[
                                    styles.fontOption,
                                    fontSize === key && { backgroundColor: appTheme?.primary ?? "#4A4A4A" },
                                ]}
                            >
                                <Text style={{ fontFamily: "Playfair-Bold", fontSize: 13, color: fontSize === key ? "#fff" : textColor }}>
                                    {key === "small" ? "A" : key === "medium" ? "A+" : "A++"}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={[styles.settingsLabel, { color: secondaryColor, marginTop: 12 }]}>Theme</Text>
                    <View style={styles.settingsOptions}>
                        {(Object.keys(READING_THEMES) as ThemeKey[]).map((key) => (
                            <Pressable
                                key={key}
                                onPress={() => setReadingTheme(key)}
                                style={[
                                    styles.swatch,
                                    {
                                        backgroundColor:
                                            key === "default" ? appTheme?.background : READING_THEMES[key].bg,
                                        borderColor: readingTheme === key ? (appTheme?.primary ?? "#4A4A4A") : "transparent",
                                    },
                                ]}
                            >
                                {readingTheme === key && (
                                    <Ionicons name="checkmark" size={16} color={key === "night" ? "#fff" : "#000"} />
                                )}
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>
            )}

            {loading && (
                <View style={styles.centerFill}>
                    <ActivityIndicator size="large" color={secondaryColor} />
                </View>
            )}

            {!loading && !chapterData && (
                <View style={styles.centerFill}>
                    <Ionicons name="cloud-offline-outline" size={32} color={secondaryColor} />
                    <Text style={[styles.errorText, { color: secondaryColor }]}>Unable to load this chapter.</Text>
                </View>
            )}

            {!loading && chapterData && (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    onContentSizeChange={(_, h) => setContentHeight(h)}
                    onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
                >
                    <View style={[styles.page, { backgroundColor: cardBg }]}>
                        {chapterData.content.map((verse: any, index: number) => {
                            const showHeading = verse.chapter_heading && verse.chapter_heading !== lastHeading;
                            if (showHeading) lastHeading = verse.chapter_heading;
                            const isFirstVerse = index === 0;
                            const isHighlighted = highlightedVerses.has(verse.verse_number);

                            return (
                                <View key={`${verse.verse_number}-${index}`}>
                                    {showHeading && (
                                        <Text style={[styles.heading, { color: textColor, fontSize: sizes.heading }]}>
                                            {verse.chapter_heading}
                                        </Text>
                                    )}

                                    <Pressable onPress={() => toggleVerseHighlight(verse.verse_number)}>
                                        <Text
                                            style={[
                                                styles.verseText,
                                                {
                                                    color: textColor,
                                                    fontSize: sizes.verse,
                                                    lineHeight: sizes.lineHeight,
                                                    backgroundColor: isHighlighted
                                                        ? `${appTheme?.primary ?? "#E8C84A"}33`
                                                        : "transparent",
                                                },
                                            ]}
                                        >
                                            {isFirstVerse ? (
                                                <Text style={[styles.dropCap, { color: appTheme?.primary ?? textColor }]}>
                                                    {verse.verse_text.charAt(0)}
                                                </Text>
                                            ) : (
                                                <Text style={[styles.verseNumber, { color: secondaryColor }]}>
                                                    {verse.verse_number}{" "}
                                                </Text>
                                            )}
                                            {isFirstVerse ? verse.verse_text.slice(1) : verse.verse_text}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}

                        <View style={[styles.endDivider, { backgroundColor: secondaryColor }]} />
                        <Text style={[styles.endLabel, { color: secondaryColor }]}>
                            End of chapter {currentChapter}
                        </Text>
                    </View>
                </ScrollView>
            )}

            {/* Floating bottom navigation */}
            <Animated.View style={[styles.bottomBarWrapper, { opacity: chromeOpacity }]} pointerEvents={chromeVisible ? "auto" : "none"}>
                <View style={[styles.bottomBar, { backgroundColor: cardBg }]}>
                    <Pressable
                        onPress={goToPrevChapter}
                        disabled={currentChapter <= firstChapter}
                        style={[styles.navButton, currentChapter <= firstChapter && styles.navButtonDisabled]}
                    >
                        <Ionicons name="chevron-back" size={19} color={textColor ?? "#000"} />
                    </Pressable>

                    <Pressable onPress={() => setShowChapterPicker(true)}>
                        <Text style={[styles.chapterIndicator, { color: secondaryColor }]}>
                            {currentChapter} / {lastChapter}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={goToNextChapter}
                        disabled={currentChapter >= lastChapter}
                        style={[styles.navButton, currentChapter >= lastChapter && styles.navButtonDisabled]}
                    >
                        <Ionicons name="chevron-forward" size={19} color={textColor ?? "#000"} />
                    </Pressable>
                </View>
            </Animated.View>

            {/* Chapter picker modal */}
            <Modal visible={showChapterPicker} transparent animationType="fade" onRequestClose={() => setShowChapterPicker(false)}>
                <Pressable style={styles.modalOverlay} onPress={() => setShowChapterPicker(false)}>
                    <Pressable style={[styles.chapterSheet, { backgroundColor: appTheme?.card }]} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.sheetHandle} />
                        <Text style={[styles.sheetTitle, { color: appTheme?.textPrimary }]}>{bookName}</Text>
                        <Text style={[styles.sheetSubtitle, { color: appTheme?.textSecondary }]}>Jump to chapter</Text>

                        <FlatList
                            data={chapterRange}
                            keyExtractor={(item) => item.toString()}
                            numColumns={5}
                            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
                            renderItem={({ item }) => {
                                const isActive = item === currentChapter;
                                return (
                                    <Pressable
                                        onPress={() => {
                                            setCurrentChapter(item);
                                            setShowChapterPicker(false);
                                        }}
                                        style={[
                                            styles.chapterCell,
                                            isActive && { backgroundColor: appTheme?.primary ?? "#4A4A4A" },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: "Playfair-Bold",
                                                fontSize: 15,
                                                color: isActive ? "#fff" : appTheme?.textPrimary,
                                            }}
                                        >
                                            {item}
                                        </Text>
                                    </Pressable>
                                );
                            }}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

export default ReaderEngine;

const styles = StyleSheet.create({
    screen: { flex: 1 },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    iconButton: { padding: 4, width: 32, alignItems: "center" },
    titlePress: { flex: 1, alignItems: "center" },
    navTitle: {
        textAlign: "center",
        fontFamily: "Playfair-Bold",
        fontSize: 13,
        letterSpacing: 1.4,
    },
    progressTrack: { height: 2, width: "100%", overflow: "hidden" },
    progressFill: { height: 2 },
    settingsPanel: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 14,
        padding: 14,
        gap: 6,
    },
    settingsLabel: { fontFamily: "Playfair-Regular", fontSize: 12, letterSpacing: 1 },
    settingsOptions: { flexDirection: "row", gap: 10 },
    fontOption: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "rgba(120,120,120,0.12)",
    },
    swatch: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    centerFill: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
    errorText: { fontFamily: "Playfair-Regular", fontSize: 15 },
    contentContainer: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 120 },
    page: { borderRadius: 20, padding: 26, paddingTop: 30 },
    heading: {
        fontFamily: "PlayfairDisplay-Regular",
        textAlign: "center",
        marginTop: 22,
        marginBottom: 16,
    },
    verseText: { fontFamily: "Playfair-Regular", marginBottom: 12, borderRadius: 4 },
    verseNumber: { fontFamily: "Playfair-Bold", fontSize: 12 },
    dropCap: { fontFamily: "PlayfairDisplay-Regular", fontSize: 48, lineHeight: 40 },
    endDivider: { height: 1, opacity: 0.15, marginTop: 26, marginBottom: 10 },
    endLabel: { fontFamily: "Playfair-Regular", fontSize: 12, textAlign: "center", letterSpacing: 1, marginBottom: 4 },
    bottomBarWrapper: { position: "absolute", bottom: 24, left: 0, right: 0, alignItems: "center" },
    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 30,
        gap: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    navButton: { padding: 6 },
    navButtonDisabled: { opacity: 0.25 },
    chapterIndicator: { fontFamily: "Playfair-Bold", fontSize: 13, minWidth: 36, textAlign: "center" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },
    chapterSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 10,
        maxHeight: SCREEN_HEIGHT * 0.6,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(120,120,120,0.3)",
        alignSelf: "center",
        marginBottom: 14,
    },
    sheetTitle: { fontFamily: "PlayfairDisplay-Regular", fontSize: 20, textAlign: "center" },
    sheetSubtitle: { fontFamily: "Playfair-Regular", fontSize: 13, textAlign: "center", marginTop: 2 },
    chapterCell: {
        width: "20%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 4,
    },
});
