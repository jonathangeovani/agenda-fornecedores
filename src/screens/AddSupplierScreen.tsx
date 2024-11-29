import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
} from 'react-native';
import { MainStackParamList } from '../routes/MainStackParamList';
import { useCallback, useEffect, useState } from 'react';
import { useSupplierDatabase } from '../db/useSupplierDatabase';
import { DAYS } from '../constants';
import { Checkbox } from '../components/checkbox';

type AddSupplierScreenProp = NativeStackScreenProps<MainStackParamList>;

export default function SupplierDetailScreen({
  navigation,
}: AddSupplierScreenProp) {
  const [supplierDetails, setSupplierDetails] = useState({
    name: '',
    company: '',
    phone: '',
    isImportant: false,
    days: [],
  });

  const weekDays = DAYS.map((day, idx) => {
    return { id: idx, name: day, selected: false };
  });

  const suppliersDb = useSupplierDatabase();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDays, setDeliveryDays] = useState(weekDays);

  const [nameIsHighlighted, setNameIsHighlighted] = useState(false);
  const [companyIsHighlighted, setCompanyIsHighlighted] = useState(false);
  const [phoneIsHighlighted, setPhoneIsHighlighted] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  const toggleDay = useCallback((id: number) => {
    setDeliveryDays((prevDeliveryDays) => {
      return prevDeliveryDays.map((day) => {
        if (day.id == id) {
          return {
            ...day,
            selected: !day.selected,
          };
        }
        return day;
      });
    });
  }, []);

  const addNewSupplier = async () => {
    try {
      const supplierDays = deliveryDays
        .filter((day) => day.selected)
        .map((days) => days.name);

      const supplierData = {
        name,
        company,
        phone,
        isImportant,
        days: supplierDays,
      };

      await suppliersDb.addSupplier(supplierData);

      Alert.alert('Sucesso', `Fornecedor ${name} adicionado com sucesso!`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Erro',
        `Não foi possível adicionar o fornecedor!\nErro: ${error}`,
        [
          {
            text: 'Tentar novamente',
            style: 'default',
          },
        ]
      );
    }
  };

  useEffect(() => {
    const emptyFields =
      (!supplierDetails.name && !supplierDetails.company) ||
      deliveryDays.filter((day) => day.selected).length == 0;
    setIsInvalid(emptyFields);
  }, [name, company, deliveryDays]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View style={styles.infoWrapper}>
            <Text>Nome:</Text>
            <TextInput
              style={[
                styles.supplierInfo,
                styles.textInput,
                {
                  borderBottomColor: nameIsHighlighted ? '#777' : '#ccc',
                },
              ]}
              placeholder="Nome"
              clearButtonMode="while-editing"
              textContentType="name"
              onFocus={() => setNameIsHighlighted(true)}
              onBlur={() => setNameIsHighlighted(false)}
              onChange={(e) => {
                const text = e.nativeEvent.text;
                supplierDetails.name = text;
                setSupplierDetails(supplierDetails);
                setName(text);
              }}
              value={name}
            />
          </View>
          <View style={styles.infoWrapper}>
            <Text>Empresa:</Text>
            <TextInput
              style={[
                styles.supplierInfo,
                styles.textInput,
                {
                  borderBottomColor: companyIsHighlighted ? '#777' : '#ccc',
                },
              ]}
              placeholder="Nome"
              clearButtonMode="while-editing"
              textContentType="organizationName"
              onFocus={() => setCompanyIsHighlighted(true)}
              onBlur={() => setCompanyIsHighlighted(false)}
              onChange={(e) => {
                const text = e.nativeEvent.text;
                supplierDetails.company = text;
                setSupplierDetails(supplierDetails);
                setCompany(text);
              }}
              value={company}
            />
          </View>
          <View style={styles.infoWrapper}>
            <Text>Telefone:</Text>
            <TextInput
              style={[
                styles.supplierInfo,
                styles.textInput,
                {
                  borderBottomColor: phoneIsHighlighted ? '#777' : '#ccc',
                },
              ]}
              placeholder="Telefone"
              clearButtonMode="while-editing"
              keyboardType="numbers-and-punctuation"
              textContentType="telephoneNumber"
              onFocus={() => setPhoneIsHighlighted(true)}
              onBlur={() => setPhoneIsHighlighted(false)}
              onChange={(e) => {
                const text = e.nativeEvent.text;
                supplierDetails.phone = text;
                setSupplierDetails(supplierDetails);
                setPhone(text);
              }}
              value={phone}
            />
          </View>
          <View style={styles.infoWrapper}>
            <Text>Dias de entrega:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {deliveryDays.map((day) => {
                return (
                  <Checkbox
                    key={day.id}
                    text={day.name}
                    checked={day.selected}
                    onPress={() => {
                      toggleDay(day.id);
                    }}
                  />
                );
              })}
            </ScrollView>
            <View style={styles.switchWrapper}>
              <Text style={{ flex: 1, fontSize: 18 }}>
                Marcar como importante:
              </Text>
              <Switch
                onChange={() => {
                  setIsImportant((oldValue) => !oldValue);
                }}
                value={isImportant}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: isInvalid ? '#c0c0c0' : '#07f',
                backgroundColor: isInvalid ? '#c0c0c020' : '#0077ff20',
              },
            ]}
            onPress={addNewSupplier}
            disabled={isInvalid}
          >
            <Text style={styles.buttonText}>Adicionar novo fornecedor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  infoWrapper: {
    marginBottom: 10,
  },
  supplierInfo: {
    marginVertical: 4,
    padding: 4,
    fontSize: 20,
  },
  textInput: {
    borderBottomWidth: 1,
  },
  switchWrapper: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    marginTop: 30,
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
  },
});
