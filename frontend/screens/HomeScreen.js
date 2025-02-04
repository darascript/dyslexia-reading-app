import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const fetchUser = async () => {
                const storedUsername = await AsyncStorage.getItem('username');
                setUsername(storedUsername || '');
            };
            fetchUser();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    return (
        <View>
            <Text>Welcome, {username}!</Text>
        </View>
    );
}
