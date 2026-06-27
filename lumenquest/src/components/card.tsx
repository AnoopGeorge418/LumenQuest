import { Spacing } from "@/constants/spacing"
import { useAppTheme } from "@/context/ThemeContext"
import { CardProps } from "@/types/cardType"
import { ImageBackground } from "react-native"
import { StyleSheet, Text, View } from "react-native"

export const Card = ({ id, image, title, description }: CardProps) => {

    const theme = useAppTheme()
    
    return (
        <View style={[cardStyles.container, { backgroundColor: theme?.card }]}>
            <ImageBackground source={image} style={cardStyles.image} imageStyle={cardStyles.imageRadius}>
                <View style={cardStyles.overlay}>
                    <Text style={[cardStyles.id, {color: theme?.textSecondary}]}>{id}</Text>
                </View>
            </ImageBackground>
            <View style={{ marginTop: 2, gap: 4, padding: 10 }}>
                <Text style={[cardStyles.title, {color: theme?.textPrimary}]}>{title}</Text>
                <Text style={[cardStyles.description, {color: theme?.accent}]}>{description}</Text>
            </View>
       </View> 
    )
}

const cardStyles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    imageRadius: {
        borderRadius: 12
    },
    id: {
        fontFamily: "Playfair-Regular",
        fontSize: 12,
    },
    overlay: {
       backgroundColor: "rgba(0,0,0,0.4)",
       padding: 10,
    },
    title: {
        fontFamily: "PlayfairDisplay-Regular",
        fontSize: 18
    },
    description: {
        fontFamily: "Playfair-Regular",
        fontSize: 14
    }
})
