import React from "react";
import { TouchableOpacity, Text } from "react-native";
import buttonStyles from "@/constants/style/ButtonStyles";

type Props = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
};

const Button: React.FC<Props> = ({ title, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[buttonStyles.button, disabled && buttonStyles.disabled]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={buttonStyles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
