import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  Easing,
  Transitioning,
  Transition,
} from 'react-native-reanimated';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import Header from '../../Components/Header';
import VideoTile from '../../Components/VideoTiles';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Input from '../../Components/InputField';
import {COMMENT_LIST} from '../../utils/Queries';
import {VOTE_MUTATION, COMMENT_MUTATION} from '../../utils/Mutations';
import Constants from '../constants.json';
import {UserContext} from '../../../App';

export default function Voting({route, navigation}) {
  const {topic_id, item} = route.params;
  const userContext = useContext(UserContext);
  const [individualTopic, setIndividualTopic] = useState(item);
  const [comment, setComment] = useState('');
  const [myText, setmyText] = useState('I am ready to get swiped!');
  const [gestureName, setGesture] = useState('none');
  const [backgroundColor, setbackground] = useState('#fff');
  const [refreshing, setRefresh] = useState(false);
  const [commentArray, setCommentArray] = useState([]);

  const [
    comments,
    {data: commentData, loading: commentLoading, error: commentError},
  ] = useLazyQuery(COMMENT_LIST, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      comments({variables: {topic_id: Number(individualTopic.id)}});
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (individualTopic && individualTopic.id) {
        if (individualTopic.voting_type_flag == 1) {
          setGesture('SWIPE_LEFT');
        } else if (individualTopic.voting_type_flag == 0) {
          setGesture('SWIPE_RIGHT');
        } else {
          setGesture('');
        }
      }
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);
  const onSwipeLeft = (gestureState) => {
    setmyText('You swiped left!');
    voteUserVideo(individualTopic.id, 1);
  };

  const onSwipeRight = (gestureState) => {
    setmyText('You swiped right!');
    voteUserVideo(individualTopic.id, 0);
  };
  //
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
    velocityThreshold: 0.5,
    directionalOffsetThreshold: 80,
  };

  const voteUserVideo = (topic_id, voting_type) => {
    console.log({
      // vote_flag: 1,
      voting_type_flag: voting_type,
      topic_id: Number(topic_id),
    });
    // voteVideo({
    //     variables: {
    //         voteInput: {
    //             // vote_flag: 1,
    //             voting_type_flag: voting_type,
    //             topic_id: Number(topic_id)
    //         }
    //     }
    // });
  };

  const [voteVideo] = useMutation(VOTE_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('voteVideo response data is', data);
        feeds();
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error));
      setGesture('none');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Voting" back={() => navigation.goBack()} />
      </View>
      <ImageBackground
        source={require('../../assets/Icons/votingbg.png')}
        style={{flex: 1}}>
        <KeyboardAwareScrollView
          style={styles.body}
          bounces={true}
          keyboardShouldPersistTaps={'always'}
          extraScrollHeight={100}>
          <View style={{flex: 1}}>
            <VideoTile
              data={item}
              firstItem
              from="voting"
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
            />
          </View>
          <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
            {/* <SemiBoldText style={styles.elevatedText}>Swipe to vote</SemiBoldText> */}
            {/* <View style={{ }}> */}
            <GestureRecognizer
              onSwipe={(direction, state) => onSwipe(direction, state)}
              onSwipeLeft={(state) => onSwipeLeft(state)}
              onSwipeRight={(state) => onSwipeRight(state)}
              config={config}
              style={{
                // backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginHorizontal: 10,
                flex: 1,
                marginVertical: 0,
                alignItems: 'center',
                flexDirection: 'row',
                height: 100,
              }}>
              <TouchableOpacity
                onPress={() => setGesture('SWIPE_LEFT')}
                style={{
                  backgroundColor:
                    gestureName == 'SWIPE_LEFT'
                      ? '#00ff00'
                      : Constants.btnColor,
                  alignItems: 'center',
                  width: 55,
                  height: 55,
                  borderRadius: 100,
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                }}>
                <RegularText
                  style={{
                    color: gestureName == 'SWIPE_LEFT' ? '#000' : '#fff',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  My Side
                </RegularText>
              </TouchableOpacity>
              <Image
                source={require('../../assets/Icons/arrow-left.png')}
                style={{
                  marginHorizontal: 20,
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
              />
              <View
                style={{
                  backgroundColor: Constants.btnColor,
                  alignItems: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <SemiBoldText style={{color: '#fff'}}>Swipe</SemiBoldText>
              </View>
              <Image
                source={require('../../assets/Icons/arrow-right.png')}
                style={{
                  marginHorizontal: 20,
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
              />
              <TouchableOpacity
                onPress={() => setGesture('SWIPE_RIGHT')}
                style={{
                  backgroundColor:
                    gestureName == 'SWIPE_RIGHT'
                      ? '#00ff00'
                      : Constants.btnColor,
                  alignItems: 'center',
                  width: 55,
                  height: 55,
                  borderRadius: 100,
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                }}>
                <RegularText
                  style={{
                    color: gestureName == 'SWIPE_RIGHT' ? '#000' : '#fff',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  My Side
                </RegularText>
              </TouchableOpacity>
            </GestureRecognizer>
            {/* <TouchableOpacity onPress={() => navigation.navigate('results', { topic_id, item: item })} style={styles.elevatedText}>
                            <SemiBoldText >Comment</SemiBoldText>
                        </TouchableOpacity> */}
            <View
              style={[
                {
                  flex: 1,
                  flexDirection: 'row',
                  minHeight: 50,
                  alignItems: 'flex-end',
                  borderWidth: 0,
                  borderColor: '#C0C0C0',
                  borderRadius: 2,
                  marginBottom: 10,
                  marginHorizontal: 20,
                  marginTop: 20,
                  elevation: 5,
                  shadowColor: '#DDDDDD',
                  shadowOffset: {width: 0, height: 5},
                  shadowRadius: 0.5,
                  shadowOpacity: 0.2,
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                },
              ]}>
              <TextInput
                textColor={'red'}
                style={{
                  paddingVertical: 10,
                  color: '#2a6b9c',
                  fontSize: 15,
                  paddingHorizontal: 10,
                  backgroundColor: '#fff',
                  position: 'relative',
                  flex: 1,
                }}
                // labelFontSize={1}
                autoCapitalize={'none'}
                editable={true}
                value={comment}
                onChangeText={(text) => {
                  setComment(text);
                }}
                placeholder={'Write a comment...'}
                placeholderTextColor={'#b2b2b2'}
                autoFocus={false}
                autoCorrect={false}
                autoCompleteType={'off'}
                maxLength={150}
                multiline={true}
              />
              <TouchableOpacity
                onPress={() => {
                  if (comment == null || comment == '') {
                  } else {
                    Keyboard.dismiss();
                    commentVideo({
                      variables: {
                        commentInput: {
                          comment: comment,
                          topic_id: Number(topic_id),
                        },
                      },
                    });
                  }
                }}
                style={{
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0,
                  borderColor: 'transparent',
                  flex: 0.2,
                  height: '100%',
                }}>
                <Image
                  source={require('../../assets/Icons/send.png')}
                  style={{width: 30, height: 30, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={commentArray}
            refreshing={refreshing}
            onRefresh={() => {
              setRefresh(true);
              setTimeout(() => {
                setRefresh(false);
              }, 3000);
            }}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    margin: 5,
                    padding: 10,
                    borderRadius: 10,
                    borderBottomWidth: commentArray.length == index + 1 ? 0 : 1,
                    borderBottomColor: '#ddd',
                  }}>
                  <View
                    style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <View style={{}}>
                      <Image
                        source={require('../../assets/Icons/thumb.png')}
                        style={{width: 40, height: 40, borderRadius: 100}}
                      />
                    </View>

                    <View style={{flex: 1, paddingLeft: 15}}>
                      <SemiBoldText style={{fontSize: 14}}>
                        {item.first_name}{' '}
                      </SemiBoldText>
                      <RegularText style={{fontSize: 12}}>
                        {item.comment}
                      </RegularText>
                    </View>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SemiBoldText>No Comments Yet!</SemiBoldText>
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
            //   onEndReached={loadMoreData}
          />
        </KeyboardAwareScrollView>
      </ImageBackground>
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
    // backgroundColor: '#fff',
  },
  topPart: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  topButtonView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topImageStripe: {
    flex: 1,
  },
  imageView: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Constants.btnColor,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  profilePicture: {
    height: 80,
    width: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  imageStripeContent: {
    flex: 5,
    paddingLeft: 10,
  },
  f1: {
    flex: 1,
  },
  imageStripeContentRow: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 2.5,
  },
  searchBox: {
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 5,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    shadowColor: '#DDDDDD',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 5,
    height: 50,
  },
  elevatedText: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    shadowColor: '#DDDDDD',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 1,
    backgroundColor: 'white',
    elevation: 5,
    marginBottom: 5,
    paddingHorizontal: 20,
    paddingTop: 4,
    width: 140,
    textAlign: 'center',
  },
});
