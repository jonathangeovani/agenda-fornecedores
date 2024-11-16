import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Agenda from './src/components/Agenda';
import { todoCollection } from './src/utils';
import _ from 'lodash';
import { format } from 'date-fns';

const data = _.groupBy(todoCollection, (todo) =>
  format(todo.date, 'dd-MM-yyyy')
);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#cc0800" />
      <SafeAreaView edges={['top']} style={styles.container}>
        <Agenda
          pastWeeks={1}
          futureWeeks={1}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <ScheduleItem data={item} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const ScheduleItem: React.FC<{ data: (typeof todoCollection)[number] }> = ({
  data,
}) => {
  return (
    <View style={itemStyles.container}>
      <View style={itemStyles.header}>
        <Text style={itemStyles.title}>{data.title}</Text>
      </View>
      <Text style={itemStyles.description}>{data.description}</Text>
    </View>
  );
};

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
  title: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
  },
  description: {
    color: '#505050',
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
