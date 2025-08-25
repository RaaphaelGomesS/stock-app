import { StyleSheet } from "react-native";

export default StyleSheet.create({
    button: {
        height: 48,
        backgroundColor: "#2970FF",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 16,
        shadowColor: "#2970FF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 3,
    },
    text: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 15,
    },
    disabled: {
        opacity: 0.6,
    },
});
