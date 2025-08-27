// src/components/SelectInput.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectInputProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: string[]; // array de labels/values
    placeholder?: string;
    style?: object;
}

const SelectInput: React.FC<SelectInputProps> = ({
    selectedValue,
    onValueChange,
    options,
    placeholder,
    style,
}) => {
    return (
        <View style={[styles.wrapper, style]}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => onValueChange(String(itemValue))}
                style={styles.picker}
                itemStyle={styles.item}
            >
                {placeholder && <Picker.Item label={placeholder} value="" />}
                {options.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#E6E9EE",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
        marginVertical: 6,
    },
    picker: {
        height: 46,
        width: "100%",
    },
    item: {
        height: 46,
    },
});

export default SelectInput;
