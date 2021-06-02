import React, { Dispatch, FC } from 'react';
import { Camera } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import Colors from '../../constants/Colors';
import { View } from '../../global/style/Themed';
import useColorScheme from '../../hooks/useColorScheme';

type CustomCameraProps = {
  setCameraReady: () => void;
  ratio: string;
  cameraType: CameraType;
  setCamera: Dispatch<React.SetStateAction<Camera | undefined>>;
  screenWidth: number;
};

const CustomizedCamera: FC<CustomCameraProps> = ({
  setCameraReady,
  ratio,
  cameraType,
  setCamera,
  screenWidth,
}: CustomCameraProps) => {
  const colorScheme = useColorScheme();

  return (
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
            width: screenWidth,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor:
              colorScheme === 'dark'
                ? Colors[colorScheme].background
                : Colors[colorScheme].veryLightGrey,
          }}
        />
      </View>
    </Camera>
  );
};

export default CustomizedCamera;
