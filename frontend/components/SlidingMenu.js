import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SlidingMenu = ({ navigation, isVisible, onClose }) => {
    const translateX = useSharedValue(width);

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            translateX.value = event.translationX;
        },
        onEnd: (event) => {
            if (event.translationX > -width / 2) {
                translateX.value = withSpring(width);
            } else {
                translateX.value = withSpring(0);
            }
        },
    });

    useEffect(() => {
        if (isVisible) {
            translateX.value = withSpring(0);
        } else {
            translateX.value = withSpring(width);
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });


    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.container, animatedStyle, { zIndex: isVisible ? 1 : -1 }]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SpinWheel')}>
                    <Text style={styles.menuText}>Roulette</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Receipt Scan')}>
                    <Text style={styles.menuText}>Receipt Scanner</Text>
                </TouchableOpacity>
                <Text style={styles.menuText}>Some other random game</Text>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '70%',
        height: '100%',
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginTop: 40,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'black',
    },
    menuText: {
        fontSize: 20,
        marginVertical: 10,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: '90%',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SlidingMenu;
