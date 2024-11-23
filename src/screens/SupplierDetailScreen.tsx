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
import { formatDate } from '../utils/date';
import { useCallback, useRef, useState } from 'react';

type SupplierDetailScreenProp = NativeStackScreenProps<
  MainStackParamList,
  'SupplierDetail'
>;

const confirmToSave = () => {
  Alert.alert('Confirmar', 'Deseja salvar as alterações feitas?', [
    {
      text: 'Cancelar',
      onPress: () => console.log('Cancelar'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => console.log('OK'),
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
      onPress: () => console.log('Delete'),
      style: 'destructive',
    },
  ]);
};

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
  route,
}: SupplierDetailScreenProp) {
  const supplierDetails = supplierCollection.filter(
    (supplier) => supplier.id == route.params.id
  )[0];

  const days = [
    {
      id: 0,
      name: 'Segunda-feira',
      selected: formatDate(supplierDetails.date).long == 'Segunda-feira',
    },
    {
      id: 1,
      name: 'Terça-feira',
      selected: formatDate(supplierDetails.date).long == 'Terça-feira',
    },
    {
      id: 2,
      name: 'Quarta-feira',
      selected: formatDate(supplierDetails.date).long == 'Quarta-feira',
    },
    {
      id: 3,
      name: 'Quinta-feira',
      selected: formatDate(supplierDetails.date).long == 'Quinta-feira',
    },
    {
      id: 4,
      name: 'Sexta-feira',
      selected: formatDate(supplierDetails.date).long == 'Sexta-feira',
    },
    {
      id: 5,
      name: 'Sábado',
      selected: formatDate(supplierDetails.date).long == 'Sábado',
    },
    {
      id: 6,
      name: 'Domingo',
      selected: formatDate(supplierDetails.date).long == 'Domingo',
    },
  ];

  const nameInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const weeksInputRef = useRef<TextInput>(null);
  const [nameIsHighlighted, setNameIsHighlighted] = useState<boolean>(false);
  const [phoneIsHighlighted, setPhoneIsHighlighted] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<boolean>(false);
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [fieldChaged, setFieldChanged] = useState<boolean>(false);

  const [deliveryDays, setDeliveryDays] = useState(days);

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
              defaultValue={supplierDetails.name}
              clearButtonMode="while-editing"
              textContentType="name"
              onFocus={() => setNameIsHighlighted(true)}
              onBlur={() => setNameIsHighlighted(false)}
              onChange={() => setFieldChanged(true)}
              ref={nameInputRef}
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
              defaultValue={supplierDetails.phone}
              clearButtonMode="while-editing"
              keyboardType="numbers-and-punctuation"
              textContentType="telephoneNumber"
              onFocus={() => setPhoneIsHighlighted(true)}
              onBlur={() => setPhoneIsHighlighted(false)}
              onChange={() => setFieldChanged(true)}
              ref={phoneInputRef}
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
                    onPress={() => toggleDay(day.id)}
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
                  setFieldChanged(true);
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
                  defaultValue="2"
                  keyboardType="number-pad"
                  clearTextOnFocus
                  onSubmitEditing={(e) => {
                    if (!(Number(e.nativeEvent.text) > 1)) setCustomDate(false);
                  }}
                  ref={weeksInputRef}
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
                borderColor:
                  !fieldChaged ||
                  deliveryDays.filter((day) => day.selected).length == 0
                    ? '#c0c0c0'
                    : '#07f',
                backgroundColor:
                  !fieldChaged ||
                  deliveryDays.filter((day) => day.selected).length == 0
                    ? '#c0c0c020'
                    : '#0077ff20',
              },
            ]}
            onPress={confirmToSave}
            disabled={
              !fieldChaged ||
              deliveryDays.filter((day) => day.selected).length == 0
            }
          >
            <Text style={styles.buttonText}>Salvar alterações</Text>
          </TouchableOpacity>
          {supplierDetails.id && (
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
