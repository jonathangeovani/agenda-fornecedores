import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  subWeeks,
} from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface IAgendaProps {
  pastWeeks?: number;
  futureWeeks?: number;
}

interface AgendaDayObject {
  date: Date;
  str: string;
  short: string;
  number: string;
}

const formatDate = (date: Date): AgendaDayObject => ({
  date: date,
  str: format(date, 'dd-MM-yyyy'),
  short: format(date, 'ccc'),
  number: format(date, 'dd'),
});

export default function Agenda({
  pastWeeks = 1,
  futureWeeks = 1,
}: IAgendaProps) {
  const [calendarWidth, setCalendarWidth] = useState<number>(0);
  const [agendaListWidth, setAgendaListWidth] = useState<number>(0);

  const calendarRef = useRef<ScrollView>(null);
  const agendaRef = useRef<ScrollView>(null);
  const scrollControll = useRef({
    isCalendarScrolling: false,
    isAgendaScrolling: false,
  });

  const allWeeks = useMemo(() => {
    const today = new Date();
    const firstWeek = subWeeks(today, pastWeeks);
    const lastWeek = addWeeks(today, futureWeeks);

    const weeks = eachWeekOfInterval({ start: firstWeek, end: lastWeek }).map(
      (start) =>
        eachDayOfInterval({ start, end: addDays(start, 6) }).map(formatDate)
    );

    return weeks;
  }, [pastWeeks, futureWeeks]);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendar}>
        <View style={styles.calendarScrollContainer}>
          <ScrollView
            style={styles.calendarScrollable}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            onLayout={(e) => {
              setCalendarWidth(e.nativeEvent.layout.width);
            }}
            onScrollBeginDrag={() => {
              // Only one scroll element should be controlling the movement
              scrollControll.current.isCalendarScrolling = true;
              scrollControll.current.isAgendaScrolling = false;
            }}
            onScroll={(e) => {
              if (scrollControll.current.isAgendaScrolling) return;
              const offsetX = e.nativeEvent.contentOffset.x;
              const relativeOffset = offsetX / calendarWidth;
              const agendaOffsetX = agendaListWidth * relativeOffset;
              agendaRef.current?.scrollTo({
                x: agendaOffsetX,
                animated: false,
              });
            }}
            ref={calendarRef}
          >
            {allWeeks.map((calendarWeek, idx) => (
              <View
                key={idx}
                style={[styles.weekWrapper, { width: calendarWidth }]}
              >
                {calendarWeek.map((day) => (
                  <View key={day.str} style={styles.dayContainer}>
                    <Text style={styles.dayShort}>{day.short}</Text>
                    <Text style={styles.dayNumber}>{day.number}</Text>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      {/* Agenda List */}
      <View style={agendaStyles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => {
            setAgendaListWidth(e.nativeEvent.layout.width);
          }}
          onScrollBeginDrag={() => {
            // Only one scroll element should be controlling the movement
            scrollControll.current.isAgendaScrolling = true;
            scrollControll.current.isCalendarScrolling = false;
          }}
          onScroll={(e) => {
            if (scrollControll.current.isCalendarScrolling) return;
            const offsetX = e.nativeEvent.contentOffset.x;
            const relativeOffset = offsetX / agendaListWidth;
            const calendarOffsetX = calendarWidth * relativeOffset;
            calendarRef.current?.scrollTo({
              x: calendarOffsetX,
              animated: false,
            });
          }}
          ref={agendaRef}
        >
          {allWeeks.map((agendaWeek, weekIdx) => (
            <View
              key={weekIdx}
              style={[agendaStyles.weekWrapper, { width: agendaListWidth }]}
            >
              <ScrollView
                style={agendaStyles.weekScrollable}
                showsHorizontalScrollIndicator={false}
              >
                {agendaWeek.map((day, dayIdx) => (
                  <View key={dayIdx} style={agendaStyles.dayWrapper}>
                    <View style={agendaStyles.dayIdentifier}>
                      <Text style={agendaStyles.dayShort}>{day.short}</Text>
                      <Text style={agendaStyles.dayNumber}>{day.number}</Text>
                    </View>
                    <View style={agendaStyles.dayContent}>
                      <Text>content</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const agendaStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekScrollable: {
    flex: 1,
  },
  weekWrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dayWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  dayIdentifier: {
    flex: 1,
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayContent: {
    flex: 5,
    padding: 8,
    borderLeftColor: '#c0c0c0',
    borderLeftWidth: 1,
    justifyContent: 'center',
  },
  dayShort: {},
  dayNumber: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  calendar: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  calendarScrollContainer: {},
  calendarScrollable: {
    flexDirection: 'row',
  },
  weekWrapper: {
    flexDirection: 'row',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayShort: {},
  dayNumber: {},
});
