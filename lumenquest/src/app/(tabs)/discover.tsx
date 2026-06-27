import { Card } from "@/components/card";
import { SearchBox } from "@/components/SearchBox";
import { Spacing } from "@/constants/spacing";
import { useAppTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import book from "@/assets/images/book.png"

const Discover = () => {
    const theme = useAppTheme();

    const [searchQuery, setSearchQuery] = useState("");
    const bookData = {
        id: "JSB",
        title: "Atomic Habits",
        image: book,
        description: "learn to habdle time by doing tasks ugcsjidvnfidfojuihdfouihfuihuihdfiuhuihdfuhudfyubyubdfbvyubfvyubyudfvb",
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
                          <Card
                              id={bookData["id"]}
                              title={bookData["title"]}
                              description={bookData["description"]}
                              image={bookData["image"]}
                          />
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
