import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uploadDocumentAndExtractText from '../utils/documentUploader';
import { BlurView } from 'expo-blur'; 
import SpeedReadingScreen from './SpeedReadingScreen'; 
import WordHighlightScreen from './WordHighlightScreen'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SettingsModal from '../components/SettingsModal';
import TextChangeModal from '../components/TextChangeModal';

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
    const insets = useSafeAreaInsets();


    
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
                const textResponse = await axios.get(`http://localhost:8080/api/texts/1`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const textData = textResponse.data;
                setText(textData.content || ''); 
    
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
            text,
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
        return (
            <View style={[styles.loadingContainer, {backgroundColor}]}>
                <Text style={styles.loadingText}>Loading preferences...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor}]}>
            <StatusBar barStyle={backgroundColor === 'white' ? 'dark-content' : 'light-content'} />
            
            {isSpeedReadingMode ? (
                <SpeedReadingScreen 
                    text={text} 
                    onExit={() => setIsSpeedReadingMode(false)}
                    backgroundColor={backgroundColor}
                    fontSize={fontSize}
                    lineSpacing={lineSpacing}
                    font={font}
                />
            ) : isWordHighlightMode ? (
                <WordHighlightScreen 
                    text={text} 
                    onExit={() => setIsWordHighlightMode(false)}
                    backgroundColor={backgroundColor}
                    fontSize={fontSize}
                    lineSpacing={lineSpacing}
                    font={font}
                />
            ) : (
                <>
                    <View style={styles.header}>
                        <Text style={styles.title}>Reading App</Text>
                        {errorMessage ? (
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                        ) : null}
                    </View>
                    
                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.textContainer}>
                            <Text style={{
                                fontSize,
                                lineHeight: fontSize * lineSpacing,
                                fontFamily: font === 'opendyslexic' ? 'OpenDyslexic' : font,
                                color: backgroundColor === 'white' ? '#333' : '#fff',
                                textAlign: 'justify'
                            }}>
                                {text}
                            </Text>
                        </View>
                    </ScrollView>

                    {(isSettingsVisible || isTextChangeVisible) && (
                        <BlurView style={styles.blurContainer} blurType="light" blurAmount={10} />
                    )}

                    <SettingsModal
                        visible={isSettingsVisible}
                        onClose={() => setIsSettingsVisible(false)}
                        onSave={async () => { 
                            await saveData('preferences');
                            setIsSettingsVisible(false); 
                        }}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        lineSpacing={lineSpacing}
                        setLineSpacing={setLineSpacing}
                        backgroundColor={backgroundColor}
                        setBackgroundColor={setBackgroundColor}
                        font={font}
                        setFont={setFont}
                    />

                    
                    <TextChangeModal
                        visible={isTextChangeVisible}
                        onClose={() => setIsTextChangeVisible(false)}
                        onSave={handleTextChange}
                        newText={newText}
                        setNewText={setNewText}
                        onDocumentUpload={handleDocumentUpload}
                    />
                    
                    {/* Action Buttons */}
                    <View style={[styles.floatingButtons, { bottom: insets.bottom + 20 }]}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setIsSettingsVisible(true)}
                        >
                            <Text style={styles.actionButtonText}>⚙️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setIsTextChangeVisible(true)}
                        >
                            <Text style={styles.actionButtonText}>✏️</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setIsSpeedReadingMode(true)}
                        >
                            <Text style={styles.actionButtonText}>⏩</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setIsWordHighlightMode(true)}
                        >
                            <Text style={styles.actionButtonText}>🔍</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    textContainer: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        borderRadius: 8,
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
    },
    floatingButtons: {
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    actionButtonText: {
        fontSize: 24,
    },
});

export default ReadingScreen;