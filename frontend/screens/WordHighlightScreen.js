import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const WordHighlightScreen = ({ text, onExit, font, fontSize, lineSpacing, backgroundColor }) => {
    const insets = useSafeAreaInsets();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState([]);
    const [highlightedText, setHighlightedText] = useState([]);
    const [wpm, setWpm] = useState(300); // Default WPM: 300
    const [highlightCount, setHighlightCount] = useState(1); // Default: 1 word highlighted

    // Split the text into words whenever it changes
    useEffect(() => {
        setWords(text.split(/\s+/)); 
    }, [text]);

    // Handle word highlighting logic based on WPM
    useEffect(() => {
        if (words.length === 0) return;

        const delay = 60000 / wpm; // Delay in milliseconds

        
        const intervalId = setInterval(() => {
            setCurrentWordIndex(prevIndex => {
                const nextIndex = (prevIndex + highlightCount) % words.length; 
                return nextIndex;
            });
        }, delay);

        
        return () => clearInterval(intervalId);
    }, [words, wpm, highlightCount]);

    
    useEffect(() => {
        const newHighlightedText = words.map((word, index) => {
            if (index >= currentWordIndex && index < currentWordIndex + highlightCount) {
                return <Text key={index} style={styles.highlighted}>{word} </Text>;
            }
            return <Text key={index}>{word} </Text>;
        });
        setHighlightedText(newHighlightedText);
    }, [currentWordIndex, highlightCount, words]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar barStyle={backgroundColor === 'white' ? 'dark-content' : 'light-content'} />
            <Text style={[styles.title, { fontFamily: font, fontSize: fontSize + 4 }]}>Word Highlight Mode</Text>
            <View style={styles.textContainer}>
                {highlightedText}
            </View>

            {/* WPM Slider */}
            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Speed: {wpm} WPM</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={50}
                    maximumValue={1000}
                    step={10}
                    value={wpm}
                    onValueChange={(value) => setWpm(value)}
                    minimumTrackTintColor="#4285F4"
                    maximumTrackTintColor="#D1D1D1"
                    thumbTintColor="#4285F4"
                />
            </View>

            {/* Word Count Slider */}
            <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Words Highlighted: {highlightCount}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={highlightCount}
                    onValueChange={(value) => setHighlightCount(value)}
                    minimumTrackTintColor="#4285F4"
                    maximumTrackTintColor="#D1D1D1"
                    thumbTintColor="#4285F4"
                />
            </View>

            {/* Exit Button */}
            <TouchableOpacity 
                style={[styles.actionButton, { marginBottom: insets.bottom + 20 }]}
                onPress={onExit}
            >
                <Text style={styles.actionButtonText}>Exit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    highlighted: {
        backgroundColor: 'yellow',
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
    },
    sliderContainer: {
        width: '80%',
        marginBottom: 25,
    },
    sliderLabel: {
        fontSize: 20,
        color: '#555', 
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 15,
        marginBottom: 20,
    },
    actionButton: {
        width: 200,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    actionButtonText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
});

export default WordHighlightScreen;