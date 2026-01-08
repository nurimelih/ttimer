import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import {useAtom, useAtomValue} from "jotai";
import {atomFamily} from "jotai-family";
import {timerAtomFamily} from "../../store/atoms.ts";


type TimerTextProps = {
    id: string;
    subTitle?: string
}

export const TimerText: React.FC<TimerTextProps> = ({id}) => {
    // jotai states
    const [timer, setTimer] = useAtom(timerAtomFamily(id));

    // functions
    const handleOnTypePress = () => {
        setTimer(prev => ({
            ...prev,
            mode: prev.mode === 'SEC' ? 'MIN' : 'SEC'
        }));
    }


    return <View style={[styles.container]}>
        <Text
            style={[styles.countText]}> {"00"} : {timer.timeValue < 60 ? `0${Math.floor(timer.timeValue / 6)}` : Math.floor(timer.timeValue / 6)}
            <Text style={[styles.subTitleText]}>{Math.max(0, timer.timeValue % 10)}</Text>
        </Text>

        <Pressable onPress={handleOnTypePress}>
            <Text style={[styles.durationTypeText]}>{timer.mode}</Text>
        </Pressable>

    </View>
}


const styles = StyleSheet.create({
    container: {alignItems: "center"},
    countText: {
        fontSize: 28,
        fontWeight: '700',  // Bold
        color: 'black',
        fontFamily: "Helvetica"

    },
    durationTypeText: {
        fontSize: 26,
        fontWeight: '500',  // Medium
        color: '#666',
    },
    subTitleText: {
        fontSize: 22,
        fontWeight: '400',  // Regular
        color: '#999',
    },

});

