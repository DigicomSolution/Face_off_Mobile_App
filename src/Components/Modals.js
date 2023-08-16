import React from 'react';
import {Modal, Text, TouchableWithoutFeedback, View} from 'react-native';

export default function Modals(props) {
  return (
    <Modal animationType={'slide'} transparent={true} visible={props.visible}>
      <TouchableWithoutFeedback onPress={() => props.close(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.7)'}}>
          <TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                marginVertical: 100,
                marginHorizontal: 10,
              }}>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
