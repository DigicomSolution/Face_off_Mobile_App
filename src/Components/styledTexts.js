import React, {Component} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import _ from 'lodash';

export class BoldText extends Component {
  render() {
    let {style} = this.props;
    if (style === null || style === undefined) {
      style = {};
    }
    return (
      <Text
        style={[
          {color: '#000', fontSize: 20, fontFamily: 'Poppins-Bold'},
          style,
        ]}
        numberOfLines={
          this.props.numberOfLines ? this.props.numberOfLines : null
        }>
        {this.props.children}
      </Text>
    );
  }
}

export class RegularText extends Component {
  render() {
    let {style} = this.props;
    if (style === null || style === undefined) {
      style = {};
    }
    return (
      <Text
        style={[{color: '#000', fontFamily: 'Poppins-Regular'}, style]}
        onPress={this.props.onPress}
        numberOfLines={
          this.props.numberOfLines ? this.props.numberOfLines : null
        }>
        {this.props.children}
      </Text>
    );
  }
}
export class SemiBoldText extends Component {
  render() {
    let {style} = this.props;
    if (style === null || style === undefined) {
      style = {};
    }
    return (
      <Text
        style={[{color: '#000', fontFamily: 'Poppins-SemiBold'}, style]}
        onPress={this.props.onPress}
        numberOfLines={
          this.props.numberOfLines ? this.props.numberOfLines : null
        }>
        {this.props.children}
      </Text>
    );
  }
}
export class ThinText extends Component {
  render() {
    let {style} = this.props;
    if (style === null || style === undefined) {
      style = {};
    }
    return (
      <Text
        style={[{color: '#000', fontFamily: 'Poppins-Thin'}, style]}
        onPress={this.props.onPress}
        numberOfLines={
          this.props.numberOfLines ? this.props.numberOfLines : null
        }>
        {this.props.children}
      </Text>
    );
  }
}
