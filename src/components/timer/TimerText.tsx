import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useAtomValue} from "jotai";
import {rotationAtom} from "../../store/atoms.ts";


type TimerTextProps = {
    durationType?: "MIN" | "SEC" | "HOUR",
    subTitle?: string
}

export const TimerText: React.FC<TimerTextProps> = ({durationType = "SEC", subTitle = "SETUP TIME"}) => {
    // jotai states
    const rotation = useAtomValue(rotationAtom);


    return <View style={[styles.container]}>
        <Text
            style={[styles.countText]}> {"00"} : {rotation < 60 ? `0${Math.floor(rotation / 6)}` : Math.floor(rotation / 6)}
        <Text style={[styles.subTitleText]}>{Math.max(0, rotation % 10) }</Text>
        </Text>

        <Text style={[styles.durationTypeText]}>{durationType}</Text>

    </View>
}


const styles = StyleSheet.create({
    container: {alignItems: "center"},
    countText: {
        fontSize: 48,
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

