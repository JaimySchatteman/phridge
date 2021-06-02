import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { FC, useCallback, useEffect, useState } from 'react';
import { Button, SwipeAction, Toast } from '@ant-design/react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { NavigationScreenComponent } from 'react-navigation';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import ImageBannerBackground from './ImageBannerBackground';
import Colors from '../../constants/Colors';
import IngredientSearchBar, { ResultArray } from './IngredientSearchBar';
import useCamera from '../imageSearch/useCamera';
import { Recipe } from '../RecipeScreen/RecipeScreen';
import ingredientBackground from '../../assets/images/ingredients.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomHalfContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -30,
    zIndex: 9,
  },
  scrollView: {
    paddingTop: 65,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 25,
  },
  swipeAction: {
    borderRadius: 12,
    height: 66,
    elevation: 6,
    marginBottom: 18,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  listItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 66,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    borderRadius: 25,
    zIndex: 998,
  },
  buttonSearchRecipes: {
    borderRadius: 25,
    height: 50,
    zIndex: 999,
    borderWidth: 2,
    elevation: 6,
  },
});

export interface Ingredient {
  id: string;
  name: string;
  isChecked?: boolean;
  accuracy?: number;
}

export type TextSearchScreenParams = {
  extractedIngredients?: Ingredient[];
};

