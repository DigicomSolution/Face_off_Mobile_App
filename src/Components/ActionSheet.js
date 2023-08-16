import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
  FlatList,
  InputAccessoryView,
} from 'react-native';

import Constants from '../Screens/constants';
import {BoldText, RegularText, SemiBoldText, ThinText} from './styledTexts';
import {GestureHandlerRefContext} from '@react-navigation/stack';

export default function ActionSheet({
  visible,
  setVisible,
  Heading,
  button,
  style,
}) {
  const {height, width} = Dimensions.get('window');
  return (
    <Modal
      animated={true}
      animationType={'fade'}
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <TouchableWithoutFeedback
        style={{backgroundColor: 'red'}}
        onPress={() => setVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <TouchableWithoutFeedback>
            <View
              style={[
                {
                  height: 300,
                  width,
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: 0,
                  padding: 10,
                },
                style,
              ]}>
              <RegularText style={{fontSize: 16}}>{Heading}</RegularText>
              <FlatList
                data={button}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      borderColor: 'gray',
                      borderWidth: 0,
                      alignItems: 'center',
                      padding: 10,
                    }}
                    onPress={async () => {
                      item.onPress();
                    }}>
                    {item.icon ? <Image source={item.icon} /> : null}
                    <RegularText style={{paddingHorizontal: 10}}>
                      {item.title}
                    </RegularText>
                  </TouchableOpacity>
                )}
                ListFooterComponent={() => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        borderColor: 'gray',
                        borderWidth: 0,
                        alignItems: 'center',
                        padding: 10,
                      }}
                      onPress={() => setVisible(false)}>
                      <Image source={require('../assets/Icons/Cancel.png')} />
                      <RegularText style={{paddingHorizontal: 10}}>
                        Close
                      </RegularText>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
