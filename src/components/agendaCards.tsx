import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { formatDate, getWeekDaysFormated } from '../utils/date';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../routes/MainStackParamList';
import { SupplierData, useSupplierDatabase } from '../db/useSupplierDatabase';
import { useEffect, useState } from 'react';
import { addDays } from 'date-fns';

export default function AgendaCards() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const suppliersDb = useSupplierDatabase();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);

  const today = new Date();
  const todayDay = formatDate(today).long;
  const tomorowDay = formatDate(addDays(today, 1)).long;
  const todayQtd = suppliers.filter((supplier) =>
    supplier.days.includes(todayDay)
  ).length;
  const tomorowQtd = suppliers.filter((supplier) =>
    supplier.days.includes(tomorowDay)
  ).length;
  const thisWeek = getWeekDaysFormated(today);
  const importantQtd = suppliers.filter(
    (supplier) => supplier.isImportant && supplier.days.includes(todayDay)
  ).length;
  const todayIdx = thisWeek.indexOf(todayDay);
  const tomorowIdx = thisWeek.includes(tomorowDay) ? todayIdx + 1 : 0;

  const cards = [
    {
      name: 'Hoje',
      qtd: todayQtd,
      imgUrl: (
        <Image
          width={40}
          height={40}
          source={require('../../assets/icons/calendar.png')}
        />
      ),
      action: () => navigation.navigate('Agenda', { dayOffset: todayIdx }),
    },
    {
      name: 'Amanhã',
      qtd: tomorowQtd,
      imgUrl: (
        <Image
          width={40}
          height={40}
          source={require('../../assets/icons/calendar-schedule.png')}
        />
      ),
      action: () =>
        navigation.navigate('Agenda', {
          weekOffset: tomorowIdx ? 1 : 2,
          dayOffset: tomorowIdx,
        }),
    },
    {
      name: 'Entregas importantes hoje',
      qtd: importantQtd,
      imgUrl: (
        <Image
          width={40}
          height={40}
          source={require('../../assets/icons/calendar-star.png')}
        />
      ),
      action: () => navigation.navigate('ImportantSuppliers'),
    },
  ];

  async function getSuppliers() {
    try {
      const response = await suppliersDb.getAllSuppliers();
      setSuppliers(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const listener = navigation.addListener('focus', getSuppliers);

    return listener;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          Entregas na semana
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Agenda', {})}>
          <Text style={{ color: '#07f' }}>ver agenda</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardsWrapper}>
        {cards.map((item) => {
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.card}
              onPress={item.action}
            >
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {item.imgUrl}
                  <Text style={{ fontSize: 20, fontWeight: 600 }}>
                    {item.qtd}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: 500 }}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardsWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 15,
  },
  card: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 150,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});
