import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MainStackParamList } from '../routes/MainStackParamList';
import _ from 'lodash';
import SearchInput from '../components/searchInput';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SupplierData, useSupplierDatabase } from '../db/useSupplierDatabase';

type SupplierListScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SupplierList'
>;

export default function SupplierListScreen({
  route,
  navigation,
}: SupplierListScreenProps) {
  const suppliersDb = useSupplierDatabase();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);

  const groupedSuppliers = useMemo(
    () => _.groupBy(suppliers, (supplier) => supplier.name[0]),
    [suppliers]
  );

  const [search, setSearch] = useState(route.params.initialText || '');
  const scrollRef = useRef<ScrollView>(null);
  const [groupRef, setGroupRef] = useState<number[]>([]);
  const [supplierRef, setSupplierRef] = useState<
    { name: string; company: string; y: number }[]
  >([]);

  const handleScroll = (text: string) => {
    if (!text || !text.trim()) return;
    const scrollToItem = supplierRef.filter(
      (s) => s.name.includes(text) || s.company.includes(text)
    )[0];
    const itemOffset = scrollToItem ? scrollToItem.y : 0;
    scrollRef.current?.scrollTo({
      y: itemOffset,
    });
  };

  const searchSuppliers = async () => {
    try {
      const response = await suppliersDb.searchSuppliers(search);
      if (response) setSuppliers(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return navigation.addListener('focus', searchSuppliers);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SearchInput
        onChange={(e) => {
          const text = e.nativeEvent.text;
          setSearch(text);
        }}
        value={search}
        submitAction={() => searchSuppliers()}
      />
      <ScrollView ref={scrollRef}>
        {Object.keys(groupedSuppliers).map((letter, idx) => {
          return (
            <View
              key={letter}
              style={styles.supplierGroup}
              onLayout={(e) => {
                groupRef[idx] = e.nativeEvent.layout.y;
                setGroupRef(groupRef);
              }}
            >
              <Text style={styles.supplierGroupTitle}>{letter}</Text>
              {groupedSuppliers[letter].map((supplier) => {
                return (
                  <TouchableOpacity
                    key={supplier.id}
                    style={styles.supplier}
                    onLayout={(e) => {
                      const layout = e.nativeEvent.layout;
                      supplierRef.push({
                        name: supplier.name,
                        company: supplier.company,
                        y: groupRef[idx] + layout.y,
                      });
                      setSupplierRef(supplierRef);
                    }}
                    onPress={() => {
                      navigation.navigate('SupplierDetail', {
                        id: supplier.id,
                      });
                    }}
                  >
                    <Text style={styles.supplierName}>{supplier.name}</Text>
                    <Text style={styles.supplierCompany}>
                      {supplier.company}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      <View
        onLayout={() => {
          if (route.params.initialText) {
            const text = route.params.initialText;
            handleScroll(text);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  supplierGroup: {
    paddingHorizontal: 20,
  },
  supplierGroupTitle: {
    fontSize: 16,
    fontWeight: 600,
    paddingTop: 20,
  },
  supplier: {
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  supplierName: {
    fontSize: 20,
  },
  supplierCompany: {
    paddingTop: 4,
    color: '#7b7b7b',
    fontSize: 14,
  },
});
