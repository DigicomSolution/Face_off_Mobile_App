import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {BoldText, ThinText, RegularText} from '../Components/styledTexts';
import {Button} from '../Components/button';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';

import Constants from './constants.json';
import {UserContext} from '../../App';

export default function comingSoon() {
  const userContext = useContext(UserContext);
  async function doLogout() {
    await AsyncStorage.clear();
    AsyncStorage.clear().then(() => {
      RNRestart.Restart();
      userContext.setData({token: null, loading: false, userType: null});
    });
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={require('../assets/commingSoon.png')} />
      <TouchableOpacity
        style={{alignSelf: 'center', alignItems: 'center'}}
        onPress={doLogout}>
        <RegularText style={{color: Constants.primary}}>Logout</RegularText>
      </TouchableOpacity>
    </View>
  );
}
