import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { CameraType } from 'expo-camera/build/Camera.types';
import * as ImagePicker from 'expo-image-picker';
import { NavigationScreenComponent } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
import { ImagePickerResult } from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import mime from 'mime';
import Loading from '../components/Loading';
import { View, Text } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
});

type RatioOptions = {
  [key: string]: number;
};

const ImageSearchScreen: NavigationScreenComponent<FC, undefined> = () => {
  const colorScheme = useColorScheme();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const isFocussed = useIsFocused();
  const [camera, setCamera] = useState<Camera | undefined>(undefined);
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.back,
  );
  const [pictureTaken, setPictureTaken] = useState<boolean>(false);
  const [imageSelected, setImageSelected] = useState<boolean>(false);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  const askForCameraPermission = useCallback(async () => {
    const { status } = await Camera.requestPermissionsAsync();
    console.log(`Camera perm: ${status}`);
    setHasPermission(status === 'granted');
  }, []);

  const askForCameraRollPermission = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log(`Medialibrary status: ${status}`);

      if (status !== 'granted') {
        Alert.alert(
          'Sorry, we need camera roll permissions to make this work!',
        );
      }
    }
  }, []);

  useLayoutEffect(() => {
    askForCameraPermission();
    askForCameraRollPermission();
  }, [askForCameraPermission, askForCameraRollPermission]);

  const createFormData = useCallback((uri: string): FormData => {
    const newImageUri = `file:///${uri.split('file:/').join('')}`;
    const fileName = uri.split('/').pop();

    const formData = new FormData();
    if (fileName) {
      const match = /\.(\w+)$/.exec(fileName);
      const imageType: string = match ? `image/${match[1]}` : 'image';

      formData.append('image', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
    }

    return formData;
  }, []);

  const sendPicture = useCallback(async (formData: FormData) => {
    console.log(formData);
    return fetch('http://192.168.0.254:5000/api/search-ingredients', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

  const pickImage = useCallback(async () => {
    try {
      const imagePickerResult: ImagePickerResult =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

      if (imagePickerResult.cancelled) {
        return;
      }

      const formData: FormData = createFormData(imagePickerResult.uri);

      if (formData) {
        const result: any = await sendPicture(formData);
        console.log(result.status);
      }
    } catch (e) {
      console.log(e);
    }
  }, [createFormData, sendPicture]);

  const handleCameraType = useCallback(() => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  }, [cameraType]);

  const takePicture = async () => {
    try {
      const photo: CameraCapturedPicture | undefined =
        await camera?.takePictureAsync();

      if (photo) {
        // setPictureTaken(true);;
        const formData = createFormData(photo.uri);
        if (formData) {
          console.log('Sending Request...');
          const result: Response = await sendPicture(formData);
          console.log('Response Received!');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const json: any = await result.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log(json.results);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Reference: https://stackoverflow.com/questions/58634905/camera-preview-in-expo-is-distorted
  const prepareRatio = useCallback(async () => {
    let desiredRatio: string | null = '4:3'; // Start with the system default
    if (Platform.OS === 'android') {
      const ratios = await camera?.getSupportedRatiosAsync();

      if (ratios) {
        const distances: RatioOptions = {};
        const realRatios: RatioOptions = {};
        let minDistance = null;
        // eslint-disable-next-line no-restricted-syntax
        for (const tempRatio of ratios) {
          const parts = tempRatio.split(':');
          const realRatio = parseInt(parts[0], 10) / parseInt(parts[1], 10);
          realRatios[tempRatio] = realRatio;
          const distance = screenRatio - realRatio;
          distances[tempRatio] = realRatio;
          if (minDistance == null) {
            minDistance = ratio;
          } else if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
        desiredRatio = minDistance;
        if (desiredRatio) {
          const remainder = Math.floor(
            (height - 85 - realRatios[desiredRatio] * width) / 2,
          );
          setImagePadding(remainder);
          setRatio(desiredRatio);
          setIsRatioSet(true);
        }
      }
    }
  }, [camera, height, ratio, screenRatio, width]);

  const setCameraReady = useCallback(async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  }, [isRatioSet, prepareRatio]);

  if (hasPermission === null) {
    return <View />;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      {pictureTaken || imageSelected ? (
        <Loading />
      ) : (
        <>
          <View style={styles.cameraContainer}>
            {isFocussed && (
              <>
                <Camera
                  style={{
                    flex: 1,
                  }}
                  onCameraReady={setCameraReady}
                  ratio={ratio}
                  type={cameraType}
                  ref={ref => {
                    if (!ref) return;
                    setCamera(ref);
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'row',
                      backgroundColor: 'transparent',
                    }}
                  >
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        minHeight: 30,
                        width,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        backgroundColor: Colors[colorScheme].background,
                      }}
                    />
                  </View>
                </Camera>
                <View
                  style={{
                    width,
                    height: imagePadding * 2,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingLeft: 35,
                    paddingRight: 35,
                    backgroundColor: Colors[colorScheme].background,
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
                      style={{ color: '#fff', fontSize: 40 }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      backgroundColor: Colors[colorScheme].backgroundDarker,
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
                      <FontAwesome
                        name="camera"
                        style={{ color: '#fff', fontSize: 40 }}
                      />
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
                      style={{ color: '#fff', fontSize: 40 }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </>
  );
};

export default ImageSearchScreen;
