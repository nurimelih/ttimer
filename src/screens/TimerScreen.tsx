import {Dimensions, FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TimerWheel} from '../components/timer/TimerWheel';
import {TimerText} from '../components/timer/TimerText';
import {useAtom} from 'jotai';
import {timerIdsAtom} from '../store/atoms';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCallback} from 'react';
import {SafeAreaView} from "react-native-safe-area-context"

const paddingSize = 20;
const clockWidth = (Dimensions.get('window').width - paddingSize * 3) / 2;


export const TimerScreen = () => {
    const [timerIds, setTimerIds] = useAtom(timerIdsAtom);
    const isAllowedMore = timerIds?.length < 4;

    const addTimer = useCallback(() => {
        const newId = `timer-${Date.now()}`;
        setTimerIds(prev => {
            if (prev?.length < 4)
                return [...prev, newId]
            else return prev
        });
    }, []);


    const renderTimer = useCallback(({item}: { item: string }) => {
        return (
            <View style={styles.timerContainer}>
                <TimerText id={item}/>
                <TimerWheel id={item}/>
            </View>
        );
    }, []);

    return (
        <SafeAreaView style={[styles.container]}>
            <FlatList
                scrollEnabled={false}
                numColumns={2}
                data={timerIds}
                renderItem={renderTimer}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
            />
            <TouchableOpacity disabled={!isAllowedMore}
                              style={[styles.addButton, !isAllowedMore && styles.disabled]}
                              onPress={addTimer}>
                <Icon name="add" size={32} color="white"/>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(220,225,235, .7)',
    },
    listContent: {
        padding: paddingSize,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: paddingSize,
    },
    timerContainer: {
        width: clockWidth,
        padding: paddingSize,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    emptyState: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#d23b38',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    disabled: {
        backgroundColor: 'gray',
    }
});
