import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { supplierCollection } from '../utils';
import { formatDate } from '../utils/date';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../routes/MainStackParamList';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  subWeeks,
} from 'date-fns';

const getDayQtd = (day: number): number => {
  return supplierCollection.filter((supplier) => supplier.date.getDate() == day)
    .length;
};

const getWeekDays = (day: Date) => {
  const weekInterval = eachWeekOfInterval({
    start: subWeeks(day, 0),
    end: addWeeks(day, 0),
  });
  const weekDays = weekInterval.map((start) => {
    return eachDayOfInterval({ start, end: addDays(start, 6) })
      .map(formatDate)
      .map((date) => date.str);
  });
  return weekDays[0];
};

export default function AgendaCards() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const today = new Date();
  const todayDate = today.getDate();

  const todayQtd = getDayQtd(todayDate);
  const tomorowQtd = getDayQtd(todayDate + 1);
  const thisWeek = getWeekDays(today);
  const weekQtd = supplierCollection.filter((supplier) =>
    thisWeek.includes(formatDate(supplier.date).str)
  ).length;
  const todayIdx = thisWeek.indexOf(formatDate(today).str);
  const tomorowIdx = todayIdx + 1 < thisWeek.length ? todayIdx + 1 : 0;

  const cards = [
    {
      name: 'Hoje',
      qtd: todayQtd,
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048140.png',
      action: () =>
        navigation.navigate('Agenda', { weekOffset: 1, dayOffset: todayIdx }),
    },
    {
      name: 'Amanhã',
      qtd: tomorowQtd,
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/1028/1028157.png',
      action: () =>
        navigation.navigate('Agenda', {
          weekOffset: tomorowIdx ? 1 : 2,
          dayOffset: tomorowIdx,
        }),
    },
    {
      name: 'Semana',
      qtd: weekQtd,
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/694/694758.png',
      action: () => navigation.navigate('Agenda', { weekOffset: 1 }),
    },
    {
      name: 'Importantes',
      qtd: 0,
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/10308/10308557.png',
      action: () => console.log('SupplierListScreen'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: 600 }}>Entregas na semana</Text>
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
                  <Image width={40} height={40} source={{ uri: item.imgUrl }} />
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
