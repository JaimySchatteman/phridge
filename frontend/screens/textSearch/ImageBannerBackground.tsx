import React, { FC } from 'react';
import {
  ImageBackground,
  ImagePropsBase,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from '../../global/style/Themed';
import Colors from '../../constants/Colors';
import useCamera from '../imageSearch/useCamera';
import useColorScheme from '../../hooks/useColorScheme';

export type IngredientBackgroundProps = {
  displayBackButton: boolean | undefined;
  image: ImagePropsBase;
  headerText: string;
  subText: string;
};

const ImageBannerBackground: FC<IngredientBackgroundProps> = ({
  displayBackButton = false,
  image,
  headerText,
  subText,
}: IngredientBackgroundProps) => {
  const { screenWidth } = useCamera();
  const colorscheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <ImageBackground
      resizeMode="contain"
      source={image}
      style={{
        width: screenWidth,
        height: screenWidth / 1.5,
        zIndex: -1,
      }}
    >
      {displayBackButton && (
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
            navigation.goBack();
          }}
        >
          <AntDesign name="arrowleft" size={30} color="#fff" />
        </TouchableOpacity>
      )}
      <View
        style={{
          marginLeft: 52,
          backgroundColor: 'transparent',
          marginTop: displayBackButton ? screenWidth / 10 : screenWidth / 3.8,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 30,
            fontWeight: '700',
          }}
        >
          {headerText}
        </Text>
        <Text style={{ color: Colors[colorscheme].lightGrey, fontSize: 16 }}>
          {subText}
        </Text>
      </View>
    </ImageBackground>
  );
};

export default ImageBannerBackground;
