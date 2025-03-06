import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uploadDocumentAndExtractText from '../utils/documentUploader';
import { BlurView } from 'expo-blur'; 
import SpeedReadingScreen from './SpeedReadingScreen'; 
import WordHighlightScreen from './WordHighlightScreen'; 
import DocumentUploader from '../utils/documentUploader';

const ReadingScreen = ({ username }) => {
    const [text, setText] = useState('');
    const [fontSize, setFontSize] = useState(16);
    const [lineSpacing, setLineSpacing] = useState(1.5);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [font, setFont] = useState('sans-serif');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isTextChangeVisible, setIsTextChangeVisible] = useState(false);
    const [newText, setNewText] = useState('');
    const [isSpeedReadingMode, setIsSpeedReadingMode] = useState(false);
    const [isWordHighlightMode, setIsWordHighlightMode] = useState(false);

    // Fetch token from AsyncStorage
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const savedToken = await AsyncStorage.getItem('token');
                setToken(savedToken);
            } catch (error) {
                console.error("Error fetching token:", error);
                setErrorMessage("Unable to retrieve token.");
            }
        };
        fetchToken();
    }, []);

    useEffect(() => {
        const loadPreferencesAndText = async () => {
            const username = await AsyncStorage.getItem('username');
            if (!token || !username) return;
    
            try {
                // Fetch preferences
                const preferencesResponse = await axios.get(`http://localhost:8080/api/preferences/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const preferencesData = preferencesResponse.data;
                setFont(preferencesData.font || 'sans-serif');
                setFontSize(preferencesData.textSize || 16);
                setLineSpacing(preferencesData.lineSpacing || 1.5);
                setBackgroundColor(preferencesData.backgroundColor || 'white');
    
                // Fetch text data from new API
                const textResponse = await axios.get(`http://localhost:8080/api/texts/3`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const textData = textResponse.data;
                setText(textData.content || ''); // Assuming content is the key holding the text
    
            } catch (error) {
                console.error("Error loading preferences or text:", error);
                setErrorMessage("Failed to load preferences or text.");
            } finally {
                setLoading(false);
            }
        };
    
        loadPreferencesAndText();
    }, [token]);
    

    const handleTextChange = async () => {
        if (newText.trim()) {
            setText(newText);
            setIsTextChangeVisible(false);
            await saveData(); 
        }
    };

    const handleDocumentUpload = async () => {
        const extractedText = await uploadDocumentAndExtractText();
        if (extractedText) {
            setNewText(extractedText);
            setText(extractedText);
            setIsTextChangeVisible(false);
            await saveData(); 
        } else {
            setErrorMessage("Failed to extract text. Please try again.");
        }
    };
    
    const saveData = async () => {
        const username = await AsyncStorage.getItem('username');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (!storedToken || !username) {
            setErrorMessage('No token or username found. Please log in.');
            return;
        }
    
        const data = {
            text, // Include text along with preferences
            fontSize,
            lineSpacing,
            backgroundColor,
            font,
        };
    
        const url = `http://localhost:8080/api/preferences/${username}`;
    
        try {
            await axios.post(url, data, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            alert('Preferences and Text saved successfully!');
        } catch (error) {
            console.error('Error saving preferences and text:', error);
            setErrorMessage('Failed to save preferences and text.');
        }
    };
    
    if (loading) {
        return <Text>Loading preferences...</Text>;
    }

    return (
        <View style={{ flex: 1, backgroundColor }}>
            {isSpeedReadingMode ? (
                <SpeedReadingScreen 
                    text={text} 
                    onExit={() => setIsSpeedReadingMode(false)} 
                />
            ) : isWordHighlightMode ? (
                <WordHighlightScreen 
                    text={text} 
                    onExit={() => setIsWordHighlightMode(false)} 
                />
            ) : (
                <>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        <Text style={styles.title}>Reading App</Text>
                        <Text style={{
                            fontSize,
                            lineHeight: fontSize * lineSpacing,
                            fontFamily: font === 'opendyslexic' ? 'OpenDyslexic-Regular' : font,
                            color: 'black',
                            textAlign: 'justify'
                        }}>
                            {text}
                        </Text>
                    </ScrollView>

                    {(isSettingsVisible || isTextChangeVisible) && (
                        <BlurView style={styles.blurContainer} blurType="light" blurAmount={10} />
                    )}

                    <Modal visible={isSettingsVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Settings</Text>

                                <Text>Font Size:</Text>
                                <Slider
                                    value={fontSize}
                                    onValueChange={setFontSize}
                                    minimumValue={12}
                                    maximumValue={30}
                                    step={1}
                                />

                                <Text>Line Spacing:</Text>
                                <Slider
                                    value={lineSpacing}
                                    onValueChange={setLineSpacing}
                                    minimumValue={1}
                                    maximumValue={2}
                                    step={0.1}
                                />

                                <Text>Background Color:</Text>
                                <Picker
                                    selectedValue={backgroundColor}
                                    onValueChange={(itemValue) => setBackgroundColor(itemValue)}
                                >
                                    <Picker.Item label="White" value="white" />
                                    <Picker.Item label="Light Gray" value="lightgray" />
                                    <Picker.Item label="Light Blue" value="lightblue" />
                                    <Picker.Item label="Light Yellow" value="lightyellow" />
                                </Picker>

                                <Text>Font:</Text>
                                <Picker
                                    selectedValue={font}
                                    onValueChange={(itemValue) => setFont(itemValue)}
                                >
                                    <Picker.Item label="OpenDyslexic" value="opendyslexic" />
                                    <Picker.Item label="Sans-serif" value="sans-serif" />
                                    <Picker.Item label="Serif" value="serif" />
                                    <Picker.Item label="Monospace" value="monospace" />
                                </Picker>

                                <TouchableOpacity 
                                    style={styles.uploadButton} 
                                    onPress={async () => { 
                                        await saveData('preferences');
                                        setIsSettingsVisible(false); 
                                    }}
                                >
                                    <Text style={styles.buttonText}>Save Preferences</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.uploadButton} 
                                    onPress={() => setIsSettingsVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal visible={isTextChangeVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity style={styles.uploadButton} onPress={handleDocumentUpload}>
                                    <Text style={styles.buttonText}>📂 Upload Document</Text>
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Type new text here..."
                                    multiline
                                    value={newText}
                                    onChangeText={setNewText}
                                />

                                <TouchableOpacity 
                                    style={styles.uploadButton} 
                                    onPress={handleTextChange}
                                >
                                    <Text style={styles.buttonText}>Save Text</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.uploadButton} 
                                    onPress={() => setIsTextChangeVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.floatingButtons}>
                        <TouchableOpacity 
                            style={styles.settingsButton} 
                            onPress={() => setIsSettingsVisible(true)}
                        >
                            <Text style={styles.buttonText}>⚙ Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.changeTextButton} 
                            onPress={() => setIsTextChangeVisible(true)}
                        >
                            <Text style={styles.buttonText}>✍ Change Text</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.switchButton} 
                            onPress={() => setIsSpeedReadingMode(true)}
                        >
                            <Text style={styles.buttonText}>🔄 Speed Reading</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.switchButton} onPress={() => setIsWordHighlightMode(true)}>
                            <Text style={styles.buttonText}>🔦 Word Highlight</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
    uploadButton: { backgroundColor: '#f0ad4e', padding: 10, borderRadius: 8, marginBottom: 20 },
    buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    floatingButtons: { position: 'absolute', right: 20, bottom: 20, gap: 10 },
    settingsButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
    changeTextButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8 },
    switchButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8 },
    textInput: { height: 200, borderColor: '#ccc', borderWidth: 1, marginBottom: 20, padding: 10 },
    blurContainer: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
});

export default ReadingScreen;
