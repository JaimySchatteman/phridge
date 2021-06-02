import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { FC, useCallback, useEffect, useState } from 'react';
import { Button, SwipeAction } from '@ant-design/react-native';
import { AntDesign } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { NavigationScreenComponent } from 'react-navigation';
import { Text, View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import IngredientBackground from './IngredientBackground';
import Colors from '../../constants/Colors';
import IngredientSearchBar from './IngredientSearchBar';
import useCamera from '../imageSearch/useCamera';

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
    borderRadius: 5,
  },
  swipeAction: {
    borderRadius: 12,
    height: 66,
    elevation: 6,
    marginBottom: 10,
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
    const [ingredients, setIngredients] = useState<Ingredient[] | undefined>();
    const colorscheme = useColorScheme();
    const { screenWidth, screenHeight } = useCamera();

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
        console.log(ingredient);
        if (ingredients) {
          const newIngredients = [ingredient, ...ingredients];
          return setIngredients(newIngredients);
        }
        return setIngredients([ingredient]);
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

    return (
      <View style={styles.container}>
        <IngredientBackground afterImageSearch={isAfterImageSearch} />
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
                            <AntDesign name="delete" size={22} color="white" />
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
              console.log('qsdfqsdf');
            }}
          >
            Search Recipes
          </Button>
        </View>
      </View>
    );
  };
export default TextSearchScreen;