const TextSearchScreen: NavigationScreenComponent<FC, TextSearchScreenParams> =
  ({ route }) => {
    const [isAfterImageSearch, setAfterImageSearch] = useState<boolean>();
    const [ingredients, setIngredients] = useState<Ingredient[] | undefined>([
      {
        id: 'qsdfqs',
        name: 'cucumber',
      },
      {
        id: 'carrot',
        name: 'carrot',
      },
      {
        id: 'qsdfqsdqs',
        name: 'tomato',
      },
    ]);
    const colorscheme = useColorScheme();
    const { screenWidth, screenHeight } = useCamera();
    const navigation = useNavigation();

    useEffect(() => {
      if (route.params && route.params.extractedIngredients) {
        const { extractedIngredients }: TextSearchScreenParams = route.params;
        setAfterImageSearch(true);
        setIngredients(extractedIngredients);
      } else {
        setAfterImageSearch(false);
      }
    }, [route.params]);

    const handleAddToIngredients = useCallback(
      (ingredient: Ingredient): void => {
        if (ingredients) {
          const inIngredients = ingredients.some(({ name }: Ingredient) => {
            return name === ingredient.name;
          });
          if (inIngredients) return;
          const newIngredients = [ingredient, ...ingredients];
          setIngredients(newIngredients);
        } else {
          setIngredients([ingredient]);
        }
        Toast.success('Added ingredient', 0.5);
      },
      [ingredients],
    );

    const toggleCheckIngredient = useCallback(
      (idToToggle: string): void => {
        if (ingredients && ingredients?.length > 0) {
          const currentIngredients: Ingredient[] = [...ingredients];
          const ingredientToToggleIndex: number | undefined =
            currentIngredients.findIndex(({ id }: Ingredient) => {
              return idToToggle === id;
            });
          if (ingredientToToggleIndex !== undefined) {
            currentIngredients[ingredientToToggleIndex].isChecked =
              !currentIngredients[ingredientToToggleIndex].isChecked;
            setIngredients(currentIngredients);
          }
        }
      },
      [ingredients],
    );

    const removeIngredient = useCallback(
      (idToRemove: string): void => {
        if (ingredients) {
          const currentIngredients: Ingredient[] = [...ingredients];
          const newIngredients = currentIngredients.filter(
            ({ id }: Ingredient) => {
              return idToRemove !== id;
            },
          );
          setIngredients(newIngredients);
        }
      },
      [ingredients],
    );

    const checkIfIngredientsAreChecked = useCallback((): boolean => {
      if (ingredients) {
        return ingredients.some(({ isChecked }: Ingredient) => {
          return isChecked;
        });
      }
      return false;
    }, [ingredients]);

    const searchRecipes = useCallback(async () => {
      if (ingredients) {
        let checkedIngredientNames: string[] = [];
        ingredients.forEach(({ name, isChecked }: Ingredient) => {
          if (isChecked) {
            checkedIngredientNames = [...checkedIngredientNames, name];
          }
        });
        const response = await fetch(
          'https://phridge.herokuapp.com/api/search-recipes',
          {
            method: 'POST',
            body: JSON.stringify({ ingredients: checkedIngredientNames }),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const { results }: ResultArray = await response.json();
        const foundRecipes: Recipe[] = results as Recipe[];
        navigation.navigate('Root', {
          screen: isAfterImageSearch ? 'ImageSearch' : 'TextSearch',
          params: {
            screen: 'ViewRecipes',
            params: {
              foundRecipes,
            },
          },
        });
      }
    }, [ingredients, isAfterImageSearch, navigation]);

    return (
      <View style={styles.container}>
        <ImageBannerBackground
          displayBackButton={isAfterImageSearch}
          image={ingredientBackground}
          headerText={
            isAfterImageSearch ? 'Select or remove' : 'Add the ingredients'
          }
          subText={
            isAfterImageSearch
              ? 'the ingredients you want to include'
              : ' you want to include in the search'
          }
        />
        <IngredientSearchBar handleAddToIngredients={handleAddToIngredients} />
        <View
          style={[
            styles.bottomHalfContainer,
            {
              backgroundColor:
                colorscheme === 'dark'
                  ? Colors[colorscheme].backgroundDarker
                  : Colors[colorscheme].veryLightGrey,
              height: screenHeight - screenWidth / 1.5 + 5,
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 160 }}
            style={styles.scrollView}
          >
            {ingredients && ingredients.length > 0 ? (
              ingredients.map(
                ({ id, name, accuracy, isChecked }: Ingredient) => {
                  return (
                    <SwipeAction
                      key={id}
                      autoClose
                      style={[
                        styles.swipeAction,
                        {
                          backgroundColor:
                            colorscheme === 'dark'
                              ? Colors.light.normalGrey
                              : Colors.light.background,
                        },
                      ]}
                      right={[
                        {
                          text: (
                            <Feather name="trash-2" size={24} color="white" />
                          ),
                          onPress: () => removeIngredient(id),
                          style: { backgroundColor: 'red' },
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.listItem,
                          {
                            backgroundColor:
                              colorscheme === 'dark'
                                ? Colors.light.normalGrey
                                : Colors.light.background,
                            height: 66,
                          },
                        ]}
                      >
                        <BouncyCheckbox
                          size={32}
                          style={{ marginLeft: 15 }}
                          isChecked={isChecked}
                          fillColor={Colors.light.text}
                          iconStyle={{ borderColor: Colors.light.text }}
                          onPress={() => {
                            toggleCheckIngredient(id);
                          }}
                        />
                        <View
                          style={[
                            styles.listItemContent,
                            {
                              backgroundColor:
                                colorscheme === 'dark'
                                  ? Colors.light.normalGrey
                                  : Colors.light.background,
                            },
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              color:
                                colorscheme === 'dark'
                                  ? Colors.light.background
                                  : Colors.dark.backgroundDarker,
                              padding: 12,
                              marginTop: 4,
                              fontSize: 22,
                            }}
                          >
                            {name[0].toUpperCase() + name.slice(1, name.length)}
                          </Text>

                          {accuracy && (
                            <Text
                              style={{
                                color:
                                  colorscheme === 'dark'
                                    ? Colors.light.lightGrey
                                    : Colors.dark.backgroundDarker,
                                padding: 12,
                                marginTop: 12,
                                marginRight: 15,
                                fontSize: 12,
                              }}
                            >
                              {Math.round(accuracy)}% certain
                            </Text>
                          )}
                        </View>
                      </View>
                    </SwipeAction>
                  );
                },
              )
            ) : (
              <>
                <Text
                  style={{
                    color:
                      colorscheme === 'dark'
                        ? Colors.light.background
                        : Colors.dark.backgroundDarker,
                    marginTop: 24,
                    textAlign: 'center',
                    fontSize: 24,
                  }}
                >
                  Nothing to show
                </Text>
                <Text
                  style={{
                    color:
                      colorscheme === 'dark'
                        ? Colors.light.lightGrey
                        : Colors.dark.backgroundDarker,
                    textAlign: 'center',
                  }}
                >
                  Please add ingredients
                </Text>
              </>
            )}
          </ScrollView>
        </View>
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: Colors.light.tint,
              borderColor: Colors.light.tint,
            },
          ]}
        >
          <Button
            type="primary"
            disabled={!checkIfIngredientsAreChecked()}
            style={[
              styles.buttonSearchRecipes,
              {
                backgroundColor: Colors.light.tint,
                borderColor: Colors.light.text,
              },
            ]}
            activeStyle={{
              backgroundColor: Colors.light.text,
            }}
            onPress={() => {
              searchRecipes();
            }}
          >
            Search Recipes
          </Button>
        </View>
      </View>
    );
  };
export default TextSearchScreen;
