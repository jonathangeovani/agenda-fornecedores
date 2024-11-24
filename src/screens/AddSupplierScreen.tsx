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
import { supplierCollection } from '../utils';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

type AddSupplierScreenProp = NativeStackScreenProps<MainStackParamList>;

type CheckboxProps = {
  day: string;
  checked: boolean;
  onPress: () => void;
};

const Checkbox = ({ day, checked, onPress }: CheckboxProps) => {
  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 5,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: checked ? '#0c0' : '#ccc',
        backgroundColor: checked ? '#00cc0012' : undefined,
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: checked ? 500 : 400,
        }}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
};

export default function SupplierDetailScreen({
  navigation,
}: AddSupplierScreenProp) {
  const [supplierDetails, setSupplierDetails] = useState({
    id: _.uniqueId(),
    name: '',
    company: '',
    phone: '',
    date: new Date(),
  });

  const days = [
    {
      id: 0,
      name: 'Segunda-feira',
      selected: false,
    },
    {
      id: 1,
      name: 'Terça-feira',
      selected: false,
    },
    {
      id: 2,
      name: 'Quarta-feira',
      selected: false,
    },
    {
      id: 3,
      name: 'Quinta-feira',
      selected: false,
    },
    {
      id: 4,
      name: 'Sexta-feira',
      selected: false,
    },
    {
      id: 5,
      name: 'Sábado',
      selected: false,
    },
    {
      id: 6,
      name: 'Domingo',
      selected: false,
    },
  ];

  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [week, setWeek] = useState<string>('2');

  const [nameIsHighlighted, setNameIsHighlighted] = useState<boolean>(false);
  const [companyIsHighlighted, setCompanyIsHighlighted] =
    useState<boolean>(false);
  const [phoneIsHighlighted, setPhoneIsHighlighted] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [deliveryDays, setDeliveryDays] = useState(days);
  const [isInvalid, setIsInvalid] = useState<boolean>(true);

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

  const infoSaved = () => {
    Alert.alert(name + ' adicionado!', '', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
        style: 'default',
      },
    ]);
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
                    day={day.name}
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
                Entrega toda semana:
              </Text>
              <Switch
                onChange={() => {
                  setCustomDate((oldValue) => !oldValue);
                }}
                value={!customDate}
              />
            </View>
            {customDate && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Text style={{ fontSize: 18 }}>Entrega a cada:</Text>
                <TextInput
                  style={{
                    fontSize: 20,
                    marginHorizontal: 8,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                  }}
                  keyboardType="number-pad"
                  clearTextOnFocus
                  onEndEditing={(e) => {
                    if (!(Number(e.nativeEvent.text) > 1)) setCustomDate(false);
                  }}
                  onChange={(e) => {
                    const num = e.nativeEvent.text;
                    setWeek(num);
                  }}
                  value={week}
                />
                <Text style={{ fontSize: 18 }}>semanas</Text>
              </View>
            )}
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
            onPress={infoSaved}
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
