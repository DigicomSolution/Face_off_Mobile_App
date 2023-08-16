import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import Header from '../../Components/Header';
import VideoTile from '../../Components/VideoTiles';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import {FEEDS_AOI} from '../../utils/Queries';
import {VOTE_MUTATION} from '../../utils/Mutations';
import Constants from '../constants.json';
import {UserContext} from '../../../App';

export default function IndividualTopic({route, navigation}) {
  const {topic_id} = route.params;
  const flatListRef = useRef(null);
  const userContext = useContext(UserContext);
  const [feedsArray, setFeedsArray] = useState([]);

  const [
    votingfeeds,
    {data: feedsData, loading: feedsLoading, error: feedsError},
  ] = useLazyQuery(FEEDS_AOI, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      votingfeeds({
        variables: {
          topic_id: Number(topic_id),
          type: 5,
        },
      });
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  useEffect(() => {
    votingfeeds({
      variables: {
        topic_id: Number(topic_id),
        type: 5,
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
        votingfeeds({
          variables: {
            topic_id: Number(topic_id),
            type: 5,
          },
        });
        console.log('voteVideo response data is', data);
        Toast.showWithGravity('Voted Successfully', Toast.LONG, Toast.BOTTOM);
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
        <Header title="Notification Feed" back={() => navigation.goBack()} />
      </View>
      <ImageBackground
        source={require('../../assets/Icons/votingbg.png')}
        style={{flex: 1}}>
        <FlatList
          data={feedsArray}
          ref={flatListRef}
          refreshing={feedsLoading}
          onRefresh={() => {
            votingfeeds({
              variables: {
                topic_id: Number(topic_id),
                type: 5,
              },
            });
          }}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return (
              <View>
                <VideoTile
                  data={item}
                  firstItem
                  from="voting"
                  onPress={() =>
                    item.against_video
                      ? null
                      : item.userIsResponder
                      ? navigation.navigate('recordVideo', {
                          from: 'notificationFeed',
                          topic_id: item.id,
                        })
                      : Toast.showWithGravity(
                          'Only specific user can respond to this video',
                          Toast.LONG,
                          Toast.BOTTOM,
                        )
                  }
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
                <View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
                  <GestureRecognizer
                    onSwipeLeft={(state) => {
                      voteUserVideo(item.id, 1);
                    }}
                    onSwipeRight={(state) => {
                      voteUserVideo(item.id, 0);
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
                        voteUserVideo(item.id, 1);
                      }}
                      style={[
                        {
                          backgroundColor:
                            item.voting_type != null &&
                            item.voting_type_flag == 1
                              ? '#00ff00'
                              : Constants.btnColor,
                        },
                        styles.thumbStyle,
                      ]}>
                      <RegularText
                        style={{
                          color:
                            item.voting_type != null &&
                            item.voting_type_flag == 1
                              ? '#000'
                              : '#fff',
                          fontSize: 12,
                          textAlign: 'center',
                        }}>
                        My Side
                      </RegularText>
                    </TouchableOpacity>
                    <Image
                      source={require('../../assets/Icons/arrow-left.png')}
                      style={styles.arrowStyle}
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
                      style={styles.arrowStyle}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        voteUserVideo(item.id, 0);
                      }}
                      style={[
                        {
                          backgroundColor:
                            item.voting_type != null &&
                            item.voting_type_flag == 0
                              ? '#00ff00'
                              : Constants.btnColor,
                        },
                        styles.thumbStyle,
                      ]}>
                      <RegularText
                        style={{
                          color:
                            item.voting_type != null &&
                            item.voting_type_flag == 0
                              ? '#000'
                              : '#fff',
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
        />
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
  arrowStyle: {
    marginHorizontal: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  thumbStyle: {
    alignItems: 'center',
    width: 55,
    height: 55,
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
});
