import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { MainStackParamList } from '../routes/MainStackParamList';

type Props = NativeStackScreenProps<MainStackParamList>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 600 }}>Home Screen</Text>
      <TouchableOpacity
        style={{
          padding: 8,
          borderColor: '#000',
          borderWidth: 1,
          borderRadius: 4,
        }}
        onPress={() => navigation.navigate('Agenda')}
      >
        <Text>Go to Agenda</Text>
      </TouchableOpacity>
    </View>
  );
}
