import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider'; // Import the new Slider

const WordHighlightScreen = ({ text, onExit, font, fontSize, lineSpacing, backgroundColor }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [words, setWords] = useState([]);
    const [highlightedText, setHighlightedText] = useState([]);
    const [wpm, setWpm] = useState(300); // Default WPM: 300
    const [highlightCount, setHighlightCount] = useState(1); // Default: 1 word highlighted

    // Split the text into words whenever it changes
    useEffect(() => {
        setWords(text.split(/\s+/)); // Split by spaces
    }, [text]);

    // Handle word highlighting logic based on WPM
    useEffect(() => {
        if (words.length === 0) return;

        // Calculate the delay based on WPM
        const delay = 60000 / wpm; // Delay in milliseconds

        // Create a timer to switch words based on the delay calculated from WPM
        const intervalId = setInterval(() => {
            setCurrentWordIndex(prevIndex => {
                const nextIndex = (prevIndex + highlightCount) % words.length; // Loop back to start after the last word
                return nextIndex;
            });
        }, delay);

        // Cleanup interval on component unmount or when WPM or highlightCount changes
        return () => clearInterval(intervalId);
    }, [words, wpm, highlightCount]);

    // Update the highlighted text to display with the specified number of words highlighted
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
        <View style={[styles.container, { backgroundColor }]}>
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
                />
            </View>

            {/* Exit Button */}
            <CustomButton title="Exit" color="#007bff" onPress={onExit} />
        </View>
    );
};

const CustomButton = ({ onPress, title, color }) => (
    <Pressable
        onPress={onPress}
        style={{
            backgroundColor: color,
            padding: 12,
            borderRadius: 10,
            marginTop: 15,
            alignItems: 'center',
            width: '80%', // Button takes up 80% of the screen width for a cleaner look
        }}
    >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
    </Pressable>
);

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
        color: '#333', // Darker color for better readability
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
        color: '#555', // Slightly lighter gray for the label
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 15,
        marginBottom: 20,
    },
});

export default WordHighlightScreen;
