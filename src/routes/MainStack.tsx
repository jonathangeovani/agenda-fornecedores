import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AgendaScreen from '../screens/AgendaScreen';
import { MainStackParamList } from './MainStackParamList';
import SupplierListScreen from '../screens/SupplierListScreen';
import SupplierDetailScreen from '../screens/SupplierDetailScreen';
import { Image } from 'react-native';

const MainStack = () => {
  const Stack = createNativeStackNavigator<MainStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Agenda" component={AgendaScreen} />
      <Stack.Screen
        name="SupplierList"
        component={SupplierListScreen}
        options={{ title: 'Fornecedores' }}
      />
      <Stack.Screen
        name="SupplierDetail"
        component={SupplierDetailScreen}
        options={{
          title: 'Detalhes do Fornecedor',
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
