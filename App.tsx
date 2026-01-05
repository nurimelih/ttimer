import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppNavigator} from './src/navigation/AppNavigator';

function App() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <AppNavigator />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});

export default App;
