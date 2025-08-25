import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },
    header: {
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EEF0F3",
        backgroundColor: "#FFF",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    content: {
        padding: 16,
        paddingBottom: 30,
    },
    twoColInputLeft: {
        flex: 1,
        marginRight: 6,
    },
    twoColInputRight: {
        flex: 1,
        marginLeft: 6,
    },
    fullWidth: {
        width: "100%",
    },
});
