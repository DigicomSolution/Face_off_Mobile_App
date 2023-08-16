import React, {useState, useEffect, useContext, useRef} from 'react';
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
import {COMMENT_LIST, FEEDS_AOI} from '../../utils/Queries';
import {VOTE_MUTATION, COMMENT_MUTATION} from '../../utils/Mutations';
import Constants from '../constants.json';
import {UserContext} from '../../../App';

export default function Voting({route, navigation}) {
  const {item} = route.params;
  const flatListRef = useRef(null);
  const scrollViewRef = useRef(null);
  const userContext = useContext(UserContext);
  const [individualTopic, setIndividualTopic] = useState(item);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [gestureName, setGesture] = useState('none');
  const [feedsArray, setFeedsArray] = useState([]);

  const [
    votingfeeds,
    {data: feedsData, loading: feedsLoading, error: feedsError},
  ] = useLazyQuery(FEEDS_AOI, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      votingfeeds({
        variables: {
          page: page,
          pageSize: pageSize,
          topic_id: Number(individualTopic.id),
          type: 4,
        },
      });
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  useEffect(() => {
    votingfeeds({
      variables: {
        page: page,
        pageSize: pageSize,
        topic_id: Number(individualTopic.id),
        type: 4,
      },
    });
  }, [0]);

  useEffect(() => {
    console.log(feedsData, JSON.stringify(feedsError));
    if (feedsData && feedsData.votingFeeds) {
      setFeedsData(feedsData.votingFeeds);
    }
  }, [feedsData, feedsError]);

  const setFeedsData = (data) => {
    setFeedsArray(data);
  };

  const loadMoreData = () => {
    setPage(page + 1);
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
    voteVideo({
      variables: {
        voteInput: {
          // vote_flag: 1,
          voting_type_flag: voting_type,
          topic_id: Number(topic_id),
        },
      },
    });
  };

  const [voteVideo] = useMutation(VOTE_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('voteVideo response data is', data);
        votingfeeds({
          variables: {
            page: page,
            pageSize: pageSize,
            topic_id: Number(individualTopic.id),
            type: 4,
          },
        });
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Voting" back={() => navigation.goBack()} />
      </View>
      <ImageBackground
        source={require('../../assets/Icons/votingbg.png')}
        style={{flex: 1}}>
        <ScrollView
          style={styles.body}
          bounces={true}
          extraScrollHeight={100}
          ref={scrollViewRef}>
          <View style={{flex: 1}}>
            <VideoTile
              data={individualTopic}
              firstItem
              from="voting"
              commentPress={() =>
                navigation.navigate('comments', {
                  topic_id: individualTopic.id,
                  active: individualTopic.active,
                })
              }
              userProfilePress={() =>
                individualTopic.user_id != userContext.profile.id
                  ? navigation.navigate('userProfile', {
                      userId: individualTopic.user_id,
                    })
                  : null
              }
              againstUserProfilePress={() =>
                individualTopic.against_user != userContext.profile.id
                  ? navigation.navigate('userProfile', {
                      userId: individualTopic.against_user,
                    })
                  : null
              }
            />
          </View>
          <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
            {/* <SemiBoldText style={styles.elevatedText}>Swipe to vote</SemiBoldText> */}
            {/* <View style={{ }}> */}
            <GestureRecognizer
              onSwipeLeft={(state) => {
                setGesture('SWIPE_LEFT');
                voteUserVideo(individualTopic.id, 1);
                scrollViewRef.current.scrollTo({
                  animated: true,
                  x: 400,
                  y: 400,
                });
              }}
              onSwipeRight={(state) => {
                setGesture('SWIPE_RIGHT');
                voteUserVideo(individualTopic.id, 0);
                scrollViewRef.current.scrollTo({
                  animated: true,
                  x: 400,
                  y: 400,
                });
              }}
              config={config}
              style={{
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
                onPress={() => {
                  setGesture('SWIPE_LEFT');
                  voteUserVideo(individualTopic.id, 1);
                  scrollViewRef.current.scrollTo({
                    animated: true,
                    x: 400,
                    y: 400,
                  });
                }}
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
                onPress={() => {
                  setGesture('SWIPE_RIGHT');
                  voteUserVideo(individualTopic.id, 0);
                  scrollViewRef.current.scrollTo({
                    animated: true,
                    x: 400,
                    y: 400,
                  });
                }}
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
          </View>
          <FlatList
            data={feedsArray}
            ref={flatListRef}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => {
              return (
                <View>
                  <VideoTile
                    data={item}
                    firstItem
                    from="voting"
                    commentPress={() =>
                      navigation.navigate('comments', {
                        topic_id: item.id,
                        active: item.active,
                      })
                    }
                    userProfilePress={() =>
                      item.user_id != userContext.profile.id
                        ? navigation.navigate('userProfile', {
                            userId: item.user_id,
                          })
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
                  <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
                    <GestureRecognizer
                      onSwipeLeft={(state) => {
                        setGesture('SWIPE_LEFT');
                        voteUserVideo(item.id, 1);
                        flatListRef.current.scrollToIndex({
                          animated: true,
                          index: index + 1,
                          viewOffset: 10,
                          viewPosition: 0,
                        });
                      }}
                      onSwipeRight={(state) => {
                        setGesture('SWIPE_RIGHT');
                        voteUserVideo(item.id, 0);
                        flatListRef.current.scrollToIndex({
                          animated: true,
                          index: index + 1,
                          viewOffset: 10,
                          viewPosition: 0,
                        });
                      }}
                      config={config}
                      style={{
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
                        onPress={() => {
                          setGesture('SWIPE_LEFT');
                          voteUserVideo(item.id, 1);
                          flatListRef.current.scrollToIndex({
                            animated: true,
                            index: index + 1,
                            viewOffset: 10,
                            viewPosition: 0,
                          });
                        }}
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
                            color:
                              gestureName == 'SWIPE_LEFT' ? '#000' : '#fff',
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
                        <SemiBoldText style={{color: '#fff'}}>
                          Swipe
                        </SemiBoldText>
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
                        onPress={() => {
                          setGesture('SWIPE_RIGHT');
                          voteUserVideo(item.id, 0);
                          flatListRef.current.scrollToIndex({
                            animated: true,
                            index: index + 1,
                            viewOffset: 10,
                            viewPosition: 0,
                          });
                        }}
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
                            color:
                              gestureName == 'SWIPE_RIGHT' ? '#000' : '#fff',
                            fontSize: 12,
                            textAlign: 'center',
                          }}>
                          My Side
                        </RegularText>
                      </TouchableOpacity>
                    </GestureRecognizer>
                  </View>
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreData}
          />
        </ScrollView>
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
