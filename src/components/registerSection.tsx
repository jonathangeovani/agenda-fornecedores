import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../routes/MainStackParamList';

export default function RegisterSection() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 600, paddingBottom: 15 }}>
        Fornecedores
      </Text>
      <View style={styles.operationButtonsWrapper}>
        <TouchableOpacity
          style={styles.operationButton}
          onPress={() => navigation.navigate('AddSupplier')}
        >
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Image
                width={24}
                height={24}
                source={require('../../assets/icons/add.png')}
              />
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                Adicionar novo
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.operationButton}
          onPress={() => navigation.navigate('SupplierList', {})}
        >
          <View style={{ gap: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Image
                width={24}
                height={24}
                source={require('../../assets/icons/user.png')}
              />
              <Text style={{ fontSize: 16, fontWeight: 500 }}>Ver todos</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  operationButtonsWrapper: {
    flex: 1,
    gap: 10,
  },
  operationButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});
