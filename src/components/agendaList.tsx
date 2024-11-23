import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { formatDate } from '../utils/date';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  subWeeks,
} from 'date-fns';

interface IAgendaProps<DataItem extends any> {
  pastWeeks?: number;
  futureWeeks?: number;
  data: Record<string, DataItem[]>;
  keyExtractor: (item: DataItem) => any;
  renderItem(item: DataItem): JSX.Element;
  weekOffset?: number;
  dayOffset?: number;
}

export default function AgendaList<DataItem>({
  pastWeeks = 1,
  futureWeeks = 1,
  weekOffset = 1,
  dayOffset = 0,
  ...props
}: IAgendaProps<DataItem>) {
  const [calendarWidth, setCalendarWidth] = useState<number>(0);
  const [agendaListWidth, setAgendaListWidth] = useState<number>(0);

  const calendarRef = useRef<ScrollView>(null);
  const agendaRef = useRef<ScrollView>(null);
  const [weekRef, setWeekRef] = useState<ScrollView[]>([]);

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

  const highlightedDays = useMemo(() => Object.keys(props.data), [props.data]);
  const [agendaDaysOffset, setAgendaDaysOffset] = useState<number[][]>([
    [],
    [],
    [],
  ]);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendar}>
        <View>
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
                {calendarWeek.map((day) => {
                  const isHighlighted = highlightedDays.includes(day.str);
                  const color = isHighlighted ? '#000' : '#909090';
                  const fontWeight = isHighlighted ? 600 : 400;

                  return (
                    <View key={day.str} style={styles.dayContainer}>
                      <Text style={{ color, fontWeight }}>{day.short}</Text>
                      <Text style={{ color, fontWeight }}>{day.number}</Text>
                    </View>
                  );
                })}
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
            scrollControll.current.isAgendaScrolling = true;
            scrollControll.current.isCalendarScrolling = false;
            agendaRef.current?.scrollTo({
              x: agendaListWidth * weekOffset,
            });
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
                ref={(ref) => {
                  if (ref) {
                    weekRef[weekIdx] = ref;
                    setWeekRef(weekRef);
                  }
                }}
                onLayout={() => {
                  weekRef[weekOffset].scrollTo({
                    y: agendaDaysOffset[weekOffset][dayOffset],
                  });
                }}
              >
                {agendaWeek.map((day, dayIdx) => {
                  const isHighlighted = highlightedDays.includes(day.str);
                  const backgroundColor = isHighlighted ? '#f7f7ff' : '#fff';
                  return (
                    <View
                      key={day.str}
                      style={agendaStyles.dayWrapper}
                      onLayout={(e) => {
                        agendaDaysOffset[weekIdx][dayIdx] =
                          e.nativeEvent.layout.y;
                        setAgendaDaysOffset(agendaDaysOffset);
                      }}
                    >
                      <View style={agendaStyles.dayIdentifier}>
                        <Text style={agendaStyles.dayShort}>{day.short}</Text>
                        <Text style={agendaStyles.dayNumber}>{day.number}</Text>
                      </View>
                      <View
                        style={[
                          agendaStyles.dayContentWrapper,
                          { backgroundColor },
                        ]}
                      >
                        <View style={agendaStyles.dayContent}>
                          {props.data[day.str] &&
                            props.data[day.str].map((item) => {
                              const ScheduleItem = () => props.renderItem(item);
                              return (
                                <ScheduleItem key={props.keyExtractor(item)} />
                              );
                            })}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  calendar: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  calendarScrollable: {
    flexDirection: 'row',
  },
  weekWrapper: {
    flexDirection: 'row',
  },
  dayContainer: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

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
    paddingRight: 8,
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
  },
  dayIdentifier: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 8,
    alignItems: 'center',
    borderRightColor: '#c0c0c0',
    borderRightWidth: 1,
  },
  dayShort: {
    fontWeight: 500,
  },
  dayNumber: {
    fontSize: 24,
  },
  dayContentWrapper: {
    flex: 6,
    marginLeft: 8,
    padding: 8,
    paddingLeft: 0,
    backgroundColor: '#f7f7ff',
    borderRadius: 8,
  },
  dayContent: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 8,
    justifyContent: 'center',
  },
});
