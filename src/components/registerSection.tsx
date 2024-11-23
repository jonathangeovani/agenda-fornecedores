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
          onPress={() => console.log('ResgiterSupplierScreen')}
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
                source={{
                  uri: 'https://cdn-icons-png.freepik.com/256/4315/4315609.png',
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                Adicionar novo
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.operationButton}
          onPress={() => console.log('SupplierListScreen')}
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
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/9385/9385289.png',
                }}
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
