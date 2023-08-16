import React from 'react';
import {TouchableOpacity, Image, Dimensions} from 'react-native';

import {RegularText} from './styledTexts';

export default function DashBoardTile({
  title,
  backgroundColor,
  icon,
  tintColor,
  onPress,
}) {
  const width = Dimensions.get('window').width;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: backgroundColor,
        paddingVertical: 10,
        width: width * 0.35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}>
      <Image
        style={{
          height: 15,
          width: 15,
          resizeMode: 'contain',
          marginRight: 5,
          tintColor: tintColor,
        }}
        source={icon}
      />
      <RegularText style={{color: tintColor, fontSize: 12}}>
        {title}
      </RegularText>
    </TouchableOpacity>
  );
}
