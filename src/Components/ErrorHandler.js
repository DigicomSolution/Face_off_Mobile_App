import React, {Component} from 'react';
import Toast from 'react-native-simple-toast';

export default class ErrorHandler extends Component {
  static showError(data) {
    console.log(data);
    if (data) {
      if (data.graphQLErrors) {
        if (data.graphQLErrors.length > 0) {
          if (data.graphQLErrors[0].extensions.hasOwnProperty('errors')) {
            let object = data.graphQLErrors[0].extensions.errors[0];
            let keys = Object.keys(data.graphQLErrors[0].extensions.errors[0]);
            console.log(keys, 'keys');
            Toast.showWithGravity(
              object[keys[0]].toString(),
              Toast.LONG,
              Toast.BOTTOM,
            );
            return object.error;
          } else {
            Toast.showWithGravity(
              data.graphQLErrors[0].message.toString(),
              Toast.LONG,
              Toast.BOTTOM,
            );
          }
        }
      }
    }
  }
}
