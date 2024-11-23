import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../routes/MainStackParamList';
import Header from '../components/header';
import AgendaCards from '../components/agendaCards';
import RegisterSection from '../components/registerSection';
import SearchInput from '../components/searchInput';

type HomeScreenProps = NativeStackScreenProps<MainStackParamList>;

export default function HomeScreen({ route, navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Agenda de Fornecedores" />
      <SearchInput />
      <AgendaCards />
      <RegisterSection />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
