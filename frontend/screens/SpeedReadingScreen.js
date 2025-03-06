import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider'; // Import the new Slider

const SpeedReadingScreen = ({ text, onExit }) => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [readingSpeed, setReadingSpeed] = useState(300); // Default speed in WPM
    const [wordsToShow, setWordsToShow] = useState(1); // Default: Show one word at a time
    const [readingInterval, setReadingInterval] = useState(null);

    useEffect(() => {
        setWords(text.split(' '));
    }, [text]);

    const startSpeedReading = () => {
        if (readingInterval) clearInterval(readingInterval);

        let interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => {
                if (prevIndex >= words.length - wordsToShow) {
                    clearInterval(interval);
                    return 0; // Restart from the beginning
                }
                return prevIndex + wordsToShow;
            });
        }, (60 / readingSpeed) * 1000);

        setReadingInterval(interval);
    };

    const stopSpeedReading = () => {
        if (readingInterval) clearInterval(readingInterval);
        setReadingInterval(null);
        setCurrentWordIndex(0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.speedReadingWord}>
                {words.slice(currentWordIndex, currentWordIndex + wordsToShow).join(' ')}
            </Text>

            <View style={styles.controls}>
                <Text>Speed: {readingSpeed} WPM</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={50}
                    maximumValue={1000}
                    step={10}
                    value={readingSpeed}
                    onValueChange={(value) => setReadingSpeed(value)}
                />
            </View>

            <View style={styles.controls}>
                <Text>Words per cycle: {wordsToShow}</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={wordsToShow}
                    onValueChange={(value) => setWordsToShow(value)}
                />
            </View>

            <CustomButton title="▶ Start" color="#28a745" onPress={startSpeedReading} />
            <CustomButton title="⏹ Stop" color="#d9534f" onPress={stopSpeedReading} />
            <CustomButton title="🔙 Normal Reading Mode" color="#007bff" onPress={onExit} />
        </View>
    );
};

const CustomButton = ({ onPress, title, color }) => (
    <Pressable
        onPress={onPress}
        style={{
            backgroundColor: color,
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
            alignItems: 'center',
        }}
    >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    speedReadingWord: { fontSize: 48, fontWeight: 'bold' },
    controls: { marginVertical: 20, alignItems: 'center' },
});

export default SpeedReadingScreen;
