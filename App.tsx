import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Agenda from './src/components/Agenda';
import { supplierCollection } from './src/utils';
import _ from 'lodash';
import { format } from 'date-fns';

const data = _.groupBy(supplierCollection, (supplier) =>
  format(supplier.date, 'dd-MM-yyyy')
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Agenda
          pastWeeks={1}
          futureWeeks={1}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <ScheduleItem data={item} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const ScheduleItem: React.FC<{ data: (typeof supplierCollection)[number] }> = ({
  data,
}) => {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`tel:${data.phone.replaceAll(/\D/g, '')}`)}
      style={itemStyles.container}
    >
      <View style={itemStyles.header}>
        <Text style={itemStyles.name}>{data.name}</Text>
      </View>
      <Text style={itemStyles.phone}>{data.phone}</Text>
    </TouchableOpacity>
  );
};

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 4,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 1,
  },
  header: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  name: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },
  phone: {
    color: '#505050',
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
