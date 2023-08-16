import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Animated, {
  Easing,
  Transitioning,
  Transition,
} from 'react-native-reanimated';
import {gql} from 'apollo-boost';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

import Header from '../../Components/Header';
import VideoTile from '../../Components/VideoTiles';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Input from '../../Components/InputField';
import Constants from '../constants.json';
import {COMMENT_LIST} from '../../utils/Queries';
import {COMMENT_MUTATION} from '../../utils/Mutations';
import {UserContext} from '../../../App';

let forceResetLastButton = null;
const {width, height} = Dimensions.get('window');
export default function Voting({route, navigation}) {
  const {topic_id, item} = route.params;
  const userContext = useContext(UserContext);
  const [comment, setComment] = useState('');
  const [myText, setmyText] = useState('I am ready to get swiped!');
  const [gestureName, setGesture] = useState('none');
  const [height, setHeight] = useState(45);
  const [refreshing, setRefresh] = useState(false);
  const [commentArray, setCommentArray] = useState([]);

  const [
    comments,
    {data: commentData, loading: commentLoading, error: commentError},
  ] = useLazyQuery(COMMENT_LIST, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      comments({variables: {topic_id: Number(topic_id)}});
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  useEffect(() => {
    // console.log(commentData, JSON.stringify(commentError))
    if (commentData && commentData.commentList) {
      setCommentData(commentData.commentList);
    }
  }, [commentData, commentError]);

  const setCommentData = (data) => {
    setCommentArray(data);
  };

  const onSwipeLeft = (gestureState) => {
    setmyText('You swiped left!');
  };

  const onSwipeRight = (gestureState) => {
    setmyText('You swiped right!');
  };

  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    setGesture(gestureName);
    switch (gestureName) {
      case SWIPE_LEFT:
        setbackground('blue');
        break;
      case SWIPE_RIGHT:
        setbackground('yellow');
        break;
    }
  };
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const [commentVideo] = useMutation(COMMENT_MUTATION, {
    onCompleted(data) {
      if (data) {
        setComment('');
        console.log('login response data is', data);
        comments({variables: {topic_id: Number(topic_id)}});
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error));
      if (error.graphQLErrors) {
        if (error.graphQLErrors.length > 0) {
          Toast.showWithGravity(
            error.graphQLErrors[0].message.toString(),
            Toast.LONG,
            Toast.BOTTOM,
          );
        }
      }
      // ErrorHandler.showError(error);
    },
  });
  return (
    // <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Results" back={() => navigation.goBack()} />
      </View>
      <KeyboardAwareScrollView
        style={styles.body}
        bounces={false}
        keyboardShouldPersistTaps={'always'}
        extraScrollHeight={100}>
        <View style={{flex: 1}}>
          <VideoTile
            data={item}
            firstItem
            commentPress={() =>
              navigation.navigate('comments', {
                topic_id: topic_id,
                active: item.active,
              })
            }
            userProfilePress={() =>
              item.user_id != userContext.profile.id
                ? navigation.navigate('userProfile', {userId: item.user_id})
                : null
            }
            againstUserProfilePress={() =>
              item.against_user != userContext.profile.id
                ? navigation.navigate('userProfile', {
                    userId: item.against_user,
                  })
                : null
            }
            winnerImage={require('../../assets/Icons/winner.png')}
            from="results"
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: 100,
              alignItems: 'center',
            }}>
            {item.voting_type != null ? (
              item.voting_type_flag == 1 ? (
                <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/Icons/vote-1.png')}
                    style={{height: 50, width: 100}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/Icons/vote-2.png')}
                    style={{height: 50, width: 100}}
                  />
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/Icons/vote-2.png')}
                  style={{height: 50, width: 100}}
                />
              </TouchableOpacity>
            )}
            {item.voting_type != null ? (
              item.voting_type_flag == 0 ? (
                <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/Icons/vote-1.png')}
                    style={{height: 50, width: 100}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={require('../../assets/Icons/vote-2.png')}
                    style={{height: 50, width: 100}}
                  />
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity style={{flex: 1, alignItems: 'center'}}>
                <Image
                  source={require('../../assets/Icons/vote-2.png')}
                  style={{height: 50, width: 100}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
    // </TouchableWithoutFeedback>
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
});
