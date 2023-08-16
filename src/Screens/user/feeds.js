import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import Header from '../../Components/Header';
import VideoTile from '../../Components/DashboardVideoTiles';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {UserContext} from '../../../App';
import {
  SEARCH_TOPIC,
  VOTING_FEEDS,
  VOTING_FEEDS_SORTING,
  GET_CATEGORY,
  FEEDS_AOI,
} from '../../utils/Queries';
import {
  VOTE_MUTATION,
  REPORT_MUTATION,
  FOLLOW_MUTATION,
  UNFOLLOW_MUTATION,
} from '../../utils/Mutations';

export default function Feeds({route, navigation}) {
  const userContext = useContext(UserContext);
  const flatListRef = useRef(null);
  const [feedArray, setFeedArray] = useState([]);
  const [initialFeeds, setInitialFeeds] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [isCategory, setIsCategory] = useState(false);
  const [search, setSearch] = useState('');
  const [sortById, setSortById] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [feedType, setFeedType] = useState(1);
  const [sortName, setSortName] = useState('');
  const [filterName, setFilterName] = useState('');
  const [
    feeds,
    {data: feedData, loading: feedLoading, error: feedError, fetchMore},
  ] = useLazyQuery(FEEDS_AOI, {fetchPolicy: 'cache-and-network'});
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useQuery(GET_CATEGORY, {fetchPolicy: 'cache-and-network'});
  useEffect(() => {
    if (categoryData && categoryData.categoryList) {
      setCategoryData(categoryData.categoryList);
    }
  }, [categoryData, categoryError]);

  const setCategoryData = (data) => {
    let temp_data = [];
    let other_arr = [];
    data.map((item) => {
      if (item.name == 'Other') {
        other_arr.push(item);
      } else {
        temp_data.push(item);
      }
    });
    // console.log([...temp_data,...other_arr])
    setCategoryArray(temp_data.concat(other_arr));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      feeds({
        variables: {
          // page: page,
          // pageSize: pageSize,
          claim: search,
          isCategory: false,
          sorting_id: 1,
          type: feedType,
        },
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (page > 1) {
      fetchMore({
        variables: {
          // page: page,
          // pageSize: pageSize,
          claim: search,
          isCategory: isCategory,
          sorting_id: 1,
          type: feedType,
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          // console.log(paramData,"request");
          // console.log("fm-----",page,previousResult,fetchMoreResult);
          if (
            !fetchMoreResult ||
            !fetchMoreResult['votingFeeds'] ||
            fetchMoreResult['votingFeeds'].length === 0
          ) {
            return previousResult;
          } else {
            return {
              votingFeeds: previousResult.votingFeeds.concat(
                fetchMoreResult.votingFeeds,
              ),
            };
          }
        },
      });
    }
  }, [page]);

  const loadMoreData = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    // console.log(feedData, JSON.stringify(feedError))
    if (feedData && feedData.votingFeeds) {
      setFeedData(feedData.votingFeeds);
    }
  }, [feedData, feedError]);

  const setFeedData = (data) => {
    // console.log(data)
    setFeedArray(data);
    setInitialFeeds(data);
    // sortFeeds(data)
  };

  const searchFeeds = (e) => {
    setSearch(e);
    setFeedType(2);
    feeds({
      variables: {
        // page: 1,
        // pageSize: pageSize,
        claim: e,
        isCategory: false,
        sorting_id: 1,
        type: 2,
      },
    });
  };

  const sortBy = (id, category, name) => {
    setSortById(id);
    setIsCategory(category);

    if (category) {
      setFilterName(name);
      setSortName('');
      setFeedType(6);
    } else {
      setSortName(name);
      setFilterName('');
      setFeedType(3);
    }
    if (id == 0) {
      feeds({
        variables: {
          // page: 1,
          // pageSize: pageSize,
          claim: search,
          isCategory: category,
          sorting_id: Number(id),
          type: 1,
        },
      });
      setFilterName('');
      setSortName('');
    } else {
      if (category) {
        feeds({
          variables: {
            // page: 1,
            // pageSize: pageSize,
            claim: search,
            isCategory: category,
            sorting_id: Number(id),
            type: 6,
          },
        });
      } else {
        feeds({
          variables: {
            // page: 1,
            // pageSize: pageSize,
            claim: search,
            isCategory: category,
            sorting_id: Number(id),
            type: 3,
          },
        });
      }
    }
  };

  const voteUserVideo = (topic_id, voting_type, data) => {
    console.log({topic_id, voting_type});
    // if(data.against_video){
    voteVideo({
      variables: {
        voteInput: {
          // vote_flag: 1,
          voting_type_flag: voting_type,
          topic_id: Number(topic_id),
        },
      },
    });
    // } else {
    //     Toast.showWithGravity("Against Video isn't uploaded yet!", Toast.LONG, Toast.BOTTOM);
    // }
  };

  const [voteVideo] = useMutation(VOTE_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('voteVideo response data is', data);
        feeds({
          variables: {
            // page: page,
            // pageSize: pageSize,
            claim: search,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
        });
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

  const [reportTopic] = useMutation(REPORT_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('reportTopic response data is', data);
        Toast.showWithGravity('Topic reported!', Toast.LONG, Toast.BOTTOM);
        feeds({
          variables: {
            // page: page,
            // pageSize: pageSize,
            claim: search,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
        });
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

  const [followUser] = useMutation(FOLLOW_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('followUser response data is', data);
        Toast.showWithGravity('follow!', Toast.LONG, Toast.BOTTOM);
        feeds({
          variables: {
            // page: page,
            // pageSize: pageSize,
            claim: search,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
        });
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

  const [unfollowUser] = useMutation(UNFOLLOW_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log('unfollowUser response data is', data);
        Toast.showWithGravity('unfollow!', Toast.LONG, Toast.BOTTOM);
        feeds({
          variables: {
            // page: page,
            // pageSize: pageSize,
            claim: search,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
        });
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

  const init = () => {
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage && remoteMessage.notification) {
          navigation.navigate('notification');
        }

        console.log(JSON.stringify(remoteMessage), 'notification1');
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        JSON.stringify(remoteMessage),
        'App onNotificationOpenedApp--->>',
      );
    });
  };

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Live Feed" />
      </View>
      <View
        style={{
          padding: 4,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: 'white',
        }}>
        <View style={styles.searchBox}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 10,
            }}>
            <Image
              source={require('../../assets/Icons/search.png')}
              style={{tintColor: Constants.btnColor}}
            />
          </View>
          <View style={{flex: 1}}>
            <TextInput
              style={{flex: 1, paddingHorizontal: 10}}
              placeholder="Search"
              value={search}
              onChangeText={searchFeeds}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <Menu style={{flex: 1, marginRight: 10}}>
            <MenuTrigger>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RegularText style={{flex: 1}}>
                  {sortName ? sortName : 'Sort By'}
                </RegularText>
                <Image
                  source={require('../../assets/Icons/ic-play.png')}
                  style={{
                    transform: [{rotate: '90deg'}],
                    width: 13,
                    height: 13,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{optionWrapper: {}}}
              optionsContainerStyle={{
                paddingVertical: 10,
                width: '80%',
                marginHorizontal: 15,
              }}>
              <MenuOption
                onSelect={() => {
                  sortById === 1 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(1, false, 'Featured');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 1 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Featured
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  sortById === 2 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(2, false, 'Time Left');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 2 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Time Left
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  sortById === 3 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(3, false, 'Newest First');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 3 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Newest First
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  sortById === 4 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(4, false, 'Most Viewed');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 4 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Most Viewed
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  sortById === 5 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(5, false, 'Answered');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 5 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Answered
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={() => {
                  sortById === 6 && !isCategory
                    ? sortBy(0, false, '')
                    : sortBy(6, false, 'Unanswered');
                }}>
                <RegularText
                  style={{
                    color:
                      sortById == 6 && !isCategory
                        ? Constants.redText
                        : 'black',
                    paddingLeft: 15,
                    marginTop: 0,
                  }}>
                  Unanswered
                </RegularText>
              </MenuOption>
            </MenuOptions>
          </Menu>
          <Menu style={{flex: 1}}>
            <MenuTrigger>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 5,
                  paddingVertical: 7,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <RegularText style={{flex: 1}}>
                  {filterName ? filterName : 'Filter'}
                </RegularText>
                <Image
                  source={require('../../assets/Icons/ic-play.png')}
                  style={{
                    transform: [{rotate: '90deg'}],
                    width: 13,
                    height: 13,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </MenuTrigger>
            <MenuOptions
              customStyles={{optionWrapper: {}}}
              optionsContainerStyle={{
                width: '80%',
                marginHorizontal: 15,
                paddingVertical: 10,
              }}>
              {categoryArray.length > 0 &&
                categoryArray.map((item, idx) => {
                  return (
                    <MenuOption
                      key={item.id}
                      onSelect={() => {
                        sortById === item.id
                          ? sortBy(0, false, '')
                          : sortBy(item.id, true, item.name);
                      }}>
                      <RegularText
                        style={{
                          color:
                            sortById == item.id && isCategory
                              ? Constants.redText
                              : 'black',
                          paddingLeft: 15,
                          marginTop: 0,
                        }}>
                        {item.name}
                      </RegularText>
                    </MenuOption>
                  );
                })}
            </MenuOptions>
          </Menu>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSortById(0);
            setIsCategory(false);
            setFilterName('');
            setSortName('');
            setSearch('');
            feeds({
              variables: {
                // page: 1,
                // pageSize: pageSize,
                claim: '',
                isCategory: false,
                sorting_id: 1,
                type: 1,
              },
            });
          }}
          style={{alignItems: 'flex-end', marginTop: 10}}>
          <RegularText style={{color: Constants.btnColor}}>
            Clear Filters
          </RegularText>
        </TouchableOpacity>
      </View>
      {/* <ScrollView style={styles.body} bounces={false}> */}

      <View style={styles.bottomPart}>
        <FlatList
          ref={flatListRef}
          refreshing={feedLoading}
          onRefresh={() => {
            setSortById(0);
            setIsCategory(false);
            setFilterName('');
            setSortName('');
            setSearch('');
            feeds({
              variables: {
                // page: 1,
                // pageSize: pageSize,
                claim: '',
                isCategory: false,
                sorting_id: 1,
                type: 1,
              },
            });
          }}
          data={initialFeeds}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return (
              <VideoTile
                item={item}
                firstItem={index == 0 ? true : false}
                commentPress={() =>
                  navigation.navigate('comments', {
                    topic_id: item.id,
                    active: item.active,
                  })
                }
                claimPress={() =>
                  item.against_video
                    ? item.active
                      ? navigation.navigate('voting', {
                          topic_id: item.id,
                          item: item,
                        })
                      : navigation.navigate('results', {
                          topic_id: item.id,
                          item: item,
                        })
                    : Toast.showWithGravity(
                        'Topic is not active!',
                        Toast.LONG,
                        Toast.BOTTOM,
                      )
                }
                report={() =>
                  reportTopic({variables: {topic_id: Number(item.id)}})
                }
                follow={() =>
                  followUser({variables: {followable_id: Number(item.user_id)}})
                }
                unfollow={() =>
                  unfollowUser({
                    variables: {followable_id: Number(item.user_id)},
                  })
                }
                votePressFavour={() => {
                  voteUserVideo(item.id, 1, item);
                  if (index == initialFeeds.length - 1) {
                    console.log('last topic');
                  } else {
                    flatListRef.current.scrollToIndex({
                      animated: true,
                      index: index + 1,
                      viewOffset: 10,
                      viewPosition: 0,
                    });
                  }
                }}
                votePressAgainst={() => {
                  voteUserVideo(item.id, 0, item);
                  if (index == initialFeeds.length - 1) {
                    console.log('last topic');
                  } else {
                    flatListRef.current.scrollToIndex({
                      animated: true,
                      index: index + 1,
                      viewOffset: 10,
                      viewPosition: 0,
                    });
                  }
                }}
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
                onPress={() =>
                  item.against_video
                    ? null
                    : item.userIsResponder
                    ? navigation.navigate('recordVideo', {
                        from: 'feeds',
                        topic_id: item.id,
                      })
                    : Toast.showWithGravity(
                        'Only specific user can respond to this video',
                        Toast.LONG,
                        Toast.BOTTOM,
                      )
                }
                page={page}
                pageSize={pageSize}
                claim={search}
                feedType={feedType}
                isCategory={isCategory}
              />
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
                <RegularText> No Topics Found</RegularText>
              </View>
            );
          }}
          // onEndReachedThreshold={0.5}
          // onEndReached={(initialFeeds.length > 3) ? loadMoreData : null}
        />
      </View>
      {/* </ScrollView> */}
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
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  searchBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    alignItems: 'center',
    // shadowColor: '#DDDDDD',
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 5,
    // shadowOpacity: 1,
    backgroundColor: 'white',
    // elevation: 2,
    marginBottom: 5,
    // height:50,
    minHeight: 50,
  },
});
