// Timer'ın genel state'i
export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

// Süre birimi
export type DurationType = 'MIN' | 'SEC' | 'HOUR';

// Timer config
export interface TimerConfig {
    maxDurationSeconds: number;
    degreesPerSecond: number;
}

// Timer değeri
export interface TimerValue {
    totalSeconds: number;
    degrees: number;
}
