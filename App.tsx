import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from './src/db/initializeDatabase';
import MainStack from './src/routes/MainStack';

export default function App() {
  return (
    <SQLiteProvider databaseName="suppliers.db" onInit={initializeDatabase}>
      <View style={styles.container}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <SafeAreaView edges={['top']} style={{ flex: 1 }}>
            <NavigationContainer>
              <MainStack />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
