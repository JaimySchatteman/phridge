/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Image: {
            screens: {
              ImageSearchScreen: 'image',
            },
          },
          Text: {
            screens: {
              TextSearchScreen: 'text',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
