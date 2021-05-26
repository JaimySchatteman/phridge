import * as React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

import { FC, useCallback, useLayoutEffect, useState } from 'react';
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
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Loading from '../components/Loading';
import { View, Text } from '../components/Themed';

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
    setHasPermission(status === 'granted');
  }, []);

  const askForCameraRollPermission = useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  };

  const createFormData = ({
    uri,
  }: CameraCapturedPicture): FormData | undefined => {
    const data = new FormData();
    const fileName = uri.split('/').pop();

    if (fileName) {
      const match = /\.(\w+)$/.exec(fileName);
      const imageType: string = match ? `image/${match[1]}` : 'image';
      const computedUri: string =
        Platform.OS === 'android' ? uri : uri.replace('file://', '');
      data.append(
        'image',
        JSON.stringify({
          uri: computedUri,
          type: imageType,
          name: fileName,
        }),
      );

      return data;
    }
    return undefined;
  };

  const takePicture = async () => {
    try {
      const photo: CameraCapturedPicture | undefined =
        await camera?.takePictureAsync();
      if (photo) {
        setPictureTaken(true);
        const formData = createFormData(photo);
        console.log('Sending Request...');
        const result: Response = await fetch(
          'http://192.168.1.47:5000/api/search-ingredients',
          {
            method: 'POST',
            body: formData,
            headers: {
              'content-type': 'multipart/form-data',
            },
          },
        );
        console.log('Response Received!');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json: any = await result.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.log(json.results);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Reference: https://stackoverflow.com/questions/58634905/camera-preview-in-expo-is-distorted
  const prepareRatio = async () => {
    let desiredRatio: string | null = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera?.getSupportedRatiosAsync();

      if (ratios) {
        // Calculate the width/height of each of the supported camera ratios
        // These width/height are measured in landscape mode
        // find the ratio that is closest to the screen ratio without going over
        const distances: RatioOptions = {};
        const realRatios: RatioOptions = {};
        let minDistance = null;
        // eslint-disable-next-line no-restricted-syntax
        for (const tempRatio of ratios) {
          const parts = tempRatio.split(':');
          const realRatio = parseInt(parts[0], 10) / parseInt(parts[1], 10);
          realRatios[tempRatio] = realRatio;
          // ratio can't be taller than screen, so we don't want an abs()
          const distance = screenRatio - realRatio;
          distances[tempRatio] = realRatio;
          if (minDistance == null) {
            minDistance = ratio;
          } else if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
        // set the best match
        desiredRatio = minDistance;
        //  calculate the difference between the camera width and the screen height
        if (desiredRatio) {
          const remainder = Math.floor(
            (height - 85 - realRatios[desiredRatio] * width) / 2,
          );
          // set the preview padding and preview ratio
          setImagePadding(remainder);
          setRatio(desiredRatio);
          // Set a flag so we don't do this
          // calculation each time the screen refreshes
          setIsRatioSet(true);
        }
      }
    }
  };

  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

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
        <View style={styles.cameraContainer}>
          {isFocussed && (
            <Camera
              style={{
                flex: 1,
                marginTop: imagePadding,
                marginBottom: imagePadding,
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
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 20,
                  backgroundColor: 'transparent',
                }}
              >
                <TouchableOpacity
                  onPress={pickImage}
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Ionicons
                    name="images-outline"
                    style={{ color: '#fff', fontSize: 40 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={takePicture}
                >
                  <FontAwesome
                    name="camera"
                    style={{ color: '#fff', fontSize: 40 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
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
            </Camera>
          )}
        </View>
      )}
    </>
  );
};

export default ImageSearchScreen;
