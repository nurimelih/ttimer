import {cancelAnimation, Easing, useSharedValue, withTiming, runOnUI} from "react-native-reanimated";
import {TIMER_CONSTANTS} from "../constants/timer"

export const useTimerManager = (mode: 'SEC' | 'MIN' = 'SEC') => {
    const {MAX_DURATION, MAX_DURATION_HOUR} = TIMER_CONSTANTS;

    const rotation = useSharedValue(0);
    const isTimerRunning = useSharedValue(false);

    const getMaxDuration = () => {
        return mode === 'MIN' ? MAX_DURATION_HOUR : MAX_DURATION;
    };

    const startTimer = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            const rotationRatio = rotation.value / (Math.PI * 2);
            const maxDuration = mode === 'MIN' ? MAX_DURATION_HOUR : MAX_DURATION;
            const durationMs = rotationRatio * maxDuration;

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
            const maxDuration = mode === 'MIN' ? MAX_DURATION_HOUR : MAX_DURATION;
            const remainingMs = rotationRatio * maxDuration;

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

    const startCountUp = () => {
        runOnUI(() => {
            'worklet';
            isTimerRunning.value = true;

            // 0'dan max rotation'a kadar git (ileri sayım)
            const maxRotation = (59.9 / 60) * Math.PI * 2;
            const maxDuration = mode === 'MIN' ? MAX_DURATION_HOUR : MAX_DURATION;

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
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        startCountUp,
    };
};