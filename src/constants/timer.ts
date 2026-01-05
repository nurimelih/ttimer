export const TIMER_CONSTANTS = {
    // MIN_DURATION: 60 * 1000, // 1 min in ms
    MAX_DURATION: 60 * 1000, // 1 min in ms
    MAX_ACTIVE_TIMERS: 4,
    WHEEL_SIZE: 280,
    WHEEL_STROKE_WIDTH: 20,
    TICK_INTERVAL: 1000,
} as const;

export const ANIMATION_CONFIG = {
    SCALE_DOWN_DURATION: 300,
    LAYOUT_TRANSITION_DURATION: 400,
    FADE_DURATION: 200,
} as const;

export const STORAGE_KEY = '@ttimer:state';
