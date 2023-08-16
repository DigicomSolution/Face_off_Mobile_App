import React from 'react';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';

import {SemiBoldText, BoldText} from './styledTexts';

export const Colors = {
  WHITE: '#ffffff',
  LIGHTGREEN: '#BABABA',
  GREEN: 'green',
  GRAY: '#f7f7f7',
  LIGHTGRAY: '#C7C7C7',
  DARKGRAY: '#5E5E5E',
  CGRAY: '#ececec',
  OFFLINE_GRAY: '#535353',
};

export default function Accordian(props) {
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          backgroundColor: '#f0f5f8',
          flex: 1,
          flexDirection: 'row',
          height: 50,
          width: '100%',
          borderRadius: 5,
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
        onPress={() => {
          props.openId === props.myId
            ? props.toggle(0)
            : props.toggle(props.myId);
        }}>
        <View style={{flex: 1}}>
          <Image source={props.icon} />
        </View>
        <View style={{flex: 4.5}}>
          <SemiBoldText style={{color: '#0b3060'}}>{props.title}</SemiBoldText>
        </View>
        <View style={{flex: 0.5, alignItems: 'flex-end'}}>
          <BoldText
            style={[
              props.myId === props.openId
                ? {color: '#0b3060', transform: [{rotate: '90deg'}]}
                : {color: '#0b3060'},
            ]}>
            {'>'}
          </BoldText>
        </View>
      </TouchableOpacity>
      <View style={styles.parentHr} />
      {props.openId === props.myId && (
        <View style={{flex: 1}}>{props.children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.DARKGRAY,
    paddingRight: 5,
  },
  parentHr: {
    height: 1,
    color: Colors.WHITE,
    width: '100%',
  },
});
