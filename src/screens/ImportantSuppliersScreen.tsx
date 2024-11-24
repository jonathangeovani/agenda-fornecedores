import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatDate, getWeekDays } from '../utils/date';
import { supplierCollection } from '../utils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../routes/MainStackParamList';

type ImportantSuppliersScreenProp = NativeStackScreenProps<MainStackParamList>;

export default function ImportantSuppliersScreen({
  navigation,
}: ImportantSuppliersScreenProp) {
  const weekDays = getWeekDays(new Date());
  const importantSuppliers = supplierCollection
    .filter(
      (supplier) =>
        supplier.isImportant && weekDays.includes(formatDate(supplier.date).str)
    )
    .sort((a, b) => {
      return formatDate(a.date).number > formatDate(b.date).number ? 1 : -1;
    });

  return (
    <ScrollView>
      <View style={styles.container}>
        {importantSuppliers.map((supplier) => {
          const supplierDayOffset = weekDays.indexOf(
            formatDate(supplier.date).str
          );
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
                {formatDate(supplier.date).long}
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
    paddingVertical: 10,
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
