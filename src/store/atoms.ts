import {atom} from 'jotai';
import {atomFamily} from "jotai-family";

export const rotationAtom = atom(0);

export const timerAtomFamily = atomFamily((id: string) =>
    atom({ timeValue: 0, isRunning: false, mode: "SEC" })
);

export const timerIdsAtom = atom<string[]>([]);