import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from './screens/AccountScreen';
import LogInScreen from './screens/LogInScreen';
import TransferSafety from './screens/TransferSafetyScreen';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Main"
          component={MainStackScreens}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const MainStackScreens = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Login" component={LogInScreen} />
      <MainStack.Screen name="Account" component={AccountScreen} />
      <MainStack.Screen
        name="Confirming Payment"
        component={TransferSafety}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};

export default App;
