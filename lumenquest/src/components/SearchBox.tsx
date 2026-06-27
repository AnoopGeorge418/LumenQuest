import { useAppTheme } from "@/context/ThemeContext"
import { SearchBoxProps } from "@/types/searchBoxTypes"
import Ionicons from "@expo/vector-icons/Ionicons"
import { View, StyleSheet, TextInput } from "react-native"

export const SearchBox = ({ placeholder, value, onChangeText }: SearchBoxProps) => {

    const theme = useAppTheme()
    
    return (
        <View style={[searchBarStyles.container, { backgroundColor: theme?.secondary, borderColor: theme?.accent }]}>
            <Ionicons size={20} color={theme?.accent} name="search-outline" />
            <TextInput
                style={[searchBarStyles.input, {color: theme?.textPrimary}]}
                placeholder={placeholder}
                placeholderTextColor={theme?.accent}  
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="search"
                clearButtonMode="while-editing"
            />
        </View>
    )
}

// styles
const searchBarStyles = StyleSheet.create({
    container: {
        height: 50,
        width: "100%",
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        fontFamily: "Playfair-Regular",
        fontSize: 16,
        paddingVertical: 0,
    },
})
