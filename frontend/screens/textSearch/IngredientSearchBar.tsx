import React, { FC, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { Text } from '../../global/style/Themed';
import useCamera from '../imageSearch/useCamera';
import useColorScheme from '../../hooks/useColorScheme';
import { IngredientSuggestion } from './TextSearchScreen';

const styles = StyleSheet.create({
  searchbarContainer: {
    zIndex: 3,
    borderRadius: 25,
    height: 50,
    paddingTop: 0,
    marginRight: 40,
    marginLeft: 40,
    marginTop: -55,
    padding: 0,
    elevation: 4,
  },
  flatList: {
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 20,
    borderBottomWidth: 1,
    marginLeft: 70,
    marginRight: 70,
  },
});

type ComponentType = {};

const IngredientSearchBar: FC = () => {
  const [ingredientSuggestions, setIngredientSuggestions] =
    useState<IngredientSuggestion[]>();
  const [query, setQuery] = useState<string>('');
  const { width } = useCamera();
  const colorscheme = useColorScheme();

  const updateQuery = (input: string) => {
    setQuery(input);
  };

  const fetchData = async () => {
    setIngredientSuggestions([
      {
        id: 2,
        name: 'eazqsfd',
      },
      {
        id: 3,
        name: 'eazqsdfqssdsfd',
      },
    ]);
  };

  return (
    <>
      <SearchBar
        onChangeText={updateQuery}
        onSubmitEditing={fetchData}
        value={query}
        placeholder="salmon, cabbage, carrot, ..."
        platform="android"
        containerStyle={[
          styles.searchbarContainer,
          {
            backgroundColor:
              colorscheme === 'dark' ? Colors[colorscheme].normalGrey : 'white',
          },
        ]}
        inputContainerStyle={{
          height: 50,
        }}
        inputStyle={{
          height: 50,
          color: Colors[colorscheme].lightGrey,
          marginLeft: 10,
        }}
      />
      <FlatList
        style={{
          borderColor: Colors[colorscheme].backgroundDarker,
          marginTop: 10,
        }}
        data={query.length > 0 ? ingredientSuggestions : []}
        keyExtractor={(i: IngredientSuggestion) => i.id.toString()}
        extraData={query}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setQuery(item.name)}>
            <Text
              style={[
                styles.flatList,
                {
                  backgroundColor: Colors[colorscheme].normalGrey,
                  color: Colors[colorscheme].lightGrey,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default IngredientSearchBar;
