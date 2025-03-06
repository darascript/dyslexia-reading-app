import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const uploadDocumentAndExtractText = async () => {
    try {
        // Pick a document
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/pdf', 'application/epub+zip', 'text/plain'],
            copyToCacheDirectory: false,
        });

        if (result.canceled) {
            console.log("User cancelled document selection.");
            return null;
        }

        const { uri, name, mimeType } = result.assets[0];

        // Get authentication token
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            console.error("No authentication token found.");
            return null;
        }

        // Get username from storage (you'll need to store this when user logs in)
        const username = await AsyncStorage.getItem('username');
        if (!username) {
            console.error("No username found.");
            return null;
        }

        // Create FormData to send file
        const formData = new FormData();

        // Handle file based on platform
        const file = Platform.OS === 'web' 
            ? await fetch(uri).then(res => res.blob()) 
            : {
                uri: uri.replace('file://', ''),
                name,
                type: mimeType,
              };

        // Append file and username to FormData
        formData.append('file', file, name);
        formData.append('username', username);

        // Upload to backend
        const response = await axios.post('http://localhost:8080/api/texts/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.extractedText || "No text extracted.";
    } catch (error) {
        console.error("Error uploading document:", error);
        throw error; // Propagate error to caller
    }
};

export default uploadDocumentAndExtractText;