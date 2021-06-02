import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { FC, useEffect, useState } from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Text, View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import ImageBannerBackground from '../textSearch/ImageBannerBackground';
import recipeBackground from '../../assets/images/recipesBackground.png';
import RecipeListItem from './RecipeListItem';

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
    paddingTop: 35,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 25,
  },
});

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
}

export type RecipeScreenParams = {
  foundRecipes: Recipe[];
};

const RecipeScreen: NavigationScreenComponent<FC, RecipeScreenParams> = ({
  route,
}) => {
  const [recipes, setRecipes] = useState<Recipe[] | undefined>([
    {
      id: 1084628,
      image: 'https://spoonacular.com/recipeImages/1084628-312x231.jpg',
      missedIngredientCount: 4,
      title: 'Healthy Easter boiled eggs',
      usedIngredientCount: 4,
    },
    {
      id: 437311,
      image: 'https://spoonacular.com/recipeImages/437311-312x231.jpg',
      missedIngredientCount: 1,
      title: 'Vegetable Bobbers',
      usedIngredientCount: 3,
    },
    {
      id: 697843,
      image: 'https://spoonacular.com/recipeImages/697843-312x231.jpg',
      missedIngredientCount: 3,
      title: 'The EatingWell Diet House Salad',
      usedIngredientCount: 3,
    },
    {
      id: 402143,
      image: 'https://spoonacular.com/recipeImages/402143-312x231.jpg',
      missedIngredientCount: 3,
      title: 'Three-Pepper Veggie Tray',
      usedIngredientCount: 3,
    },
    {
      id: 93866,
      image: 'https://spoonacular.com/recipeImages/93866-312x231.jpg',
      missedIngredientCount: 3,
      title: 'Jamaican Garden Salad',
      usedIngredientCount: 3,
    },
  ]);
  const colorscheme = useColorScheme();
  const { screenWidth, screenHeight } = useCamera();

  useEffect(() => {
    if (route.params && route.params.foundRecipes) {
      const { foundRecipes }: RecipeScreenParams = route.params;
      setRecipes(foundRecipes);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <ImageBannerBackground
        displayBackButton
        image={recipeBackground}
        headerText={'We found these \nrecipes'}
        subText="Hopefully you will like them"
      />
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
          contentContainerStyle={{ paddingBottom: 45 }}
          style={styles.scrollView}
        >
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe: Recipe) => {
              return <RecipeListItem recipe={recipe} />;
            })
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
    </View>
  );
};
export default RecipeScreen;
