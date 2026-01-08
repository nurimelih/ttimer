import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useAtomValue} from "jotai";
import {atomFamily} from "jotai-family";
import {rotationAtom, timerAtomFamily} from "../../store/atoms.ts";


type TimerTextProps = {
    id: string;
    durationType?: "MIN" | "SEC" | "HOUR",
    subTitle?: string
}

export const TimerText: React.FC<TimerTextProps> = ({id, durationType = "SEC", subTitle = "SETUP TIME"}) => {
    // jotai states
    const rotation = useAtomValue(timerAtomFamily(id));




    return <View style={[styles.container]}>
        <Text
            style={[styles.countText]}> {"00"} : {rotation.timeValue < 60 ? `0${Math.floor(rotation.timeValue / 6)}` : Math.floor(rotation.timeValue / 6)}
            <Text style={[styles.subTitleText]}>{Math.max(0, rotation.timeValue % 10)}</Text>
        </Text>

        <Text style={[styles.durationTypeText]}>{durationType}</Text>

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

