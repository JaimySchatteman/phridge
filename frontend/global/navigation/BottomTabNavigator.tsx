/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { FC } from 'react';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import ImageSearchScreen from '../../screens/imageSearch/ImageSearchScreen';
import TextSearchScreen from '../../screens/textSearch/TextSearchScreen';
import {
  BottomTabParamList,
  ImageSearchParamList,
  TextSearchParamList,
} from '../../types';

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon({
  name,
  color,
  size,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  size: number;
}) {
  return (
    <MaterialIcons
      size={size}
      name={name}
      color={color}
      style={{ paddingTop: name === 'search' ? 3 : 0 }}
    />
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const Image = createStackNavigator<ImageSearchParamList>();

const ImageSearchNavigator = () => {
  return (
    <Image.Navigator>
      <Image.Screen
        name="ImageSearchScreen"
        component={ImageSearchScreen}
        options={{ headerShown: false }}
      />
      <Image.Screen
        name="AdjustIngredients"
        component={TextSearchScreen}
        options={{ headerShown: false }}
      />
    </Image.Navigator>
  );
};

const Text = createStackNavigator<TextSearchParamList>();

const TextSearchNavigator = () => {
  return (
    <Text.Navigator>
      <Text.Screen
        name="TextSearchScreen"
        component={TextSearchScreen}
        options={{ headerShown: false }}
      />
    </Text.Navigator>
  );
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: FC = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ImageSearch"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: Colors[colorScheme].tint,
        inactiveBackgroundColor: Colors[colorScheme].background,
        activeBackgroundColor: Colors[colorScheme].background,
        style: {
          height: 60,
          paddingBottom: 5,
          backgroundColor: Colors[colorScheme].background,
        },
      }}
    >
      <BottomTab.Screen
        name="ImageSearch"
        component={ImageSearchNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="image-search" color={color} size={30} />
          ),
          tabBarLabel: 'Image Search',
        }}
      />
      <BottomTab.Screen
        name="TextSearch"
        component={TextSearchNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search" color={color} size={33} />
          ),
          tabBarLabel: 'Manual Search',
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
