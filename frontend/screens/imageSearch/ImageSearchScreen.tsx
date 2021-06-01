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
import { CameraCapturedPicture } from 'expo-camera';
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
import Loading from '../../global/Loading';
import { View, Text } from '../../global/style/Themed';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import CustomizedCamera from './CustomCamera';
import CameraButtons from './CameraButtons';
import useCamera from './useCamera';

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
});

const ImageSearchScreen: NavigationScreenComponent<FC, undefined> = () => {
  const isFocussed = useIsFocused();
  const { hasPermission } = useCamera();
  const [pictureTaken, setPictureTaken] = useState<boolean>(false);
  const [imageSelected, setImageSelected] = useState<boolean>(false);
  const {
    setCameraReady,
    ratio,
    cameraType,
    setCamera,
    camera,
    handleCameraType,
    cameraPadding,
    width,
  } = useCamera();

  const handlePictureTaken = useCallback(() => {
    setPictureTaken(true);
  }, []);

  const handleImageSelected = useCallback(() => {
    setImageSelected(true);
  }, []);

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
                <CustomizedCamera
                  cameraType={cameraType}
                  setCamera={setCamera}
                  setCameraReady={setCameraReady}
                  ratio={ratio}
                  width={width}
                />
                <CameraButtons
                  handleImageSelected={handleImageSelected}
                  handlePictureTaken={handlePictureTaken}
                  camera={camera}
                  width={width}
                  cameraPadding={cameraPadding}
                  handleCameraType={handleCameraType}
                />
              </>
            )}
          </View>
        </>
      )}
    </>
  );
};

export default ImageSearchScreen;
