import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/routes/MainStack';

export default function App() {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6ff',
  },
});
