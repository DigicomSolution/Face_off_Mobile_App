import React, {Component} from 'react';
import {TextInput, Dimensions, View, Image, Platform} from 'react-native';

import Constants from '../Screens/constants.json';
import {BoldText, RegularText, SemiBoldText, ThinText} from './styledTexts';
import {GestureHandlerRefContext} from '@react-navigation/stack';

export default function ActionSheet(props) {
  const {height, width} = Dimensions.get('window');
  let {style} = props;
  if (style == null || style === undefined) {
    style = {};
  }
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          minHeight: 45,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#C0C0C0',
          borderRadius: 2,
          marginVertical: 10,
        },
        props.boxStyle,
      ]}>
      <RegularText style={{fontSize: 15, color: 'gray', paddingBottom: 7}}>
        {props.label}
      </RegularText>
      {props.image ? (
        <View
          style={{
            width: 50,
            minHeight: 45,
            backgroundColor: '#feeed9',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={props.image}
            style={{
              width: 20,
              height: 20,
              borderWidth: 0,
              resizeMode: 'contain',
            }}
          />
        </View>
      ) : null}
      <TextInput
        textColor={props.textColor ? props.textColor : 'red'}
        style={[
          {
            paddingTop: props.multiline
              ? Platform.OS === 'android'
                ? 0
                : 10
              : null,
            fontFamily: 'Poppins-Regular',
            flex: 1,
            color: '#2a6b9c',
            fontSize: 15,
            paddingHorizontal: 10,
            minHeight: 45,
            backgroundColor: '#fff',
          },
          props.style,
        ]}
        // labelFontSize={1}
        autoCapitalize={props.autoCapitalize ? props.autoCapitalize : 'none'}
        editable={props.editable ? props.editable : true}
        value={props.value}
        onChangeText={
          props.onChangeText
            ? props.onChangeText
            : (e) => {
                console.log(e);
              }
        }
        placeholder={props.placeholder ? props.placeholder : null}
        placeholderTextColor={
          props.placeholderTextColor ? props.placeholderTextColor : '#b2b2b2'
        }
        autoFocus={props.autoFocus ? props.autoFocus : false}
        autoCorrect={props.autoCorrect ? props.autoCorrect : false}
        autoCompleteType={
          props.autoCompleteType ? props.autoCompleteType : 'off'
        }
        secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
        keyboardType={props.keyboardType ? props.keyboardType : 'default'}
        maxLength={props.maxLength ? props.maxLength : 150}
        multiline={props.multiline ? props.multiline : false}
        onBlur={props.onBlur}
      />
    </View>
  );
}
