export type TimerState = 'idle' | 'running' | 'paused' | 'finished';

export type DurationType = 'MIN' | 'SEC' | 'HOUR';

export interface TimerConfig {
    maxDurationSeconds: number;
    degreesPerSecond: number;
}

export interface TimerValue {
    totalSeconds: number;
    degrees: number;
}
