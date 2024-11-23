import { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  LayoutChangeEvent,
} from 'react-native';

type SearchInputProps = {
  submitAction: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  defaultText?: string;
};

export default function SearchInput({
  submitAction,
  defaultText,
}: SearchInputProps) {
  const searchInput = useRef<TextInput>(null);
  const [searchFocused, setSearchFocused] = useState<Boolean>(false);

  return (
    <View style={styles.searchWrapper}>
      <TextInput
        placeholder="Buscar"
        style={[
          styles.searchInput,
          { borderColor: searchFocused ? '#777' : '#e6e6e6', borderWidth: 1 },
        ]}
        autoCorrect={false}
        enterKeyHint="search"
        onBlur={() => setSearchFocused(false)}
        onFocus={() => setSearchFocused(true)}
        onSubmitEditing={submitAction}
        defaultValue={defaultText}
        ref={searchInput}
      />
      {searchInput.current?.isFocused() && (
        <TouchableOpacity
          onPress={() => {
            searchInput.current?.clear();
            searchInput.current?.blur();
          }}
        >
          <Image
            width={30}
            height={30}
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/106/106830.png',
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
  },
});
