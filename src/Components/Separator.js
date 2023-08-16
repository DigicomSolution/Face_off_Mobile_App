import React from 'react';
import {View} from 'react-native';
export default function separator({color, height, width}) {
  return (
    <View
      style={{
        backgroundColor: color ? color : '#e0e0e0',
        height: height ? height : 0.5,
        width: width ? width : '100%',
      }}
    />
  );
}
