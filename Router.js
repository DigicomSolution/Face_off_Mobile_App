import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {UserConsumer} from './App';

import Splash from './src/Screens/Splash';
import signIn from './src/Screens/Login';
import passcode from './src/Screens/PassCode';
import userInfo from './src/Screens/UserInfo';
import termsCondition from './src/Screens/termsCondition';
// import ComingSoon from "./src/Screens/comingSoon";

import {userTabs} from './userTabs';

const AuthStack = createStackNavigator();

const SignINStack = createStackNavigator();

function Signstack() {
  return (
    <SignINStack.Navigator initialRouteName={'signIn'}>
      <SignINStack.Screen
        name={'signIn'}
        component={signIn}
        options={{headerShown: false}}
      />
      <SignINStack.Screen
        name={'passcode'}
        component={passcode}
        options={{headerShown: false}}
      />
      <SignINStack.Screen
        name={'userInfo'}
        component={userInfo}
        options={{headerShown: false}}
      />
      <SignINStack.Screen
        name={'termsCondition'}
        component={termsCondition}
        options={{headerShown: false}}
      />
    </SignINStack.Navigator>
  );
}

function Router() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator initialRouteName={'Splash'} headerMode={'float'}>
        <AuthStack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="signIn"
          component={Signstack}
          options={{headerShown: false}}
        />
        <AuthStack.Screen
          name="tabs"
          component={userTabs}
          options={{headerShown: false}}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
