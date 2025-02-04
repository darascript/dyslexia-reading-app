import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ setIsAuthenticated }) {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        setMessage('');
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });

            if (response.data.token) {
                await AsyncStorage.setItem('token', response.data.token);
                await AsyncStorage.setItem('username', username);
                setIsAuthenticated(true); // ✅ Update authentication state immediately
                navigation.replace('Home'); // ✅ Navigate AFTER updating auth state
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            setMessage(error.response?.data || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Login" onPress={handleLogin} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5 },
    message: { marginTop: 20, textAlign: 'center' },
});
