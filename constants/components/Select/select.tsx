import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import selectStyles from "@/constants/style/SelectStyle";

interface SelectProps {
    selectedValue: string;
    onValueChange: (itemValue: string) => void;
    options: string[];
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
    selectedValue,
    onValueChange,
    options,
    placeholder,
}) => {
    return (
        <View style={selectStyles.wrapper}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => onValueChange(itemValue)}
                style={selectStyles.picker}
            >
                {placeholder && <Picker.Item label={placeholder} value="" />}
                {options.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                ))}
            </Picker>
        </View>
    );
};

export default Select;
