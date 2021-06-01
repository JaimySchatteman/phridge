import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Camera } from 'expo-camera';
import { CameraType } from 'expo-camera/build/Camera.types';
import { Alert, Dimensions, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type RatioOptions = {
  [key: string]: number;
};

const useCamera = () => {
  const [camera, setCamera] = useState<Camera | undefined>(undefined);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [cameraType, setCameraType] = useState<CameraType>(
    Camera.Constants.Type.back,
  );

  const [cameraPadding, setCameraPadding] = useState(0);
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

  useEffect(() => {
    askForCameraPermission();
    askForCameraRollPermission();
  }, [askForCameraPermission, askForCameraRollPermission]);

  const handleCameraType = useCallback(() => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    );
  }, [cameraType]);

  // Reference: https://stackoverflow.com/questions/58634905/camera-preview-in-expo-is-distorted
  const prepareRatio = useCallback(async () => {
    let desiredRatio: string | null = '4:3'; // Start with the system default
    if (Platform.OS === 'android') {
      const ratios = await camera?.getSupportedRatiosAsync();

      console.log(width);

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
            (height - realRatios[desiredRatio] * width) / 2,
          );
          setCameraPadding(remainder);
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

  return {
    camera,
    setCamera,
    hasPermission,
    setCameraType,
    cameraType,
    ratio,
    width,
    handleCameraType,
    setCameraReady,
    cameraPadding,
  };
};

export default useCamera;
