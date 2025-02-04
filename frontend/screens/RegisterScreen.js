import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        setMessage('');
        try {
            console.log('Attempting registration with:', { username, email, password });
            await axios.post('http://localhost:8080/api/auth/register', { username, email, password });
            console.log('Registration successful!');
            setMessage('Registration successful! You can now log in.');
            navigation.navigate('Login'); 
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage(error.response?.data || 'Registration failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Register" onPress={handleRegister} />
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
