import { Text, TouchableOpacity } from 'react-native';

type CheckboxProps = {
  text: string;
  checked: boolean;
  onPress: () => void;
};

export function Checkbox({ text, checked, onPress }: CheckboxProps) {
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
        {text}
      </Text>
    </TouchableOpacity>
  );
}
