import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IHeaderProps {
  title?: string;
}

export default function Header({ title }: IHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ? title : 'Agenda+'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
  },
});
