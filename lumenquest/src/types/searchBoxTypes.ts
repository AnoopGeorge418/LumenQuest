import { DimensionValue } from "react-native"

export type SearchBoxProps = {
    width?: DimensionValue
    height?: string | number
    placeholder: string
    value: string
    onChangeText: (text: string) => void
}
