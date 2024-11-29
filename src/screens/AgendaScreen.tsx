import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import AgendaList from '../components/agendaList';
import _ from 'lodash';
import { MainStackParamList } from '../routes/MainStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SupplierData, useSupplierDatabase } from '../db/useSupplierDatabase';
import { useEffect, useState } from 'react';
import { DAYS } from '../constants';

type AgendaScreenProps = NativeStackScreenProps<MainStackParamList, 'Agenda'>;

const ScheduleItem: React.FC<{ data: SupplierData }> = ({ data }) => {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`tel:${data.phone.replaceAll(/\D/g, '')}`)}
      style={itemStyles.container}
    >
      <View style={itemStyles.header}>
        <Text style={itemStyles.name}>{data.name}</Text>
        {data.isImportant && (
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/10308/10308557.png',
            }}
            width={15}
            height={15}
          />
        )}
      </View>
      <Text style={itemStyles.phone}>{data.phone}</Text>
    </TouchableOpacity>
  );
};

export default function AgendaScreen({ route, navigation }: AgendaScreenProps) {
  const supplierDb = useSupplierDatabase();
  const [suppliers, setSuppliers] = useState<SupplierData[]>();
  const data: Map<string, SupplierData[] | undefined> = new Map(
    DAYS.map((day) => {
      const daySuppliers = suppliers?.filter((supplier) =>
        supplier.days.includes(day)
      );
      if (daySuppliers && daySuppliers.length > 0) return [day, daySuppliers];
      else return ['', []];
    })
  );

  const getSuppliers = async () => {
    try {
      const response = await supplierDb.getAllSuppliers();
      setSuppliers(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const listener = navigation.addListener('focus', getSuppliers);

    return listener;
  }, [navigation]);

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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
