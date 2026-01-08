import {atom} from 'jotai';
import {atomFamily} from "jotai-family";

export const rotationAtom = atom(0);

export type TimerMode = 'SEC' | 'MIN';

export interface TimerState {
    timeValue: number;
    isRunning: boolean;
    mode: TimerMode;
}

export const timerAtomFamily = atomFamily((id: string) =>
    atom<TimerState>({ timeValue: 0, isRunning: false, mode: 'SEC' })
);

export const timerIdsAtom = atom<string[]>([]);