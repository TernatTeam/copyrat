import 'react-native-gesture-handler';

import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

import TabsContainer from '../src/pages/tabs/TabsContainer';

import { ProfilePage, HomePage } from '../src/pages/tabs/pages';
import { useKeyboard } from '../src/hooks';

const TabButtons = [
  {
    route: 'Profile',
    label: 'Profile',
    icon: 'person',
    component: ProfilePage,
  },
  { route: 'Home', label: 'Home', icon: 'home', component: HomePage },
];

const Tab = createBottomTabNavigator();

export const IndexTabs = () => {
  const keyboardStatus = useKeyboard();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { marginBottom: !keyboardStatus ? 25 : -5 },
        ],
      }}
      initialRouteName="Home"
    >
      {TabButtons.map((tabButton, index) => {
        return (
          <Tab.Screen
            key={index}
            name={tabButton.route}
            component={tabButton.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => {
                return <TabsContainer {...props} item={tabButton} />;
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    position: 'absolute',
    borderRadius: 15,
    alignSelf: 'center',
    width: '50%',
    left: '25%',
    backgroundColor: '#daedf8',
  },
});

export default IndexTabs;
