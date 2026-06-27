import { Card } from "@/components/card";
import { SearchBox } from "@/components/SearchBox";
import { Spacing } from "@/constants/spacing";
import { useAppTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get_bible_translations } from "@/api/endpoints/books/bibleApi";
import { FlatList } from "react-native";
import { Pressable } from "react-native";

const Discover = () => {
    
    const theme = useAppTheme();

    const [searchQuery, setSearchQuery] = useState("");
    const [apiResults, setApiResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTranslations = async () => {
            if (searchQuery.trim().length === 0) {
                setApiResults([]);
                return;
            }
            try {
                setLoading(true)
                const data = await get_bible_translations()
                setApiResults(data)
            } catch(err: any) {
                console.log("Search Error: ", err)
                setApiResults([])
            } finally {
                setLoading(false)
            }
        }

        const delay = setTimeout(fetchTranslations, 500)
        return () => clearTimeout(delay)
        
    }, [searchQuery])

    const handleCardPress = (id: string) => {
        Alert.alert(`Hello, ${id} got clicked!`)
    }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background }}>
        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            {/*Search box*/}
            <View style={{ marginTop: 10 }}>
                  <SearchBox
                      placeholder="Search for books, author, genres and more..."
                      value={searchQuery}
                      onChangeText={(text) => setSearchQuery(text)}
                  />
            </View>
            {searchQuery.trim().length > 0 && (
                <View style={{ marginTop: 10 }}>
                      <Text style={[discoverStyles.results, { color: theme?.textSecondary },]}>Search results for - {""}
                          <Text style={{ fontFamily: "Playfair-Bold" }}>{searchQuery}</Text>
                          :
                      </Text>
                      {/*Books card*/}
                      <View style={{ marginTop: Spacing.lg }}>
                          {loading && (<Text style={{ color: theme?.textSecondary, fontFamily: "Plafair-Regular" }}>Loading...</Text>)}
                          {
                              <FlatList
                                  data={apiResults}
                                  keyExtractor={(item) => item.id}
                                  numColumns={2}
                                  columnWrapperStyle={{
                                      justifyContent: "space-between",
                                      gap: 12
                                  }}
                                  renderItem={({ item }) => (
                                      <View style={{ flex: 1, marginTop: Spacing.lg, marginRight: 10, }}>
                                          <Pressable onPress={() => handleCardPress(item.id)} style={{ flex: 1, marginTop: Spacing.lg }}>
                                            <Card
                                                id={item.id}
                                                title={item.english_name}
                                                image={item.cover_image}
                                            />
                                          </Pressable>
                                      </View>
                                  )}
                              />
                          }
                      </View>
                </View>
            )}
        </View>
    </SafeAreaView>
  );
};

export default Discover;


// styles
const discoverStyles = StyleSheet.create({
    results: {
        fontFamily: "Playfair-Regular",
        fontSize: 16,
    }
})
