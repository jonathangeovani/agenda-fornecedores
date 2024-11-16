import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Agenda from './src/components/Agenda';
import { todoCollection } from './src/utils';

const data = todoCollection;

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#cc0800" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Agenda pastWeeks={2} futureWeeks={2} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
