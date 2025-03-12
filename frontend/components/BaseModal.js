import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const BaseModal = ({
    visible,
    onClose,
    title,
    children,
    onSave,
    saveButtonText = "Save",
    closeButtonText = "Close",
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    
                    {children}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={onSave}
                        >
                            <Text style={styles.buttonText}>{saveButtonText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>{closeButtonText}</Text>
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

export default BaseModal;