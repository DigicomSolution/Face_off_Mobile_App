import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';

export default function Loader(props) {
  return props.loading ? (
    <View style={styles.loaders}>
      <ActivityIndicator size="large" style={{color: '#000'}} />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  loaders: {
    // backgroundColor: 'rgba(245,245,245, 0.7)',
    height: Dimensions.get('window').height,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
});
