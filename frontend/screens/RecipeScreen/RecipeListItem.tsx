import React, { FC } from 'react';
import { SwipeAction } from '@ant-design/react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Image, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Text, View } from '../../global/style/Themed';
import { Recipe } from './RecipeScreen';
import useColorScheme from '../../hooks/useColorScheme';

const styles = StyleSheet.create({
  swipeAction: {
    borderRadius: 12,
    height: 90,
    elevation: 6,
    marginBottom: 18,
  },
  listItem: {
    height: 89,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  listItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 7,
    padding: 15,
    height: 90,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 7,
    fontWeight: '800',
  },
  iconAndSmallTextContainer: { display: 'flex', flexDirection: 'row' },
});

type RecipeListItemProps = {
  recipe: Recipe;
};

const RecipeListItem: FC<RecipeListItemProps> = ({
  recipe: { id, title, image, usedIngredientCount, missedIngredientCount },
}: RecipeListItemProps) => {
  const colorscheme = useColorScheme();

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
          text: <Feather name="external-link" size={24} color="black" />,
          onPress: () => console.log('qsdfqsdf'),
          style: { backgroundColor: Colors.light.tint },
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
          },
        ]}
      >
        <View style={{ width: 90, height: 100 }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

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
            style={[
              styles.titleText,
              {
                color:
                  colorscheme === 'dark'
                    ? Colors.light.background
                    : Colors.dark.backgroundDarker,
              },
            ]}
          >
            {title[0].toUpperCase() + title.slice(1, title.length)}
          </Text>
          <View style={styles.iconAndSmallTextContainer}>
            <AntDesign
              name="check"
              size={15}
              color={Colors.light.tint}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color:
                  colorscheme === 'dark'
                    ? Colors.light.lightGrey
                    : Colors.dark.backgroundDarker,
                fontSize: 12,
                marginBottom: 3,
              }}
            >
              {Math.round(usedIngredientCount)}
            </Text>
          </View>

          <View style={styles.iconAndSmallTextContainer}>
            <AntDesign
              name="close"
              size={15}
              color="red"
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color:
                  colorscheme === 'dark'
                    ? Colors.light.lightGrey
                    : Colors.dark.backgroundDarker,
                fontSize: 12,
              }}
            >
              {Math.round(missedIngredientCount)}
            </Text>
          </View>
        </View>
      </View>
    </SwipeAction>
  );
};
export default RecipeListItem;
