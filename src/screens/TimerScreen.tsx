import {StyleSheet, View} from 'react-native';
import {TimerWheel} from '../components/timer/TimerWheel';
import {TimerText} from '../components/timer/TimerText';

export const TimerScreen = () => {
    return (
        <View style={[styles.container]}>
            <TimerText/>
            <TimerWheel/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c3c3c3',

        borderWidth: 1,
        borderColor: 'black',
        width: '100%',
        height: '100%'
    },

});
