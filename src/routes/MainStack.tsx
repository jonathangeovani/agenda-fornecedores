import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AgendaScreen from '../screens/AgendaScreen';
import { MainStackParamList } from './MainStackParamList';
import SupplierListScreen from '../screens/SupplierListScreen';

const MainStack = () => {
  const Stack = createNativeStackNavigator<MainStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Agenda">
        {(props) => <AgendaScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="SupplierList"
        component={SupplierListScreen}
        options={{ title: 'Fornecedores' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
