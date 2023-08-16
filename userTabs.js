import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {UserConsumer} from './App';
import messaging from '@react-native-firebase/messaging';
import feedsScreen from './src/Screens/user/feeds';
import votingScreen from './src/Screens/user/Voting';
import resultScreen from './src/Screens/user/Results';
import UserProfile from './src/Screens/user/userProfile';
//import contact from "./src/Screens/contactUs";
import comingSoon from './src/Screens/comingSoon';

import notification from './src/Screens/user/Notification';
import IndividualTopic from './src/Screens/user/IndividualTopic';

import archivesScreen from './src/Screens/user/Archives';
import CameraScreen from './src/Screens/user/CreateVideo';
import createTopicScreen from './src/Screens/user/CreateTopic';
import userInfo from './src/Screens/UserInfo';
import profile from './src/Screens/user/profile';
import help from './src/Screens/user/help';
import purchases from './src/Screens/user/InAppPurchases';
import Followers from './src/Screens/user/Followers';
import Feedback from './src/Screens/user/FeedBack';
import BuyPoints from './src/Screens/user/BuyPoints';
import Comments from './src/Screens/user/Comments';
import termsCondition from './src/Screens/termsCondition';
import Unblock from './src/Screens/user/Unblock';

const userTab = createBottomTabNavigator();
const feedStack = createStackNavigator();
const createTopicStack = createStackNavigator();
const archiveStack = createStackNavigator();
const notificationStack = createStackNavigator();
const profileStack = createStackNavigator();

function feedsStack() {
  return (
    <feedStack.Navigator initialRouteName={'feeds'}>
      <feedStack.Screen
        name="feeds"
        component={feedsScreen}
        options={{headerShown: false}}
      />
      <feedStack.Screen
        name="recordVideo"
        component={CameraScreen}
        options={{headerShown: false}}
      />
      <feedStack.Screen
        name="voting"
        component={votingScreen}
        options={{headerShown: false}}
      />
      <feedStack.Screen
        name="comments"
        component={Comments}
        options={{headerShown: false}}
      />
      <feedStack.Screen
        name="results"
        component={resultScreen}
        options={{headerShown: false}}
      />
      <feedStack.Screen
        name="userProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
    </feedStack.Navigator>
  );
}
function createTopicsStack() {
  return (
    <createTopicStack.Navigator initialRouteName={'createTopic'}>
      <createTopicStack.Screen
        name="createTopic"
        component={createTopicScreen}
        options={{headerShown: false}}
      />
      <createTopicStack.Screen
        name="recordVideo"
        component={CameraScreen}
        options={{headerShown: false}}
      />
    </createTopicStack.Navigator>
  );
}
function archivesStack() {
  return (
    <archiveStack.Navigator initialRouteName={'archives'}>
      <archiveStack.Screen
        name="archives"
        component={archivesScreen}
        options={{headerShown: false}}
      />
      <archiveStack.Screen
        name="results"
        component={resultScreen}
        options={{headerShown: false}}
      />
      <archiveStack.Screen
        name="userProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <archiveStack.Screen
        name="recordVideo"
        component={CameraScreen}
        options={{headerShown: false}}
      />
      <archiveStack.Screen
        name="comments"
        component={Comments}
        options={{headerShown: false}}
      />
    </archiveStack.Navigator>
  );
}
function notificationsStack() {
  return (
    <notificationStack.Navigator initialRouteName={'notification'}>
      <notificationStack.Screen
        name="notification"
        component={notification}
        options={{headerShown: false}}
      />
      <notificationStack.Screen
        name="individualTopic"
        component={IndividualTopic}
        options={{headerShown: false}}
      />
      <notificationStack.Screen
        name="recordVideo"
        component={CameraScreen}
        options={{headerShown: false}}
      />
      <notificationStack.Screen
        name="userProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
    </notificationStack.Navigator>
  );
}
function ProfilesStack() {
  return (
    <profileStack.Navigator initialRouteName={'profile'}>
      <profileStack.Screen
        name="profile"
        component={profile}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="help"
        component={help}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="purchases"
        component={purchases}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name={'userInfo'}
        component={userInfo}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="followers"
        component={Followers}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="feedback"
        component={Feedback}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="buyPoints"
        component={BuyPoints}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="unblock"
        component={Unblock}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name="userProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <profileStack.Screen
        name={'termsCondition'}
        component={termsCondition}
        options={{headerShown: false}}
      />
    </profileStack.Navigator>
  );
}

export function userTabs({navigation}) {
  return (
    <userTab.Navigator
      initialRouteName={'feeds'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'feeds') {
            iconName = require('./src/assets/Icons/feeds.png');
          } else if (route.name === 'createTopic') {
            iconName = require('./src/assets/Icons/create-topic.png');
          } else if (route.name === 'archives') {
            iconName = require('./src/assets/Icons/archives.png');
          } else if (route.name === 'notification') {
            iconName = require('./src/assets/Icons/notification.png');
          } else if (route.name === 'profile') {
            iconName = require('./src/assets/Icons/user-profile.png');
          }
          // You can return any component that you like here!
          return (
            <View
              style={{
                borderTopColor: '#fdac41',
                borderTopWidth: focused ? 2 : 0,
                marginVertical: 10,
              }}>
              <Image
                source={iconName}
                style={{tintColor: color, resizeMode: 'contain', marginTop: 5}}
                size={size}
              />
              {/* height:20,width:20, */}
            </View>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#fdac41',
        inactiveTintColor: 'gray',
        labelStyle: {fontWeight: 'bold'},
      }}>
      <userTab.Screen
        name="feeds"
        component={feedsStack}
        options={{tabBarLabel: 'Feeds'}}
      />
      <userTab.Screen
        name="createTopic"
        component={createTopicsStack}
        options={{tabBarLabel: 'Create Topic'}}
      />
      <userTab.Screen
        name="archives"
        component={archivesStack}
        options={{tabBarLabel: 'Archives'}}
      />
      <userTab.Screen
        name="notification"
        component={notificationsStack}
        options={{tabBarLabel: 'Notification'}}
      />
      <userTab.Screen
        name="profile"
        component={ProfilesStack}
        options={{tabBarLabel: 'Profile'}}
      />
    </userTab.Navigator>
  );
}
