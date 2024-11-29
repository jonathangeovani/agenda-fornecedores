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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SupplierData, useSupplierDatabase } from '../db/useSupplierDatabase';
import { DAYS } from '../constants';
import { Checkbox } from '../components/checkbox';

type SupplierDetailScreenProp = NativeStackScreenProps<
  MainStackParamList,
  'SupplierDetail'
>;

export default function SupplierDetailScreen({
  route,
  navigation,
}: SupplierDetailScreenProp) {
  const suppliersDb = useSupplierDatabase();
  const [supplier, setSupplier] = useState<SupplierData>();

  const [weekDays, setWeekDays] = useState(
    DAYS.map((day, idx) => {
      return {
        id: idx,
        name: day,
        selected: supplier?.days.includes(day) || false,
      };
    })
  );

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryDays, setDeliveryDays] = useState(weekDays);
  const [isImportant, setIsImportant] = useState<boolean>(false);

  const [nameIsHighlighted, setNameIsHighlighted] = useState<boolean>(false);
  const [companyIsHighlighted, setCompanyIsHighlighted] =
    useState<boolean>(false);
  const [phoneIsHighlighted, setPhoneIsHighlighted] = useState<boolean>(false);

  const [fieldChaged, setFieldChanged] = useState<boolean>(false);
  const isInvalid = useMemo(() => {
    const emptyFields =
      (!name && !company) ||
      deliveryDays.filter((day) => day.selected).length == 0;

    return emptyFields || !fieldChaged;
  }, [name, company, phone, deliveryDays, isImportant]);

  const toggleDay = useCallback((id: number) => {
    setFieldChanged(true);
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

  const confirmToSave = () => {
    Alert.alert('Confirmar', `Salvar alterações em ${name}?`, [
      {
        text: 'Cancelar',
        onPress: () => getSupplier(),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          updateSupplier();
          navigation.goBack();
        },
        style: 'default',
      },
    ]);
  };

  const confirmToDelete = () => {
    Alert.alert('Atenção', 'Deseja apagar todos os dados do fornecedor?', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancelar'),
        style: 'cancel',
      },
      {
        text: 'Apagar',
        onPress: () => {
          suppliersDb.deleteSupplier(route.params.id);
          navigation.goBack();
        },
        style: 'destructive',
      },
    ]);
  };

  const getSupplier = async () => {
    const response = await suppliersDb.getSupplier(route.params.id);
    setSupplier(response);
    if (response) {
      setName(response.name);
      setCompany(response.company);
      setPhone(response.phone);
      setIsImportant(response.isImportant);
      setDeliveryDays((oldValue) =>
        oldValue.map((day) =>
          response.days.includes(day.name) ? { ...day, selected: true } : day
        )
      );
      setFieldChanged(false);
    }
  };

  const updateSupplier = async () => {
    const supplierDays = deliveryDays
      .filter((day) => day.selected)
      .map((days) => days.name);

    const supplierData = {
      id: route.params.id,
      name,
      company,
      phone,
      isImportant,
      days: supplierDays,
    };

    try {
      await suppliersDb.updateSupplier(supplierData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSupplier();

    return () => {};
  }, []);

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
                setName(text);
                setFieldChanged(true);
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
              placeholder="Nome da empresa"
              clearButtonMode="while-editing"
              textContentType="organizationName"
              onFocus={() => setCompanyIsHighlighted(true)}
              onBlur={() => setCompanyIsHighlighted(false)}
              onChange={(e) => {
                const text = e.nativeEvent.text;
                setCompany(text);
                setFieldChanged(true);
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
                setPhone(text);
                setFieldChanged(true);
                console.log(fieldChaged);
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
                    onPress={() => toggleDay(day.id)}
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
                  setFieldChanged(true);
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
            onPress={confirmToSave}
            disabled={isInvalid}
          >
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>
          {supplier?.id && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  borderColor: '#f04929',
                  backgroundColor: '#f0492920',
                },
              ]}
              onPress={confirmToDelete}
            >
              <Text style={styles.buttonText}>Apagar cadastro</Text>
            </TouchableOpacity>
          )}
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
