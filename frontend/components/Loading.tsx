import * as React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { WhiteSpace } from '@ant-design/react-native';
import { View, Text } from './Themed';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const Loading = () => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 900,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    }),
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <AntDesign name="loading1" size={36} style={{ color: '#07E2A4' }} />
      </Animated.View>
      <WhiteSpace size="lg" />
      <Text>Extracting ingredients</Text>
    </View>
  );
};

export default Loading;
