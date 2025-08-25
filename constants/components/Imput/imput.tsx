import React from "react";
import { TextInput, View, TextInputProps } from "react-native";
import inputStyles from "@/constants/style/inputStyles";

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  ...rest
}) => {
  return (
    <View style={inputStyles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[inputStyles.input, multiline && inputStyles.multiline]}
        multiline={multiline}
        placeholderTextColor="#9AA0A6"
        {...rest}
      />
    </View>
  );
};

export default Input;
