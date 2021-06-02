import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FC, useCallback, useState } from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../global/Loading';
import { View, Text } from '../../global/style/Themed';
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
    screenWidth,
  } = useCamera();

  const handlePictureTaken = useCallback((state: boolean) => {
    setPictureTaken(state);
  }, []);

  const handleImageSelected = useCallback((state: boolean) => {
    setImageSelected(state);
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
                  screenWidth={screenWidth}
                />
                <CameraButtons
                  handleImageSelected={handleImageSelected}
                  handlePictureTaken={handlePictureTaken}
                  camera={camera}
                  screenWidth={screenWidth}
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
