import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [savedTexts, setSavedTexts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername) {
                    setUsername(storedUsername);
                    fetchSavedTexts(storedUsername);
                }
            };
            fetchUser();
        }, [])
    );

    const fetchSavedTexts = async (username) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/texts/user/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSavedTexts(response.data);
        } catch (error) {
            console.error('Error fetching saved texts:', error);
            setErrorMessage('Failed to load saved texts.');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome, {username}!</Text>

            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

            <Text style={{ fontSize: 18, marginTop: 20 }}>Your Saved Texts:</Text>
            <FlatList
                data={savedTexts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('TextDetail', { textId: item.id })}
                        style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}
                    >
                        <Text numberOfLines={2} style={{ fontSize: 16 }}>{item.content}</Text>
                    </TouchableOpacity>
                )}
            />

        
        </View>
    );
}
