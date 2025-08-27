// src/components/DateInput.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    Button,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DateInputProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
}

const formatDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const parseDate = (s?: string | null): Date => {
    if (!s) return new Date();
    const parts = s.split("-").map(p => parseInt(p, 10));
    if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return new Date();
};

const DateInput: React.FC<DateInputProps> = ({ value, onChange, placeholder = "Validade (Opcional)" }) => {
    const [show, setShow] = useState(false);
    const currentDate = parseDate(value);
    const [tempDate, setTempDate] = useState(currentDate);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "dismissed") {
            setShow(false);
            return;
        }

        if (selectedDate) {
            if (Platform.OS === "ios") {
                setTempDate(selectedDate);
            } else {
                onChange(formatDate(selectedDate));
                setShow(false);
            }
        }
    };

    const handlePress = () => {
        setTempDate(currentDate);
        setShow(true);
    };

    const handleIosConfirm = () => {
        onChange(formatDate(tempDate));
        setShow(false);
    };

    const handleIosCancel = () => {
        setShow(false);
    };

    const renderDatePicker = () => {
        if (!show) return null;

        if (Platform.OS === "ios") {
            return (
                <Modal transparent={true} animationType="slide" visible={show} onRequestClose={handleIosCancel}>
                    <View style={styles.modalContainer}>
                        <View style={styles.pickerContainer}>
                            <DateTimePicker
                                testID="dateTimePickerIos"
                                value={tempDate}
                                mode="date"
                                display="inline"
                                onChange={onDateChange}
                            />
                            <View style={styles.modalActions}>
                                <Button title="Cancelar" onPress={handleIosCancel} color="#ff3b30" />
                                <Button title="Confirmar" onPress={handleIosConfirm} />
                            </View>
                        </View>
                    </View>
                </Modal>
            );
        }

        // Android e Web
        return (
            <DateTimePicker
                testID="dateTimePicker"
                value={currentDate}
                mode="date"
                display="default" // "default" é mais seguro que "calendar"
                onChange={onDateChange}
            />
        );
    };

    return (
        <View>
            <TouchableOpacity style={styles.input} onPress={handlePress} activeOpacity={0.8}>
                <Text style={value ? styles.textValue : styles.placeholderText}>
                    {value
                        ? currentDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })
                        : placeholder}
                </Text>
            </TouchableOpacity>
            {renderDatePicker()}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 46,
        borderWidth: 1,
        borderColor: "#E6E9EE",
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        marginVertical: 6,
    },
    placeholderText: { color: "#9AA0A6" },
    textValue: { color: "#111" },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    pickerContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 13,
        width: "90%",
        padding: 10,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
});

export default DateInput;