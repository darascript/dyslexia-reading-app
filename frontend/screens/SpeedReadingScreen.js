import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import BaseModal from '../components/BaseModal';
import { StatusBar } from 'react-native';

const SpeedReadingScreen = ({ text, onExit, backgroundColor = 'white', fontSize = 16, lineSpacing = 1.5, font = 'sans-serif' }) => {
    

    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [readingSpeed, setReadingSpeed] = useState(300); // Default speed in WPM
    const [wordsToShow, setWordsToShow] = useState(1); // Default: Show one word at a time
    const [readingInterval, setReadingInterval] = useState(null);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastMouseMove, setLastMouseMove] = useState(Date.now());
    const [shouldShowControls, setShouldShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    
    // For animations
    const controlsOpacity = useRef(new Animated.Value(1)).current;
    const wordScale = useRef(new Animated.Value(1)).current;

    
    useEffect(() => {
        
        const cleanedText = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        setWords(cleanedText.split(' '));
    }, [text]);

    useEffect(() => {
       
        const handleMouseMove = () => {
            setLastMouseMove(Date.now());
            if (!shouldShowControls && isPlaying) {
                showControls();
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchstart', handleMouseMove);
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchstart', handleMouseMove);
            };
        }
    }, [shouldShowControls, isPlaying]);

    useEffect(() => {
        // Hide controls after inactivity during playback
        if (isPlaying) {
            const timer = setInterval(() => {
                const now = Date.now();
                if (now - lastMouseMove > 3000 && shouldShowControls) {
                    hideControls();
                }
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [lastMouseMove, isPlaying, shouldShowControls]);

   
    const showControls = () => {
        setShouldShowControls(true);
        Animated.timing(controlsOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    };

    const hideControls = () => {
        Animated.timing(controlsOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: Platform.OS !== 'web',
        }).start(() => {
            setShouldShowControls(false);
        });
    };

    const startSpeedReading = () => {
        console.log("Starting speed reading");
        if (readingInterval) clearInterval(readingInterval);
        setIsPlaying(true);
        
        // Pulse animation for word
        Animated.sequence([
            Animated.timing(wordScale, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(wordScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: Platform.OS !== 'web',
            })
        ]).start();

        let interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => {
                if (prevIndex >= words.length - wordsToShow) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    showControls();
                    return 0; 
                }
                
                // Calculate progress
                const newProgress = (prevIndex + wordsToShow) / words.length;
                setProgress(newProgress);
                
                
                Animated.sequence([
                    Animated.timing(wordScale, {
                        toValue: 1.05,
                        duration: 100,
                        useNativeDriver: Platform.OS !== 'web',
                    }),
                    Animated.timing(wordScale, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: Platform.OS !== 'web',
                    })
                ]).start();
                
                return prevIndex + wordsToShow;
            });
        }, (60 / readingSpeed) * 1000);

        setReadingInterval(interval);
    };

    const pauseSpeedReading = () => {
        console.log("Pausing speed reading");
        if (readingInterval) clearInterval(readingInterval);
        setReadingInterval(null);
        setIsPlaying(false);
    };

    const stopSpeedReading = () => {
        pauseSpeedReading();
        setCurrentWordIndex(0);
        setProgress(0);
    };

    const applySettings = () => {
        setIsSettingsVisible(false);
     
        if (isPlaying) {
            pauseSpeedReading();
            startSpeedReading();
        }
    };

    
    const adaptiveFontSize = fontSize * 2.5;

    return (
        <SafeAreaView 
            style={[styles.container, { backgroundColor }]} 
            onTouchStart={() => showControls()}
        >
            <StatusBar barStyle={backgroundColor === 'white' ? 'dark-content' : 'light-content'} />
            
            
            {/* Current word display */}
            <Animated.View style={styles.wordContainer}>
                <Animated.Text 
                    style={[
                        styles.speedReadingWord, 
                        {
                            transform: Platform.OS !== 'web' ? [{ scale: wordScale }] : [],
                            color: backgroundColor === 'white' ? '#333' : '#fff',
                            fontSize: adaptiveFontSize,
                            fontFamily: font === 'opendyslexic' ? 'OpenDyslexic' : font,
                            lineHeight: adaptiveFontSize * lineSpacing
                        }
                    ]}
                >
                    {words.length > 0 && currentWordIndex < words.length 
                     ? words.slice(currentWordIndex, currentWordIndex + wordsToShow).join(' ')
                     : ''}
                </Animated.Text>
            </Animated.View>
            
            {/* Settings Modal */}
            <BaseModal
                visible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
                onSave={applySettings}
                title="Speed Reading Settings"
                saveButtonText="Apply"
            >
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Speed: {Math.round(readingSpeed)} WPM</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={50}
                        maximumValue={1000}
                        step={10}
                        value={readingSpeed}
                        onValueChange={(value) => setReadingSpeed(value)}
                        minimumTrackTintColor="#4285F4"
                        maximumTrackTintColor="#D1D1D1"
                        thumbTintColor="#4285F4"
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Words per cycle: {Math.round(wordsToShow)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={5}
                        step={1}
                        value={wordsToShow}
                        onValueChange={(value) => setWordsToShow(value)}
                        minimumTrackTintColor="#4285F4"
                        maximumTrackTintColor="#D1D1D1"
                        thumbTintColor="#4285F4"
                    />
                </View>
            </BaseModal>

            {/* Bottom progress bar */}
            <View style={[styles.bottomProgressContainer, { bottom:  60 }]}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={[styles.progressText, { color: backgroundColor === 'white' ? '#333' : '#fff' }]}>
                    {Math.round(progress * 100)}%
                </Text>
            </View>

            {/* Floating controls */}
            <Animated.View 
                style={[
                    styles.controls, 
                    Platform.OS === 'web' ? (shouldShowControls ? styles.visible : styles.hidden) : { opacity: controlsOpacity }
                ]}
            >
                <View style={styles.topControls}>
                    {/* Back button - completely rebuild */}
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={onExit}
                    >
                        <Text style={styles.actionButtonText}>←</Text>
                    </TouchableOpacity>
                    
                    {/* Settings button - completely rebuild */}
                    <TouchableOpacity 
                        style={styles.settingsButton}
                        onPress={() => setIsSettingsVisible(true)}
                    >
                        <Text style={styles.actionButtonText}>⚙️</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={[styles.bottomControls, { marginBottom: 20 }]}>
                
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={stopSpeedReading}
                    >
                        <Text style={styles.actionButtonText}>⏹</Text>
                    </TouchableOpacity>

                  
                    {isPlaying ? (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={pauseSpeedReading}
                        >
                            <Text style={styles.actionButtonText}>⏸</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.primaryButton]}
                            onPress={startSpeedReading}
                        >
                            <Text style={styles.actionButtonText}>▶</Text>
                        </TouchableOpacity>
                    )}

                    
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                            setCurrentWordIndex(0);
                            setProgress(0);
                        }}
                    >
                        <Text style={styles.actionButtonText}>↺</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    progressBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4285F4',
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
    },
    speedReadingWord: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    controls: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
    },
    visible: {
        display: 'flex',
    },
    hidden: {
        display: 'none',
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    bottomProgressContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressTrack: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        marginRight: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4285F4',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        width: 40,
        textAlign: 'right',
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    settingsButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    primaryButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4285F4',
    },
    actionButtonText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
    },
    settingRow: {
        marginBottom: 24,
    },
    settingLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});

export default SpeedReadingScreen;