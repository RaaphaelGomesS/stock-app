import React, { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import rowStyles from "../../style/RowStyles";

interface RowProps {
    children: ReactNode;
    style?: ViewStyle;
}

const Row: React.FC<RowProps> = ({ children, style }) => {
    return <View style={[rowStyles.row, style]}>{children}</View>;
};

export default Row;
