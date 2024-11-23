import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../routes/MainStackParamList';
import Header from '../components/header';
import AgendaCards from '../components/agendaCards';
import RegisterSection from '../components/registerSection';
import SearchInput from '../components/searchInput';

type HomeScreenProps = NativeStackScreenProps<MainStackParamList>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header title="Agenda de Fornecedores" />
        <SearchInput
          submitAction={(e) => {
            const text = e.nativeEvent.text;
            if (text)
              navigation.navigate('SupplierList', { initialText: text });
          }}
        />
        <AgendaCards />
        <RegisterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
