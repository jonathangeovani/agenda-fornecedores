import { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TextInputProps,
} from 'react-native';

type SearchInputProps = TextInputProps & {
  submitAction?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
};

export default function SearchInput({
  submitAction,
  ...props
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
        clearButtonMode="while-editing"
        clearTextOnFocus
        {...props}
        ref={searchInput}
      />
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
