import React from 'react';
import {View, Image, FlatList, TouchableOpacity} from 'react-native';

import {RegularText, SemiBoldText} from './styledTexts';
import {color} from 'react-native-reanimated';
import {transform} from 'lodash';
import Constants from '../Screens/constants.json';
export default function mentorProfilrInfo({
  icon,
  title,
  value,
  isLast,
  expandIcon,
  onPressTile,
}) {
  return (
    <TouchableOpacity
      style={[
        {flex: 1, flexDirection: 'row', paddingBottom: 10, marginBottom: 10},
        isLast
          ? {borderBottomWidth: 0, borderColor: 'red'}
          : {borderBottomWidth: 1, borderColor: '#e6e6e6'},
      ]}
      onPress={onPressTile}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Image
          source={icon}
          style={{
            width: 25,
            height: 25,
            resizeMode: 'contain',
            tintColor: '#fdac41',
          }}
        />
      </View>
      <View style={{flex: 7, justifyContent: 'center'}}>
        <RegularText style={{color: '#333'}} numberOfLines={2}>
          {title}
          {isLast}
        </RegularText>
        {value ? (
          <RegularText style={{color: '#7c8aa2'}}>{value}</RegularText>
        ) : null}
      </View>
      <View style={{justifyContent: 'center'}}>
        <Image
          source={expandIcon}
          style={{
            transform: [{rotate: '180deg'}],
            tintColor: Constants.btnColor,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
