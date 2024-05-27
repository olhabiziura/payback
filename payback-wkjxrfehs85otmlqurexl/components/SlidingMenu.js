import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SlidingMenu = ({ isVisible, onClose }) => {
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

    React.useEffect(() => {
        if (isVisible) {
            translateX.value = withSpring(0);
        } else {
            translateX.value = withSpring(width);
        }
    }, [isVisible]);

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.container, { transform: [{ translateX: translateX.value }] }]}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.menuText}>Menu Item 1</Text>
                <Text style={styles.menuText}>Menu Item 2</Text>
                <Text style={styles.menuText}>Menu Item 3</Text>
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
        elevation: 0,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginTop: 40,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'blsck',
    },
    menuText: {
        fontSize: 20,
        marginVertical: 10,
    },
});

export default SlidingMenu;
