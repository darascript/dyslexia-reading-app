import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Button, Modal, Platform, TouchableWithoutFeedback } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { extractTextFromDocument } from '../features/documentProcessor';

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

    // Fetch token from AsyncStorage when the component mounts
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
        const loadPreferences = async () => {
            const username = await AsyncStorage.getItem('username'); 
            
            if (!token || !username) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/preferences/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Set preferences
                const data = response.data;
                setText(data.text || '');
                setFont(data.font || 'sans-serif');
                setFontSize(data.textSize || 16);
                setLineSpacing(data.lineSpacing || 0);
                setBackgroundColor(data.backgroundColor || 'white');
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.log("Preferences not found. Using defaults.");
                    } else {
                        console.error("Error loading preferences:", error);
                        setErrorMessage("Failed to load preferences.");
                    }
                } else {
                    console.error("Network error or request failed:", error);
                    setErrorMessage("Network error.");
                }
            } finally {
                setLoading(false);
            }
        };
        loadPreferences();
    }, [token]);

    // Save preferences to the server
    const savePreferences = async () => {
        const username = await AsyncStorage.getItem('username'); 
        if (!token) {
            setErrorMessage('No token found. Please log in.');
            return;
        }

        try {
            const preferences = {
                username,
                text,
                font,
                textSize: fontSize,
                lineSpacing,
                backgroundColor,
            };
            
            await axios.post(`http://localhost:8080/api/preferences/${username}`, preferences, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Preferences saved!");
        } catch (error) {
            console.error("Error saving preferences:", error);
            setErrorMessage("Failed to save preferences.");
        }
    };

    // Handle text change
    const handleTextChange = () => {
        if (newText.trim()) {
            setText(newText);
        }
        setIsTextChangeVisible(false);
        setNewText('');
    };

    if (loading) {
        return <Text>Loading preferences...</Text>;
    }

    return (
        <View style={{ flex: 1, backgroundColor }}>
            {/* Main reading content */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Reading App</Text>
                <ScrollView style={{ padding: 10 }}>
                    <Text
                        style={{
                            fontSize,
                            lineHeight: fontSize * lineSpacing,
                            fontFamily: font,
                            color: 'black',
                            textAlign: 'justify',
                        }}
                    >
                        {text}
                    </Text>
                </ScrollView>
            </ScrollView>

            {/* Settings Modal */}
            <Modal visible={isSettingsVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setIsSettingsVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            {/* Font, Background Color, Font Size, Line Spacing sliders */}
                            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>Font</Text>
                            <Picker selectedValue={font} onValueChange={setFont} style={{ height: 50 }}>
                                <Picker.Item label="Sans-serif" value="sans-serif" />
                                <Picker.Item label="Serif" value="serif" />
                                <Picker.Item label="Monospace" value="monospace" />
                            </Picker>

                            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>Background Color</Text>
                            <Picker selectedValue={backgroundColor} onValueChange={setBackgroundColor} style={{ height: 50 }}>
                                <Picker.Item label="White" value="white" />
                                <Picker.Item label="Light Yellow" value="lightyellow" />
                                <Picker.Item label="Light Blue" value="lightblue" />
                                <Picker.Item label="Gray" value="lightgray" />
                            </Picker>

                            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>Font Size</Text>
                            <Slider
                                minimumValue={12}
                                maximumValue={24}
                                value={fontSize}
                                onValueChange={setFontSize}
                                step={1}
                            />
                            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 10 }}>{fontSize} pt</Text>

                            <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>Line Spacing</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1}
                                maximumValue={2}
                                value={lineSpacing}
                                onValueChange={setLineSpacing}
                                step={0.1}
                            />
                            <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 10 }}>{lineSpacing.toFixed(1)}</Text>

                            <Button title="Save Preferences" onPress={savePreferences} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Change Text Modal */}
            <Modal visible={isTextChangeVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setIsTextChangeVisible(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                            {/* Upload Document Button */}
                            <TouchableOpacity
                                style={{ backgroundColor: '#f0ad4e', padding: 10, borderRadius: 8, marginBottom: 20 }}
                                onPress={async () => {
                                    const extractedText = await extractTextFromDocument(); 
                                    if (extractedText) {
                                        setNewText(extractedText);
                                    }
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>📂 Upload Document</Text>
                            </TouchableOpacity>

                            {/* Text Input */}
                            <TextInput
                                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, fontSize: 16, minHeight: 100 }}
                                placeholder="Type new text here..."
                                multiline
                                value={newText}
                                onChangeText={setNewText}
                            />

                            {/* Confirm Button */}
                            <Button title="Confirm" onPress={handleTextChange} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Floating Buttons */}
            <View style={{ position: 'absolute', right: 20, bottom: 20, gap: 10 }}>
                <TouchableOpacity style={{ backgroundColor: '#007bff', padding: 12, borderRadius: 8 }} onPress={() => setIsSettingsVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>⚙ Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: '#28a745', padding: 12, borderRadius: 8 }} onPress={() => setIsTextChangeVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>✍ Change Text</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReadingScreen;
