import React, { FC, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from 'expo-image-picker';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { View } from '../../global/style/Themed';
import useImageUpload from './useImageUpload';
import { Ingredient } from '../textSearch/TextSearchScreen';
import { ResultArray } from '../textSearch/IngredientSearchBar';

type CameraButtonsProps = {
  camera: Camera | undefined;
  screenWidth: number;
  cameraPadding: number;
  handleCameraType: () => void;
  handleImageSelected: (state: boolean) => void;
  handlePictureTaken: (state: boolean) => void;
};

const CameraButtons: FC<CameraButtonsProps> = ({
  camera,
  screenWidth,
  cameraPadding,
  handleCameraType,
  handleImageSelected,
  handlePictureTaken,
}: CameraButtonsProps) => {
  const colorScheme = useColorScheme();
  const { sendPicture, createFormData } = useImageUpload();
  const navigation = useNavigation();

  const pickImage = useCallback(async () => {
    try {
      const imagePickerResult: ImagePickerResult =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
      if (imagePickerResult.cancelled) return;
      handleImageSelected(true);
      const formData: FormData = createFormData(imagePickerResult.uri);
      const response: Response = await sendPicture(formData);
      const { results }: ResultArray = await response.json();
      const extractedIngredients: Ingredient[] = results as Ingredient[];
      navigation.navigate('Root', {
        screen: 'ImageSearch',
        params: {
          screen: 'AdjustIngredients',
          params: {
            extractedIngredients,
          },
        },
      });
      handleImageSelected(false);
    } catch (e) {
      console.log(e);
      handleImageSelected(false);
    }
  }, [createFormData, handleImageSelected, navigation, sendPicture]);

  const takePicture = async () => {
    try {
      const photo: CameraCapturedPicture | undefined =
        await camera?.takePictureAsync();
      if (!photo) return;
      handlePictureTaken(true);
      const formData = createFormData(photo.uri);
      console.log('Sending Request...');
      const result: Response = await sendPicture(formData);
      console.log('Response Received!');
      const { results }: ResultArray = await result.json();
      const extractedIngredients: Ingredient[] = results as Ingredient[];
      navigation.navigate('Root', {
        screen: 'ImageSearch',
        params: {
          screen: 'AdjustIngredients',
          params: {
            extractedIngredients,
          },
        },
      });
      handlePictureTaken(false);
    } catch (e) {
      console.log(e);
      handlePictureTaken(false);
    }
  };

  console.log(cameraPadding);

  return (
    <View
      style={{
        width: screenWidth,
        height: cameraPadding * 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 35,
        paddingRight: 35,
        backgroundColor:
          colorScheme === 'dark'
            ? Colors[colorScheme].background
            : Colors[colorScheme].veryLightGrey,
      }}
    >
      <TouchableOpacity
        onPress={pickImage}
        style={{
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <Ionicons
          name="images"
          style={{
            color: colorScheme === 'dark' ? '#fff' : Colors[colorScheme].tint,
            fontSize: 40,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          backgroundColor:
            colorScheme === 'dark'
              ? Colors[colorScheme].backgroundDarker
              : Colors[colorScheme].tint,
          padding: 25,
          borderRadius: 45,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,
          elevation: 13,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: 'center',
          }}
          onPress={takePicture}
        >
          <FontAwesome name="camera" style={{ color: '#fff', fontSize: 40 }} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}
        onPress={handleCameraType}
      >
        <MaterialCommunityIcons
          name="camera-switch"
          style={{
            color: colorScheme === 'dark' ? '#fff' : Colors[colorScheme].tint,
            fontSize: 40,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraButtons;
