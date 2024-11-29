import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getWeekDays } from '../utils/date';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../routes/MainStackParamList';
import { SupplierData, useSupplierDatabase } from '../db/useSupplierDatabase';
import { useEffect, useState } from 'react';

type ImportantSuppliersScreenProp = NativeStackScreenProps<MainStackParamList>;

export default function ImportantSuppliersScreen({
  navigation,
}: ImportantSuppliersScreenProp) {
  const suppliersDb = useSupplierDatabase();
  const [suppliers, setSuppliers] = useState<SupplierData[]>();
  const importantSuppliers = suppliers;

  const getImportantSuppliers = async () => {
    const response = await suppliersDb.getAllSuppliers(true);
    setSuppliers(response.filter((supplier) => supplier.isImportant));
  };

  useEffect(() => {
    getImportantSuppliers();

    return () => {};
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: '#fff',
      }}
    >
      <View style={styles.container}>
        {importantSuppliers?.map((supplier) => {
          const supplierDayOffset = 1;
          return (
            <TouchableOpacity
              key={supplier.id}
              style={styles.supplier}
              onPress={() =>
                navigation.navigate('Agenda', { dayOffset: supplierDayOffset })
              }
            >
              <Text style={[styles.text, styles.name]}>{supplier.name}</Text>
              <Text style={[styles.text, styles.company]}>
                {supplier.company}
              </Text>
              <Text style={[styles.text, styles.date]}>
                {supplier.days.join(', ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  supplier: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    gap: 5,
  },
  text: {},
  name: {
    fontSize: 20,
  },
  company: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
  },
});
