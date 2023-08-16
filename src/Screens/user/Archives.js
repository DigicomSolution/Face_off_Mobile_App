import React, {useState, useEffect, useContext} from 'react';
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
import Toast from 'react-native-simple-toast';
import Header from '../../Components/Header';
import VideoTile from '../../Components/VideoTiles';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {UserContext} from '../../../App';
import {
  SEARCH_TOPIC,
  ARCHIVE_FEEDS,
  FILTERED_ARCHIVE,
  GET_CATEGORY,
  ARCHIVES_AOI,
} from '../../utils/Queries';
import {DELETE_YOUR_SIDE, REPOST_TOPIC} from '../../utils/Mutations';
export default function Archives({route, navigation}) {
  const userContext = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [sortById, setSortById] = useState(0);
  const [categoryList, setCategory] = useState([]);
  const [archiveArray, setArchiveArray] = useState([]);
  const [initialArchive, setInitialArchive] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [feedType, setFeedType] = useState(1);

  const [
    archives,
    {
      data: archiveData,
      loading: archiveLoading,
      error: archiveError,
      fetchMore,
    },
  ] = useLazyQuery(ARCHIVES_AOI, {fetchPolicy: 'network-only'});
  const {
    data: category,
    loading,
    error,
  } = useQuery(GET_CATEGORY, {fetchPolicy: 'cache-and-network'});
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      archives({
        variables: {
          page: page,
          pageSize: pageSize,
          claim: search,
          category_id: 1,
          type: feedType,
        },
      });
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  useEffect(() => {
    console.log(archiveData, JSON.stringify(archiveError));
    if (archiveData && archiveData.archivesList) {
      setArchiveData(archiveData.archivesList);
    }
  }, [archiveData, archiveError]);

  useEffect(() => {
    if (category && category.categoryList) {
      setCategoryData(category.categoryList);
    }
  }, [category, error]);

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
    setCategory(temp_data.concat(other_arr));
  };

  const setArchiveData = (data) => {
    setArchiveArray(data);
    setInitialArchive(data);
  };

  const searchFeeds = (e) => {
    setSearch(e);
    setFeedType(3);
    archives({
      variables: {
        page: 1,
        pageSize: pageSize,
        claim: e,
        category_id: 1,
        type: 3,
      },
    });
  };

  const sortBy = (id) => {
    setSortById(id);
    setFeedType(2);
    if (id == 0) {
      archives({
        variables: {
          page: 1,
          pageSize: pageSize,
          claim: '',
          category_id: 1,
          type: 1,
        },
      });
    } else {
      archives({
        variables: {
          page: 1,
          pageSize: pageSize,
          claim: search,
          category_id: Number(id),
          type: 2,
        },
      });
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchMore({
        variables: {
          page: page,
          pageSize: pageSize,
          claim: search,
          category_id: 1,
          type: feedType,
        },
        updateQuery: (previousResult, {fetchMoreResult}) => {
          // console.log(paramData,"request");
          // console.log("fm-----",page,previousResult,fetchMoreResult);
          if (
            !fetchMoreResult ||
            !fetchMoreResult['archivesList'] ||
            fetchMoreResult['archivesList'].length === 0
          ) {
            return previousResult;
          } else {
            return {
              archivesList: previousResult.archivesList.concat(
                fetchMoreResult.archivesList,
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

  const [deleteYourSide] = useMutation(DELETE_YOUR_SIDE, {
    onCompleted(data) {
      if (data) {
        console.log('deletedTopic response data is', data);
        Toast.showWithGravity('Topic video deleted!', Toast.LONG, Toast.BOTTOM);
        archives({
          variables: {
            page: page,
            pageSize: pageSize,
            claim: search,
            category_id: 1,
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
  const [repostTopic] = useMutation(REPOST_TOPIC, {
    onCompleted(data) {
      if (data) {
        console.log('repostTopic response data is', data);
        Toast.showWithGravity('Topic reposted!', Toast.LONG, Toast.BOTTOM);
        setTimeout(() => {
          navigation.navigate('feeds');
        }, 1000);
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
        <Header title="Archives" />
      </View>
      <View style={{padding: 4, paddingHorizontal: 20, paddingVertical: 10}}>
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
          {categoryList.length > 0 ? (
            <Menu style={{marginRight: 15}}>
              <MenuTrigger>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 10,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RegularText>Filter</RegularText>
                  <Image
                    source={require('../../assets/Icons/ic-play.png')}
                    style={{transform: [{rotate: '90deg'}], marginLeft: 10}}
                  />
                </View>
              </MenuTrigger>

              <MenuOptions
                customStyles={{optionWrapper: {width: 180}}}
                optionsContainerStyle={{width: 180, paddingVertical: 10}}>
                {categoryList.length > 0 &&
                  categoryList.map((item, idx) => {
                    return (
                      <MenuOption
                        key={item.id}
                        onSelect={() => {
                          sortById === item.id ? sortBy(0) : sortBy(item.id);
                        }}>
                        <RegularText
                          style={{
                            color:
                              sortById == item.id ? Constants.redText : 'black',
                            paddingLeft: 15,
                            marginTop: 0,
                          }}>
                          {item.name}
                        </RegularText>
                      </MenuOption>
                    );
                  })}
              </MenuOptions>

              {/* </View> */}
            </Menu>
          ) : (
            <View
              style={{
                marginRight: 15,
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                paddingVertical: 2,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <RegularText>Filter</RegularText>
              <Image
                source={require('../../assets/Icons/ic-play.png')}
                style={{transform: [{rotate: '90deg'}], marginLeft: 10}}
              />
            </View>
          )}
        </View>
      </View>
      {/* <ScrollView style={styles.body} bounces={false}> */}
      <View style={styles.bottomPart}>
        <FlatList
          data={initialArchive}
          refreshing={archiveLoading}
          onRefresh={() =>
            archives({
              variables: {
                page: 1,
                pageSize: pageSize,
                claim: '',
                category_id: 1,
                type: 1,
              },
            })
          }
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => {
            return (
              <VideoTile
                data={item}
                firstItem={index == 0 ? true : false}
                repostTopic={() =>
                  item.video
                    ? repostTopic({variables: {topic_id: Number(item.id)}})
                    : Toast.showWithGravity(
                        'Please record video first!',
                        Toast.LONG,
                        Toast.BOTTOM,
                      )
                }
                deleteTopic={() =>
                  item.video
                    ? deleteYourSide({variables: {topic_id: Number(item.id)}})
                    : Toast.showWithGravity(
                        'video already deleted!',
                        Toast.LONG,
                        Toast.BOTTOM,
                      )
                }
                onPress={() =>
                  item.video
                    ? null
                    : navigation.navigate('recordVideo', {
                        from: 'archives',
                        topic_id: item.id,
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
                claimPress={() =>
                  navigation.navigate('results', {
                    topic_id: item.id,
                    item: item,
                  })
                }
                commentPress={() =>
                  navigation.navigate('comments', {
                    topic_id: item.id,
                    active: item.active,
                  })
                }
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
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreData}
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
  body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
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
    // height:50,
    minHeight: 50,
  },
});
