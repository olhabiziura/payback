import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const SlidingMenu = ({ navigation, isVisible, onClose }) => {
    const translateY = useSharedValue(height);

    const gestureHandler = useAnimatedGestureHandler({
        onActive: (event) => {
            translateY.value = event.translationY + height * 0.3;
        },
        onEnd: (event) => {
            if (event.translationY > height * 0.15) {
                translateY.value = withSpring(height, {}, () => {
                    onClose();
                });
            } else {
                translateY.value = withSpring(height * 0.3);
            }
        },
    });

    useEffect(() => {
        if (isVisible) {
            translateY.value = withSpring(height * 0.3);
        } else {
            translateY.value = withSpring(height);
        }
    }, [isVisible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBackground}>
                    <PanGestureHandler onGestureEvent={gestureHandler}>
                        <Animated.View style={[styles.container, animatedStyle]}>
                            <TouchableWithoutFeedback>
                                <View>
                                    <TouchableOpacity onPress={() => navigation.navigate('SpinWheel')}>
                                        <Text style={styles.menuText}>Roulette</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Receipt Scan')}>
                                        <Text style={styles.menuText}>Receipt Scanner</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Payment Page')}>
                                        <Text style={styles.menuText}>Pay Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </Animated.View>
                    </PanGestureHandler>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    container: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    menuText: {
        fontSize: 20,
        marginVertical: 10,
    },
});

export default SlidingMenu;
