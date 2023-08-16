import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {BoldText, LightText} from '../Components/styledTexts';
import Constants from '../Screens/constants';
export class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            height: 45,
            borderRadius: 15,
            backgroundColor: Constants.btnColor,
            shadowColor: '#451B2D',
            // shadowOffset: {width: 0, height: 3},
            // shadowOpacity: 0.15,
            // shadowRadius: 5,
            // elevation: 8,
          },
          this.props.style,
        ]}
        onPress={this.props.onPress}>
        {this.props.Light ? (
          <LightText style={[{color: 'white'}, this.props.textStyle]}>
            {this.props.title}
          </LightText>
        ) : (
          <BoldText
            style={[
              {
                color: 'white',
                fontSize: 18,
              },
              this.props.textStyle,
            ]}>
            {this.props.title}
          </BoldText>
        )}
      </TouchableOpacity>
    );
  }
}

export class SelectButton extends Component {
  render() {
    return (
      <TouchableOpacity
        style={[
          {
            height: 60,
            width: 120,
            margin: 5,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: this.props.isSelected ? Colors.yellow : '#fff',
            borderWidth: 0.3,
            borderColor: Colors.yellow,
            borderRadius: 5,
          },
          this.props.containerStyle,
        ]}
        onPress={this.props.onPress}>
        <BoldText
          style={[
            {
              color: this.props.isSelected ? '#fff' : Colors.pink,
              fontWeight: '500',
              fontSize: 18,
            },
            this.props.textStyle,
          ]}>
          {this.props.value}
        </BoldText>
      </TouchableOpacity>
    );
  }
}
