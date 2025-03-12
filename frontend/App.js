import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView, View, Text, Platform, StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { loadFonts } from './utils/loadFonts';

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await loadFonts();
                setFontsLoaded(true);
            } catch (e) {
                console.warn("Error loading fonts:", e);
                setFontsLoaded(true); // Continue anyway
            }
        }
        prepare();
    }, []);

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Loading fonts...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ 
            flex: 1, 
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            backgroundColor: '#ffffff'
        }}>
            <AppNavigator />
        </SafeAreaView>
    );
}