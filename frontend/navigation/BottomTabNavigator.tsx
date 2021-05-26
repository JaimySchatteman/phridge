/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ImageSearchScreen from '../screens/ImageSearchScreen';
import TextSearchScreen from '../screens/TextSearchScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} name={name} color={color} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

const TabOneNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="ImageSearchScreen"
        component={ImageSearchScreen}
        options={{
          headerTitle: 'Search by image',
          headerStyle: { backgroundColor: Colors[colorScheme].background },
        }}
      />
    </TabOneStack.Navigator>
  );
};

const TabTwoStack = createStackNavigator<TabTwoParamList>();

const TabTwoNavigator = () => {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TextSearchScreen"
        component={TextSearchScreen}
        options={{ headerShown: false }}
      />
    </TabTwoStack.Navigator>
  );
};

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ImageSearch"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        inactiveBackgroundColor: Colors[colorScheme].background,
        activeBackgroundColor: Colors[colorScheme].background,
      }}
    >
      <BottomTab.Screen
        name="ImageSearch"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="image-search" color={color} />
          ),
          tabBarLabel: 'Image Search',
        }}
      />
      <BottomTab.Screen
        name="TextSearch"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          tabBarLabel: 'Manual Search',
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
