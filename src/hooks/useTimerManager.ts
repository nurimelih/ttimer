import {cancelAnimation, Easing, useSharedValue, withTiming, runOnUI} from "react-native-reanimated";
import {TIMER_CONSTANTS} from "../constants/timer"


export const useTimerManager = () => {
    const {MAX_DURATION_HOUR} = TIMER_CONSTANTS;

    const rotation = useSharedValue(0);
    const isTimerRunning = useSharedValue(false);
    const direction = useSharedValue("BACKWARD");

    const startTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            const rotationRatio = rotation.value / (Math.PI * 2);
            const durationMs = rotationRatio * MAX_DURATION_HOUR;
            direction.value = "FORWARD"

            rotation.value = withTiming(0, {
                duration: durationMs,
                easing: Easing.linear,
            }, (finished) => {
                if (finished) {
                    isTimerRunning.value = false;
                }
            });
        })();
    };

    const pauseTimer = () => {
        runOnUI(() => {
            'worklet';
            cancelAnimation(rotation);
            isTimerRunning.value = false;
        })();
    };

    const resumeCountDownTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            const rotationRatio = rotation.value / (Math.PI * 2);
            const remainingMs = rotationRatio * MAX_DURATION_HOUR;
            direction.value = "FORWARD"

            rotation.value = withTiming(0, {
                duration: remainingMs,
                easing: Easing.linear,
            }, (finished) => {
                if (finished) {
                    isTimerRunning.value = false;
                }
            });
        })();
    };

    const resumeCountUpTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;




            // 0'dan max rotation'a kadar git (ileri sayım)
            const maxRotation = (59.9 / 60) * Math.PI * 2;
            const maxDuration = MAX_DURATION_HOUR;


            rotation.value = withTiming(maxRotation, {
                duration: maxDuration,
                easing: Easing.linear,
            }, (finished) => {
                if (finished) {
                    isTimerRunning.value = false;
                }
            });
        })();
    };


    const resetTimer = () => {
        runOnUI(() => {
            'worklet';
            cancelAnimation(rotation);
            rotation.value = 0;
            isTimerRunning.value = false;
        })();
    };

    const startCountUp = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            // 0'dan max rotation'a kadar git (ileri sayım)
            const maxRotation = (59.9 / 60) * Math.PI * 2;
            const maxDuration = MAX_DURATION_HOUR;
            direction.value = "FORWARD";

            rotation.value = withTiming(maxRotation, {
                duration: maxDuration,
                easing: Easing.linear,
            }, (finished) => {
                if (finished) {
                    isTimerRunning.value = false;
                }
            });
        })();
    };


    return {
        rotation,
        isTimerRunning,
        direction,
        startTimer,
        pauseTimer,
        resumeCountDownTimer,
        resumeCountUpTimer,
        resetTimer,
        startCountUp,
    };
};