import {atom} from 'jotai';
import {atomFamily} from "jotai-family";

export const rotationAtom = atom(0);

export type TimerMode = 'SEC' | 'MIN';

export interface TimerState {
    timeValue: number;
    isRunning: boolean;
    mode: TimerMode;
    direction: "FORWARD"  | "BACKWARD"
}

export const timerAtomFamily = atomFamily((id: string) =>
    atom<TimerState>({ timeValue: 0, isRunning: false, mode: 'SEC', direction: 'BACKWARD' })
);

export const timerIdsAtom = atom<string[]>([]);