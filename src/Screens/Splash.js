import React, {useEffect, useContext} from 'react';
import {View, Text, Image, Dimensions, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import messaging from '@react-native-firebase/messaging';
import {UserContext, UserConsumer} from '../../App';
import {GET_USER_INFO} from '../utils/Queries';
function Splash({navigation, saveData}) {
  const {height, width} = Dimensions.get('window');
  const userContext = React.useContext(UserContext);
  const [callMe, {data: userData, loading: userLoading, error: userError}] =
    useLazyQuery(GET_USER_INFO, {fetchPolicy: 'network-only'});

  const getToken = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      setTimeout(() => {
        messaging()
          .getToken()
          .then((token) => {
            console.log('-----------------Token--------------', token);
            AsyncStorage.setItem('fcm_token', token);
          });
      }, 5000);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getItem('Accesstoken').then((data) => {
        // console.log(data);
        if (data) {
          callMe();

          getToken();
        } else {
          navigation.reset({
            index: 0,
            routes: [{name: 'signIn'}],
          });
          userContext.setData({loading: false, token: null});
        }
      });
    }, 1000);
  }, [0]);

  useEffect(() => {
    if (userData && userData.getUserProfile) {
      setUserData(userData.getUserProfile);
    }
    // console.log(JSON.stringify(userError), "in getUserProfile")
  }, [userData]);

  useEffect(() => {
    if (userError) {
      AsyncStorage.clear().then(() => {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'signIn'}],
          });
        }, 5000);
      });
    }
  }, [userError]);

  const setUserData = async (data) => {
    let token = await AsyncStorage.getItem('Accesstoken');
    userContext.setData({token: token, loading: false, profile: data});

    navigation.reset({
      index: 0,
      routes: [{name: 'tabs'}],
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <StatusBar barStyle="light-content" backgroundColor={'#fff'} />
      <Image
        source={require('../assets/Icons/big-logo.png')}
        style={{
          resizeMode: 'contain',
          height: height / 3,
          width,
          backgroundColor: '#fff',
        }}
        resizeMode={'contain'}
      />
    </View>
  );
}

export default Splash;
