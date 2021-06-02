import React, { FC } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ingredientBackground from '../../assets/images/ingredients.jpg';
import { Text, View } from '../../global/style/Themed';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import useColorScheme from '../../hooks/useColorScheme';

type IngredientBackgroundProps = {
  afterImageSearch: boolean | undefined;
};

const IngredientBackground: FC<IngredientBackgroundProps> = ({
  afterImageSearch = false,
}: IngredientBackgroundProps) => {
  const { screenWidth } = useCamera();
  const colorscheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <ImageBackground
      resizeMode="contain"
      source={ingredientBackground}
      style={{
        width: screenWidth,
        height: screenWidth / 1.5,
        zIndex: -1,
      }}
    >
      {afterImageSearch && (
        <TouchableOpacity
          style={{
            width: 30 + 10,
            marginLeft: screenWidth / 24,
            marginTop: screenWidth / 12,
            padding: 5,
            backgroundColor: `rgba(${Colors.dark.backgroundDarker}, 0.5)`,
            borderRadius: 7,
          }}
          onPress={() => {
            navigation.navigate('Root', {
              screen: 'ImageSearch',
              params: {
                screen: 'ImageSearchScreen',
              },
            });
          }}
        >
          <AntDesign name="arrowleft" size={30} color="#fff" />
        </TouchableOpacity>
      )}
      <View
        style={{
          marginLeft: 52,
          backgroundColor: 'transparent',
          marginTop: afterImageSearch ? screenWidth / 10 : screenWidth / 4,
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
