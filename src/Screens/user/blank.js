import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import Header from '../../Components/Header';
import {RegularText} from '../../Components/styledTexts';

export default function termsCondition({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Dashboard" NoSearch={true} />
      </View>
      <View style={styles.body} contentContainerStyle={styles.body}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 3,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 2,
    padding: 10,
  },
});
