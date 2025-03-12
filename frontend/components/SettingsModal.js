import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const SettingsModal = ({ 
    visible, 
    onClose, 
    onSave,
    fontSize,
    setFontSize,
    lineSpacing,
    setLineSpacing,
    backgroundColor,
    setBackgroundColor,
    font,
    setFont
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Settings</Text>
                    
                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Font Size: {Math.round(fontSize)}px</Text>
                        <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            minimumValue={12}
                            maximumValue={30}
                            step={1}
                            minimumTrackTintColor="#4285F4"
                            maximumTrackTintColor="#D1D1D1"
                            thumbTintColor="#4285F4"
                            style={styles.slider}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Line Spacing: {lineSpacing.toFixed(1)}</Text>
                        <Slider
                            value={lineSpacing}
                            onValueChange={setLineSpacing}
                            minimumValue={1}
                            maximumValue={2}
                            step={0.1}
                            minimumTrackTintColor="#4285F4"
                            maximumTrackTintColor="#D1D1D1"
                            thumbTintColor="#4285F4"
                            style={styles.slider}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Background Color:</Text>
                        <View style={styles.colorOptions}>
                            {['white', '#f8f9fa', '#e6f4ff', '#fffde7', '#333333'].map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        backgroundColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setBackgroundColor(color)}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.settingRow}>
                        <Text style={styles.settingLabel}>Font:</Text>
                        <View style={styles.fontSelector}>
                            {[
                                { label: 'OpenDyslexic', value: 'opendyslexic' },
                                { label: 'Sans-serif', value: 'sans-serif' },
                                { label: 'Serif', value: 'serif' },
                                { label: 'Monospace', value: 'monospace' }
                            ].map(item => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[
                                        styles.fontOption,
                                        font === item.value && styles.selectedFont
                                    ]}
                                    onPress={() => setFont(item.value)}
                                >
                                    <Text 
                                        style={[
                                            styles.fontOptionText,
                                            font === item.value && styles.selectedFontText,
                                            item.value === 'opendyslexic' && { fontFamily: 'OpenDyslexic' }
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={onSave}
                        >
                            <Text style={styles.buttonText}>Save Preferences</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        width: '90%',
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    settingRow: {
        marginBottom: 24,
    },
    settingLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#4285F4',
    },
    fontSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    fontOption: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedFont: {
        backgroundColor: '#e6f4ff',
        borderColor: '#4285F4',
    },
    fontOptionText: {
        color: '#555',
    },
    selectedFontText: {
        color: '#4285F4',
        fontWeight: '600',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    saveButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    closeButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        flex: 1,
        marginLeft: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButtonText: {
        color: '#555',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default SettingsModal;