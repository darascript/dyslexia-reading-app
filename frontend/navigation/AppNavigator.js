import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import Navbar from '../screens/Navbar';
import { useNavigation } from '@react-navigation/native';
import ReadingScreen from '../screens/ReadingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check for authentication token on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token); // Set authentication state
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Logout handler
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token'); // Clear token
        setIsAuthenticated(false); // Update state
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Loading...</Text>
            </View>
        );
    }

    // Protected route wrapper (only accessible if authenticated)
    const ProtectedRoute = ({ children }) => {
        const navigation = useNavigation(); // Ensure useNavigation() is here

        if (!isAuthenticated) {
            return (
                <View style={styles.centered}>
                    <Text>You must be logged in to access this page.</Text>
                    <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
                </View>
            );
        }
        return children;
    };

    return (
        <NavigationContainer>
            {/* Layout with Navbar */}
            <View style={styles.container}>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <View style={styles.content}>
                    <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
                        <Stack.Screen name="Login">
                        {() => <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
                        </Stack.Screen>
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Home">
                            {() => (
                                <ProtectedRoute>
                                    <HomeScreen />
                                </ProtectedRoute>
                            )}
                        </Stack.Screen>

                        {/* Add your new screens here */}

                        <Stack.Screen name="Reading">
                            {() => (
                                <ProtectedRoute>
                                    <ReadingScreen />
                                </ProtectedRoute>
                            )}
                        </Stack.Screen>

                    </Stack.Navigator>
                </View>
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
