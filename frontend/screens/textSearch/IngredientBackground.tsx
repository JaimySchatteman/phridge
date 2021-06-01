import React, { FC } from 'react';
import { ImageBackground } from 'react-native';
import ingredientBackground from '../../assets/images/ingredients.jpg';
import { Text, View } from '../../global/style/Themed';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import useColorScheme from '../../hooks/useColorScheme';

type IngredientBackgroundProps = {
  afterImageSearch?: boolean;
};

const IngredientBackground: FC<IngredientBackgroundProps> = ({
  afterImageSearch = false,
}: IngredientBackgroundProps) => {
  const { width } = useCamera();
  const colorscheme = useColorScheme();

  return (
    <ImageBackground
      resizeMode="contain"
      source={ingredientBackground}
      style={{ width, height: width / 1.5, zIndex: -1 }}
    >
      <View
        style={{
          marginLeft: 52,
          backgroundColor: 'transparent',
          marginTop: width / 3.5,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 30,
            fontWeight: '700',
          }}
        >
          {afterImageSearch ? 'Select or remove' : 'Add the ingredients'}
        </Text>
        <Text style={{ color: Colors[colorscheme].lightGrey, fontSize: 16 }}>
          {afterImageSearch
            ? 'the ingredients you want to include'
            : ' you want to include in the search'}
        </Text>
      </View>
    </ImageBackground>
  );
};

export default IngredientBackground;
