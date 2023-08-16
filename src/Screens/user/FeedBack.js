import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Text,
  ImageBackground,
} from 'react-native';

import Toast from 'react-native-simple-toast';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Stars from 'react-native-stars';
import Header from '../../Components/Header';
import {Button} from '../../Components/button';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import Input from '../../Components/InputField';
import Loader from '../../Components/Loader';
import {CREATE_FEEDBACK} from '../../utils/Mutations';

export default function Feedback({route, navigation}) {
  const [message, setMessage] = useState('');
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [rating, setRating] = useState(5);

  const postFeedback = async () => {
    if (message === null || message === '') {
      Toast.showWithGravity('Please type message!', Toast.LONG, Toast.BOTTOM);
    } else {
      console.log({rating, message});
      setLoadingActivity(true);
      feedback({
        variables: {
          rating: rating,
          message: message,
        },
      });
    }
  };

  const [feedback] = useMutation(CREATE_FEEDBACK, {
    onCompleted(data) {
      if (data) {
        setLoadingActivity(false);

        Toast.showWithGravity('Feedback Posted!!', Toast.LONG, Toast.BOTTOM);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error), 'error');
      //   if (error.graphQLErrors) {
      //     if (error.graphQLErrors.length > 0) {
      //       Toast.showWithGravity(error.graphQLErrors[0].message.toString(), Toast.LONG, Toast.BOTTOM);
      //     }
      //   }
      setLoadingActivity(false);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Give Feedback" back={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.body} bounces={false}>
        <View style={styles.bottomPart}>
          <Text style={[styles.textStyle, {marginTop: 0}]}>Rate Us</Text>
          <View
            style={{
              alignItems: 'flex-start',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}>
            <Stars
              default={rating}
              count={5}
              spacing={4}
              starSize={40}
              // half={true}
              update={(val) => {
                setRating(val);
              }}
              fullStar={
                <Image source={require('../../assets/Icons/star-color.png')} />
              }
              emptyStar={
                <Image
                  source={require('../../assets/Icons/star-gray.png')}
                  style={{}}
                />
              }
            />
          </View>

          <Text style={[styles.textStyle, {paddingTop: 0}]}>
            Write a review
          </Text>

          <Input
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Message..."
            multiline={true}
            maxLength={500}
            style={{paddingBottom: 10, height: 150}}
          />
          <Button
            title={'Post Feedback'}
            onPress={() => {
              loadingActivity ? null : postFeedback();
            }}
            style={{
              alignSelf: 'center',
              marginVertical: 60,
              width: Dimensions.get('screen').width * 0.8,
              borderRadius: 10,
              minHeight: 50,
              backgroundColor: loadingActivity
                ? '#fdac4150'
                : Constants.btnColor,
            }}
          />
        </View>
      </ScrollView>
      <Loader loading={loadingActivity} />
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
    borderBottomColor: Constants.btnColor,
    borderBottomWidth: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  textStyle: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    // color: 'gray'
  },
});
