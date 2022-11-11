import 'react-native-gesture-handler';

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
} from '../src/pages/auth/index';

import IndexTabs from './IndexTabs';
import {
  ChatPage,
  LobbyPage,
  VotePage,
  ScorePage,
  RulesPage,
  EndPage,
  RoomSettingsPage,
  SettingsPage,
} from '../src/pages/index';

const Stack = createStackNavigator();

const Index = ({ page }) => {
  return (
    <NavigationContainer theme={{ colors: { background: '#747474' } }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {page === 'Login' ? (
          <Stack.Screen name="Login" component={LoginPage} />
        ) : (
          <Stack.Screen
            name="Tabs"
            component={IndexTabs}
            options={{
              gestureEnabled: false,
              cardStyleInterpolator:
                CardStyleInterpolators.forScaleFromCenterAndroid,
            }}
          />
        )}
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen
          options={{
            gestureEnabled: false,
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
          name="Lobby"
          component={LobbyPage}
        />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="Vote" component={VotePage} />
        <Stack.Screen name="Scoreboard" component={ScorePage} />
        <Stack.Screen
          options={{
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          }}
          name="Rules"
          component={RulesPage}
        />
        <Stack.Screen
          options={{
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          }}
          name="Room Settings"
          component={RoomSettingsPage}
        />
        <Stack.Screen
          options={{
            gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          }}
          name="Settings"
          component={SettingsPage}
        />
        <Stack.Screen name="End" component={EndPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
