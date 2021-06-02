import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          ImageSearch: {
            screens: {
              ImageSearchScreen: 'ImageSearchScreen',
              AdjustIngredients: 'AdjustIngredients',
              ViewRecipes: 'ViewRecipes',
            },
          },
          TextSearch: {
            screens: {
              TextSearchScreen: 'TextSearchScreen',
              ViewRecipes: 'ViewRecipes',
            },
          },
        },
      },
      Login: 'Login',
      NotFound: '*',
    },
  },
};
