import React, {useRef} from "react";
import {Dimensions, Pressable, StyleSheet, View} from "react-native";
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    cancelAnimation,
    useAnimatedReaction, useAnimatedProps
} from "react-native-reanimated";
import {useAtomValue, useSetAtom} from 'jotai';
import {timerAtomFamily} from "../../store/atoms.ts";
import {runOnJS} from "react-native-worklets";
import Icon from "react-native-vector-icons/Ionicons";
import {useTimerManager} from "../../hooks/useTimerManager.ts";
import Svg, {Line, Text as SvgText, Path} from 'react-native-svg';
import {createArcPath, createEdgePath} from "../../utils/timerHelper.ts";


export const TimerWheel: React.FC<{ id: string }> = ({id}) => {
    // variables
    const paddingSize = 20;
    const clockSize = (Dimensions.get('window').width - paddingSize * 3) / 2;

    const TICK_COUNT_MIN = 12;  // 0, 5, 10, ..., 55

    const TICK_COUNT_SECOND = 60;  // 0, 5, 10, ..., 55
    const WHEEL_SIZE = clockSize
    const TICK_LENGTH = WHEEL_SIZE * 0.045; // 10/220 = 0.045
    const TICK_LENGTH_SECOND = WHEEL_SIZE * 0.023; // 5/220 = 0.023

    const wheelRef = useRef<View>(null);
    const [isRunningUI, setIsRunningUI] = React.useState(false);
    const savedRotation = useSharedValue(0);
    const previousAngle = useSharedValue(0);
    const centerX = useSharedValue(0);
    const centerY = useSharedValue(0);
    const lastUpdateTime = useSharedValue<number>(0);

    const AnimatedPath = Animated.createAnimatedComponent(Path);
    const AnimatedSvg = Animated.createAnimatedComponent(Svg);

    // themes
    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            borderWidth: 0,
            borderColor: "red",
            padding: 0,
        },
        svgContainer: {
            position: 'absolute',
        },

        wheelContainer: {
            width: clockSize,
            justifyContent: 'center',
            alignItems: 'center',
        },
        playIcon: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 6,
            backgroundColor: 'white',
            borderRadius: 21,
        },
        animatedContainer: {
            width: clockSize,
            height: clockSize,
        },
        image: {},
    });

    // jotai states
    const timerState = useAtomValue(timerAtomFamily(id));
    const setRotation = useSetAtom(timerAtomFamily(id));

    // managers
    const {rotation, isTimerRunning, pauseTimer, resumeTimer, startCountUp} = useTimerManager(timerState.mode)

    // functions
    const animatedSvgStyle = useAnimatedStyle(() => ({
        transform: [{rotateZ: `-${((rotation.value / Math.PI) * 180)}deg`}],
    }));


    const CENTER = WHEEL_SIZE / 2;
    const RADIUS = WHEEL_SIZE * 0.40; // 90/220 = 0.41
    const ARC_THICKNESS = WHEEL_SIZE * 0.27; // 60/220 = 0.27

    const animatedArcProps = useAnimatedProps(() => {
        const degrees = (rotation.value / Math.PI) * 180;
        const adjustedDegrees = Math.max(0, degrees - 1);
        const path = createArcPath(CENTER, CENTER, RADIUS - 10, 0, adjustedDegrees);
        return {d: path};
    });

    const animatedStartEdgeProps = useAnimatedProps(() => {
        return {
            d: createEdgePath(CENTER, CENTER, ARC_THICKNESS, 0),
        };
    });

    const animatedEndEdgeProps = useAnimatedProps(() => {
        const degrees = (rotation.value / Math.PI) * 180;
        return {
            d: createEdgePath(CENTER, CENTER, ARC_THICKNESS, degrees),
        };
    });

    const updateRotation = (degrees: number) => {
        setRotation((curr) => ({timeValue: degrees, isRunning: isRunningUI, mode: curr.mode}));
    };

    const handlePlayPauseIcon = () => {
        if (!isTimerRunning.value && rotation.value === 0) {
            // Timer 0'daysa ve çalışmıyorsa, ileri sayım başlat
            startCountUp();
            return;
        }

        if (isTimerRunning.value)
            pauseTimer();
        else
            resumeTimer()
    }

    const panGesture = Gesture.Pan()
        .onStart((e) => {
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

            let angleDiff = currentAngle - previousAngle.value;

            if (angleDiff > Math.PI) {
                angleDiff -= 2 * Math.PI;
            } else if (angleDiff < -Math.PI) {
                angleDiff += 2 * Math.PI;
            }

            let newRotation = rotation.value - angleDiff;
            const MAX_SECONDS = 59.9;
            const MAX_ROTATION = (MAX_SECONDS / 60) * Math.PI * 2;
            newRotation = Math.max(0, Math.min(newRotation, MAX_ROTATION));

            rotation.value = newRotation;
            previousAngle.value = currentAngle;

            const now = Date.now();
            if (now - lastUpdateTime.value >= 50) {
                lastUpdateTime.value = now;
                const degrees = Math.round((rotation.value / Math.PI) * 180);
                runOnJS(updateRotation)(degrees);
            }
        })
        .onEnd(() => {
            savedRotation.value = rotation.value;
            const degrees = Math.min(
                359,
                Math.round((rotation.value / Math.PI) * 180)
            );
            runOnJS(updateRotation)(degrees);
            runOnJS(resumeTimer)();

        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{rotateZ: `${((-rotation.value / Math.PI) * 180)}deg`}],
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

    useAnimatedReaction(
        () => isTimerRunning.value,
        (current, previous) => {
            if (current !== previous) {
                runOnJS(setIsRunningUI)(current);
            }
        }
    );

    const renderMinutes = () => {
        return Array.from({length: TICK_COUNT_MIN}, (_, i) => {
            const minute = i * 15;
            const angle = (minute / 60) * 360 - 90;
            const angleRad = angle * Math.PI / 180;

            const x1 = CENTER + RADIUS * Math.cos(angleRad);
            const y1 = CENTER + RADIUS * Math.sin(angleRad);

            const x2 = CENTER + (RADIUS - TICK_LENGTH) * Math.cos(angleRad);
            const y2 = CENTER + (RADIUS - TICK_LENGTH) * Math.sin(angleRad);

            return (
                <Line
                    key={minute}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="black"
                    strokeWidth={2}
                />
            );
        });
    };
    const renderSeconds = () => {
        return Array.from({length: TICK_COUNT_SECOND}, (_, i) => {
            const minute = i;
            const angle = (minute / 60) * 360 - 90;
            const angleRad = angle * Math.PI / 180;

            const x1 = CENTER + RADIUS * Math.cos(angleRad);
            const y1 = CENTER + RADIUS * Math.sin(angleRad);

            const x2 = CENTER + (RADIUS - TICK_LENGTH_SECOND) * Math.cos(angleRad);
            const y2 = CENTER + (RADIUS - TICK_LENGTH_SECOND) * Math.sin(angleRad);

            return (
                <Line
                    key={minute}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="black"
                    strokeWidth={1}
                />
            );
        });
    };
    const renderNumbers = () => {
        const TEXT_RADIUS = WHEEL_SIZE * 0.45; // 100/220 = 0.45
        const FONT_SIZE = WHEEL_SIZE * 0.082; // 18/220 = 0.082

        return Array.from({length: TICK_COUNT_MIN}, (_, i) => {
            const minute = i * 5;
            const angle = (minute / 60) * 360 - 90;
            const angleRad = angle * Math.PI / 180;

            const x = CENTER + TEXT_RADIUS * Math.cos(angleRad);
            const y = CENTER + TEXT_RADIUS * Math.sin(angleRad);

            // Her rakam çizgiye dik olsun diye açıyı hesapla
            const textRotation = angle + 90;


            return (
                <SvgText
                    key={`text-${minute}`}
                    x={x}
                    y={y}
                    fontSize={FONT_SIZE}
                    transform={`rotate(${textRotation} ${x} ${y})`}
                    fill="black"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {minute}
                </SvgText>
            );
        });
    };

    return (<View style={[styles.container]}>
        <View style={styles.wheelContainer}>

            <AnimatedSvg
                width={clockSize}
                height={clockSize}
                style={[styles.svgContainer, animatedSvgStyle]}
            >
                <AnimatedPath
                    animatedProps={animatedStartEdgeProps}
                    stroke="white"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                />
                <AnimatedPath animatedProps={animatedArcProps} fill="#d23b38"/>

                <AnimatedPath
                    animatedProps={animatedEndEdgeProps}
                    stroke="white"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                />
                {renderNumbers()}
                {renderMinutes()}
                {renderSeconds()}
            </AnimatedSvg>


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

            <Pressable style={[styles.playIcon]} onPress={handlePlayPauseIcon}>

                <Icon
                    name={isRunningUI ? "pause-outline" : "caret-forward-circle-outline"}
                    size={30}
                    color="black"
                />
            </Pressable>
        </View>
    </View>)
}
