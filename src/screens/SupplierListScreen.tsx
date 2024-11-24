import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MainStackParamList } from '../routes/MainStackParamList';
import { supplierCollection } from '../utils';
import _ from 'lodash';
import SearchInput from '../components/searchInput';
import { useMemo, useRef, useState } from 'react';

type SupplierListScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'SupplierList'
>;

export default function SupplierListScreen({
  route,
  navigation,
}: SupplierListScreenProps) {
  const groupedSuppliers = useMemo(
    () => _.groupBy(supplierCollection, (supplier) => supplier.name[0]),
    [supplierCollection]
  );

  const scrollRef = useRef<ScrollView>(null);
  const [groupRef, setGroupRef] = useState<number[]>([]);
  const [supplierRef, setSupplierRef] = useState<{ name: string; y: number }[]>(
    []
  );

  const handleScroll = (text: string) => {
    if (!text || !text.trim()) return;
    const scrollToItem = supplierRef.filter((s) => s.name.includes(text))[0];
    const itemOffset = scrollToItem ? scrollToItem.y : 0;
    scrollRef.current?.scrollTo({
      y: itemOffset,
    });
  };

  return (
    <View style={styles.container}>
      <SearchInput
        submitAction={(e) => {
          const text = e.nativeEvent.text;
          handleScroll(text);
        }}
        defaultText={route.params.initialText}
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
