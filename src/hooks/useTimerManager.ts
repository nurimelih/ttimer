import {cancelAnimation, Easing, useSharedValue, withTiming, runOnUI} from "react-native-reanimated";
import {TIMER_CONSTANTS} from "../constants/timer"

export const useTimerManager = () => {
    const {MAX_DURATION} = TIMER_CONSTANTS;

    const rotation = useSharedValue(0);
    const isTimerRunning = useSharedValue(false);

    const startTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            const rotationRatio = rotation.value / (Math.PI * 2);
            const durationMs = rotationRatio * MAX_DURATION;

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

    const resumeTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            const rotationRatio = rotation.value / (Math.PI * 2);
            const remainingMs = rotationRatio * MAX_DURATION;

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

    const resetTimer = () => {
        runOnUI(() => {
            'worklet';
            cancelAnimation(rotation);
            rotation.value = 0;
            isTimerRunning.value = false;
        })();
    };


    return {
        rotation,
        isTimerRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
    };
};