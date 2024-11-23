import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AgendaList from '../components/agendaList';
import { format } from 'date-fns';
import _ from 'lodash';
import { supplierCollection } from '../utils';
import { MainStackParamList } from '../routes/MainStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AgendaScreenProps = NativeStackScreenProps<MainStackParamList, 'Agenda'>;

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

export default function AgendaScreen({ route, navigation }: AgendaScreenProps) {
  const data = _.groupBy(supplierCollection, (supplier) =>
    format(supplier.date, 'dd-MM-yyyy')
  );

  return (
    <AgendaList
      pastWeeks={1}
      futureWeeks={1}
      weekOffset={route.params?.weekOffset}
      dayOffset={route.params?.dayOffset}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <ScheduleItem data={item} />}
    />
  );
}

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
