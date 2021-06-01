import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { FC, useCallback, useState } from 'react';
import { Button, SwipeAction } from '@ant-design/react-native';
import { AntDesign } from '@expo/vector-icons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { NavigationScreenComponent } from 'react-navigation';
import { Text, View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import IngredientBackground from './IngredientBackground';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import IngredientSearchBar from './IngredientSearchBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomHalfContainer: {
    height: '100%',
    borderRadius: 25,
    marginTop: -30,
    zIndex: 9,
  },
});

export interface IngredientSuggestion {
  id: number;
  name: string;
  isChecked?: boolean;
}

export interface IngredientPrediction extends IngredientSuggestion {
  accuracy: number;
}

export type TextSearchScreenParams = {
  afterImageSearch: boolean;
  extractedIngredients: IngredientPrediction[];
};

const TextSearchScreen: NavigationScreenComponent<FC, TextSearchScreenParams> =
  ({ route, navigation }) => {
    const { afterImageSearch, extractedIngredients }: TextSearchScreenParams =
      route.params;
    const [ingredients, setIngredients] =
      useState<IngredientPrediction[] | undefined>();
    const colorscheme = useColorScheme();

    console.log(extractedIngredients);

    const toggleCheckIngredient = useCallback(
      (idToToggle: number) => {
        console.log(idToToggle);
        if (ingredients && ingredients?.length > 0) {
          const currentIngredients: IngredientPrediction[] = [...ingredients];
          const ingredientToToggleIndex: number | undefined =
            currentIngredients.findIndex(({ id }: IngredientPrediction) => {
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
      (idToRemove: number) => {
        if (ingredients) {
          const currentIngredients: IngredientPrediction[] = [...ingredients];
          const newIngredients = currentIngredients.filter(
            ({ id }: IngredientPrediction) => {
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
        console.log(ingredients);

        return ingredients.some(({ isChecked }: IngredientPrediction) => {
          return isChecked;
        });
      }
      return false;
    }, [ingredients]);

    return (
      <View style={styles.container}>
        <IngredientBackground afterImageSearch={afterImageSearch} />
        <IngredientSearchBar />
        <View
          style={[
            styles.bottomHalfContainer,
            {
              backgroundColor:
                colorscheme === 'dark'
                  ? Colors[colorscheme].backgroundDarker
                  : Colors[colorscheme].veryLightGrey,
            },
          ]}
        >
          <ScrollView
            style={{
              paddingTop: 65,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 5,
            }}
          >
            {ingredients && ingredients.length > 0 ? (
              ingredients.map(
                ({ id, name, accuracy, isChecked }: IngredientPrediction) => {
                  return (
                    <SwipeAction
                      autoClose
                      style={{
                        backgroundColor:
                          colorscheme === 'dark'
                            ? Colors.light.normalGrey
                            : Colors.light.background,
                        borderRadius: 12,
                        height: 66,
                        elevate: 6,
                        marginBottom: 10,
                      }}
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
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          backgroundColor:
                            colorscheme === 'dark'
                              ? Colors.light.normalGrey
                              : Colors.light.background,
                          height: 66,
                        }}
                      >
                        <BouncyCheckbox
                          size={32}
                          style={{ marginLeft: 15 }}
                          fillColor={Colors.light.text}
                          iconStyle={{ borderColor: Colors.light.text }}
                          onPress={() => {
                            toggleCheckIngredient(id);
                          }}
                        />
                        <View
                          style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            backgroundColor:
                              colorscheme === 'dark'
                                ? Colors.light.normalGrey
                                : Colors.light.background,
                            height: 66,
                          }}
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
                            {accuracy * 100}% certain
                          </Text>
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
        <Button
          type="primary"
          disabled={!checkIfIngredientsAreChecked()}
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            height: 50,
            borderRadius: 25,
            zIndex: 999,
            backgroundColor: Colors.light.tint,
            borderColor: Colors.light.tint,
          }}
          onPress={() => {
            console.log('qsdfqsdf');
          }}
        >
          Search Recipes
        </Button>
      </View>
    );
  };
export default TextSearchScreen;
