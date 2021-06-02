import React, { FC, useCallback, useState } from 'react';
import { SearchBar } from 'react-native-elements';
import { FlatList, StyleSheet, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Text } from '../../global/style/Themed';
import useCamera from '../imageSearch/useCamera';
import useColorScheme from '../../hooks/useColorScheme';
import { Ingredient } from './TextSearchScreen';
import { Recipe } from '../RecipeScreen/RecipeScreen';

const styles = StyleSheet.create({
  searchbarContainer: {
    zIndex: 99,
    borderRadius: 25,
    height: 50,
    marginRight: 40,
    marginLeft: 40,
    marginTop: -55,
    paddingTop: 0,
    paddingLeft: 8,
    elevation: 4,
  },
  inputStyle: {
    height: 50,
    fontSize: 16,
    marginTop: -4,
    marginLeft: 10,
  },
  flatListContainer: {
    flex: 1,
    position: 'absolute',
    left: 60,
    right: 60,
    marginTop: 10,
    zIndex: 999,
    elevation: 8,
  },
  flatList: {
    padding: 12,
    fontSize: 16,
    zIndex: 99,
  },
});

export type ResultArray = {
  results: Ingredient[] | Recipe[];
};

type IngredientSearchBarProps = {
  handleAddToIngredients: (ingredient: Ingredient) => void;
};

const IngredientSearchBar: FC<IngredientSearchBarProps> = ({
  handleAddToIngredients,
}: IngredientSearchBarProps) => {
  const [ingredientSuggestions, setIngredientSuggestions] =
    useState<Ingredient[]>();
  const [query, setQuery] = useState<string>('');
  const { screenWidth } = useCamera();
  const colorscheme = useColorScheme();

  const updateQuery = (input: string) => {
    setQuery(input);
  };

  const fetchIngredients = useCallback(async () => {
    const response = await fetch(
      'https://phridge.herokuapp.com/api/autocomplete-ingredient',
      {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const { results }: ResultArray = await response.json();
    const suggestedIngredients: Ingredient[] = results as Ingredient[];
    setIngredientSuggestions(suggestedIngredients);
  }, [query]);

  const handleSuggestionPress = useCallback(
    (newIngredient: Ingredient) => {
      setQuery('');
      handleAddToIngredients(newIngredient);
    },
    [handleAddToIngredients],
  );

  return (
    <>
      <SearchBar
        onChangeText={updateQuery}
        onSubmitEditing={fetchIngredients}
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
        inputStyle={[
          styles.inputStyle,
          {
            color: Colors[colorscheme].lightGrey,
          },
        ]}
        searchIcon={
          <AntDesign
            name="search1"
            size={25}
            color={Colors[colorscheme].lightGrey}
          />
        }
      />
      <FlatList
        style={[
          styles.flatListContainer,
          {
            top: screenWidth / 1.5 - 10,
            width: screenWidth - 60 * 2,
            borderColor: Colors[colorscheme].backgroundDarker,
          },
        ]}
        data={query.length > 0 ? ingredientSuggestions : []}
        keyExtractor={(i: Ingredient) => i.id}
        extraData={query}
        renderItem={({ item }) => (
          <TouchableHighlight onPress={() => handleSuggestionPress(item)}>
            <Text
              style={[
                styles.flatList,
                {
                  backgroundColor:
                    colorscheme === 'dark'
                      ? Colors[colorscheme].normalGrey
                      : Colors[colorscheme].background,
                  color:
                    colorscheme === 'dark'
                      ? Colors[colorscheme].lightGrey
                      : Colors[colorscheme].normalGrey,
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableHighlight>
        )}
      />
    </>
  );
};

export default IngredientSearchBar;
