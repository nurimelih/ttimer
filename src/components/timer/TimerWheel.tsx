import React, {useRef} from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useDerivedValue,
    useAnimatedProps,
    withTiming,
    Easing,
    cancelAnimation,
    useAnimatedReaction
} from "react-native-reanimated";
import {useSetAtom} from 'jotai';
import {rotationAtom} from "../../store/atoms.ts";
import {runOnJS} from "react-native-worklets";
import Icon from "react-native-vector-icons/Ionicons";
import {useTimerManager} from "../../hooks/useTimerManager.ts";


export const TimerWheel: React.FC = () => {
    // variables
    const wheelRef = useRef<View>(null);
    const savedRotation = useSharedValue(0);
    const previousAngle = useSharedValue(0);
    const centerX = useSharedValue(0);
    const centerY = useSharedValue(0);
    const lastUpdateTime = useSharedValue<number>(0);

    // managers
    const {rotation, isTimerRunning, pauseTimer, resumeTimer} = useTimerManager()

    // jotai states
    const setRotation = useSetAtom(rotationAtom);

    // functions
    const updateRotation = (degrees: number) => {
        setRotation(degrees);
    };

    const handlePlayPauseIcon = () => {
        console.log("is", isTimerRunning)
        if (isTimerRunning.value)
            pauseTimer();
        else
            resumeTimer()
    }


    const panGesture = Gesture.Pan()
        .onStart((e) => {
            // Timer çalışıyorsa durdur
            if (isTimerRunning.value) {
                cancelAnimation(rotation);
                isTimerRunning.value = false;
            }

            const dx = e.absoluteX - centerX.value;
            const dy = e.absoluteY - centerY.value;
            previousAngle.value = Math.atan2(dy, dx);
        })
        .onUpdate((e) => {
            const dx = e.absoluteX - centerX.value;
            const dy = e.absoluteY - centerY.value;
            const currentAngle = Math.atan2(dy, dx);

            // Önceki açıdan şu anki açıya kadar olan farkı hesapla
            let angleDiff = currentAngle - previousAngle.value;

            // -π ile +π arasındaki zıplamayı düzelt
            if (angleDiff > Math.PI) {
                angleDiff -= 2 * Math.PI;
            } else if (angleDiff < -Math.PI) {
                angleDiff += 2 * Math.PI;
            }

            // Rotasyonu güncelle ve 0-2π arasına sınırla
            let newRotation = rotation.value + angleDiff;
            newRotation = Math.max(0, Math.min(newRotation, Math.PI * 2));

            rotation.value = newRotation;
            previousAngle.value = currentAngle;

            // Store güncelleme (50ms throttle)
            const now = Date.now();
            if (now - lastUpdateTime.value >= 50) {
                lastUpdateTime.value = now;
                const degrees = Math.round((rotation.value / Math.PI) * 180);
                runOnJS(updateRotation)(degrees);
            }
        })
        .onEnd(() => {
            savedRotation.value = rotation.value;
            const degrees = Math.round((rotation.value / Math.PI) * 180);
            runOnJS(updateRotation)(degrees);
            runOnJS(resumeTimer)();

        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{rotateZ: `${((rotation.value / Math.PI) * 180)}deg`}],
    }));


    useAnimatedReaction(
        () => rotation.value,
        (currentRotation, previousRotation) => {
            if (currentRotation !== previousRotation) {
                const degrees = Math.round((currentRotation / Math.PI) * 180);
                runOnJS(updateRotation)(degrees);
            }
        }
    );

    return (<View style={[styles.container]}>
        <View style={styles.wheelContainer}>
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    ref={wheelRef}
                    onLayout={() => {
                        wheelRef.current?.measureInWindow((x, y, width, height) => {
                            centerX.value = x + width / 2;
                            centerY.value = y + height / 2;
                        });
                    }}
                    style={[styles.animatedContainer, animatedStyle]}>

                </Animated.View>

            </GestureDetector>

            <TouchableOpacity style={[styles.playIcon]} onPress={handlePlayPauseIcon}>
                <Icon name="caret-forward-circle-outline" size={30} color="black"/>
            </TouchableOpacity>
        </View>
    </View>)
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },

    innerCircle: {
        height: 120,
        width: 20,
        backgroundColor: 'black',
        borderRadius: 10,
        borderTopWidth: 10,
        borderTopColor: "red",
    },
    wheelContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedContainer: {
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 5,
        borderColor: "#3d3d4e",
        borderStyle: "dashed",
        borderRadius: "50%",
    },
    image: {}
    ,
})