import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Navbar({ isAuthenticated, onLogout }) {
    const navigation = useNavigation();

    return (
        <View style={styles.navbar}>
            {isAuthenticated ? (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.navButton}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Reading')}>
                        <Text style={styles.navButton}>Reading</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onLogout()}>
                        <Text style={styles.navButton}>Logout</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.navButton}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.navButton}>Register</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#6200ee',
        paddingVertical: 10,
    },
    navButton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
