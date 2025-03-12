import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const TextChangeModal = ({
    visible,
    onClose,
    onSave,
    newText,
    setNewText,
    onDocumentUpload,
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Change Text</Text>
                    
                    <TouchableOpacity style={styles.uploadButton} onPress={onDocumentUpload}>
                        <Text style={styles.buttonText}>📂 Upload Document</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Type new text here..."
                        multiline
                        value={newText}
                        onChangeText={setNewText}
                    />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={onSave}
                        >
                            <Text style={styles.buttonText}>Save Text</Text>
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
    uploadButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 14,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textInput: {
        height: 200,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
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

export default TextChangeModal;