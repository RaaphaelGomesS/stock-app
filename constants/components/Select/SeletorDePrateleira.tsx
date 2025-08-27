// src/components/ShelfPicker.tsx
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";

export type Shelf = {
    id: number;
    name: string;
    rows: number;
    columns: number;
};

export type ShelfSelection = {
    shelfId: number;
    row: number;
    column: number;
};

interface ShelfPickerProps {
    shelves: Shelf[];
    onSelect: (sel: ShelfSelection) => void;
    children: React.ReactNode;
    initial?: ShelfSelection | null; // Prop para mostrar a seleção atual
}

const ShelfPicker: React.FC<ShelfPickerProps> = ({
    shelves,
    onSelect,
    children,
    initial = null,
}) => {
    const [visible, setVisible] = useState(false);

    const [selectedShelfIndex, setSelectedShelfIndex] = useState(() => {
        if (!initial || !shelves || shelves.length === 0) return 0;
        const index = shelves.findIndex(s => s.id === initial.shelfId);
        return index > -1 ? index : 0;
    });

    // Garante que a prateleira correta está selecionada ao abrir o modal
    useEffect(() => {
        if (visible && initial) {
            const index = shelves.findIndex(s => s.id === initial.shelfId);
            if (index > -1) {
                setSelectedShelfIndex(index);
            }
        }
    }, [visible, initial, shelves]);

    const open = () => setVisible(true);
    const close = () => setVisible(false);

    // Função que seleciona a posição e fecha o modal imediatamente
    const handleCellSelect = (row: number, col: number) => {
        const selectedShelf = shelves[selectedShelfIndex];
        onSelect({
            shelfId: selectedShelf.id,
            row: row,
            column: col,
        });
        close();
    };

    const currentShelf = shelves[selectedShelfIndex];

    const Cell = ({ r, c }: { r: number; c: number }) => {
        const isSelected = initial?.shelfId === currentShelf?.id && initial?.row === r && initial?.column === c;
        return (
            <TouchableOpacity
                onPress={() => handleCellSelect(r, c)}
                style={[styles.cell, isSelected ? styles.cellSelected : null]}
            >
                <Text style={[styles.cellText, isSelected ? styles.cellTextSelected : null]}>
                    {`${r + 1}-${c + 1}`}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <TouchableOpacity onPress={open}>{children}</TouchableOpacity>

            <Modal visible={visible} animationType="slide" onRequestClose={close} transparent>
                <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPressOut={close}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                            <Text style={styles.title}>Selecionar Posição</Text>

                            <View style={styles.shelfSelector}>
                                {shelves.map((s, idx) => (
                                    <TouchableOpacity
                                        key={s.id}
                                        onPress={() => setSelectedShelfIndex(idx)}
                                        style={[
                                            styles.shelfButton,
                                            idx === selectedShelfIndex ? styles.shelfButtonActive : null,
                                        ]}
                                    >
                                        <Text style={idx === selectedShelfIndex ? styles.shelfTextActive : styles.shelfText}>
                                            {s.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {currentShelf && (
                                <View style={styles.grid}>
                                    {Array.from({ length: currentShelf.rows }).map((_, r) => (
                                        <View key={r} style={styles.row}>
                                            {Array.from({ length: currentShelf.columns }).map((_, c) => (
                                                <Cell key={c} r={r} c={c} />
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const windowW = Dimensions.get("window").width;
const cellMargin = 8;
const gridPadding = 16;
const modalPadding = 32;

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 16,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: 'center' },
    shelfSelector: { flexDirection: "row", marginBottom: 16, gap: 8, justifyContent: 'center' },
    shelfButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
    },
    shelfButtonActive: { backgroundColor: "#2970FF" },
    shelfText: { color: "#333", fontWeight: '500' },
    shelfTextActive: { color: "#fff", fontWeight: 'bold' },
    grid: { padding: gridPadding / 2 },
    row: { flexDirection: "row", justifyContent: 'center', gap: cellMargin },
    cell: {
        width: Math.floor((windowW - modalPadding - gridPadding - (6 * cellMargin)) / 6),
        aspectRatio: 1,
        borderRadius: 6,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: cellMargin,
    },
    cellSelected: { backgroundColor: "#2970FF" },
    cellText: { color: "#111", fontSize: 12, fontWeight: '500' },
    cellTextSelected: { color: "#fff" },
});

export default ShelfPicker;