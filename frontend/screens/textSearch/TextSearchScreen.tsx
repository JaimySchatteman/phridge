import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ScrollView,
  Button,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useCallback, useState } from 'react';
import { List, SwipeAction } from '@ant-design/react-native';
import { AntDesign } from '@expo/vector-icons';
import { SwipeActionProps } from '@ant-design/react-native/es/swipe-action';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Swipeable } from 'react-native-gesture-handler';
import { Text, View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import IngredientBackground from './IngredientBackground';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import IngredientSearchBar from './IngredientSearchBar';

const { Item } = List;

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
  isChecked: boolean;
}

export interface IngredientPrediction extends IngredientSuggestion {
  accuracy: number;
}

const TextSearchScreen = () => {
  const [extractedIngredients, setExtractendIngredients] = useState<
    IngredientPrediction[] | undefined
  >([
    {
      id: 1,
      name: 'carrot',
      accuracy: 0.3,
      isChecked: false,
    },
  ]);
  const { width } = useCamera();
  const colorscheme = useColorScheme();

  const toggleCheckIngredient = useCallback(
    (idToToggle: number) => {
      const currentIngredients: IngredientPrediction[] = [
        ...extractedIngredients,
      ];
      const ingredientToToggle = currentIngredients.findIndex(
        ({ id }: IngredientPrediction) => {
          return idToToggle === id;
        },
      );
    },
    [extractedIngredients],
  );

  const removeIngredient = useCallback(
    (idToRemove: number) => {
      if (extractedIngredients) {
        const currentIngredients: IngredientPrediction[] = [
          ...extractedIngredients,
        ];
        const newIngredients = currentIngredients.filter(
          ({ id }: IngredientPrediction) => {
            return idToRemove !== id;
          },
        );
      }
    },
    [extractedIngredients],
  );

  const getRight = useCallback(
    (id: number): any => {
      return [<Button onPress={removeIngredient(id)}>SDFQSD</Button>];
    },
    [removeIngredient],
  );

  return (
    <View style={styles.container}>
      <IngredientBackground />
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
            marginTop: 55,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 5,
          }}
        >
          {extractedIngredients && extractedIngredients.length > 0 ? (
            <List style={{ borderRadius: 7 }}>
              {extractedIngredients.map(
                ({ id, name, accuracy, isChecked }: IngredientPrediction) => {
                  return (
                    <Swipeable
                      rightButtons={getRight(id)}
                      onOpen={() => console.log('open')}
                      onClose={() => console.log('close')}
                    >
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          backgroundColor: Colors[colorscheme].normalGrey,
                        }}
                      >
                        <BouncyCheckbox
                          style={{ marginLeft: 10 }}
                          onPress={() => {
                            toggleCheckIngredient(id);
                          }}
                        />
                        <Item
                          key={id}
                          style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                          }}
                        >
                          {name}
                        </Item>
                      </View>
                    </Swipeable>
                  );
                },
              )}
            </List>
          ) : (
            <Text>Nothing to show</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
export default TextSearchScreen;
