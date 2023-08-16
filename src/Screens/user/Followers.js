import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import FastImage from 'react-native-fast-image';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {FOLLOWERS_LIST, FOLLOWING_LIST} from '../../utils/Queries';
export default function Followers({navigation, route}) {
  const {forData} = route.params;
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [
    followersList,
    {data: followersData, loading: userLoading, error: userError},
  ] = useLazyQuery(FOLLOWERS_LIST, {fetchPolicy: 'cache-and-network'});
  const [
    followingList,
    {data: followingData, loading: followingLoading, error: followingError},
  ] = useLazyQuery(FOLLOWING_LIST, {fetchPolicy: 'cache-and-network'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (forData == 'follower') {
        followersList();
      } else {
        followingList();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(followersData, JSON.stringify(userError));
    if (followersData && followersData.followerList) {
      setFollowersData(followersData.followerList);
    }
  }, [followersData, userLoading, userError]);

  const setFollowersData = async (data) => {
    setFollowers(data);
    //
  };

  useEffect(() => {
    console.log(followingData, JSON.stringify(userError));
    if (followingData && followingData.followingList) {
      setFollowingData(followingData.followingList);
    }
  }, [followingData, userLoading, userError]);

  const setFollowingData = async (data) => {
    console.log(data);
    setFollowing(data);
    //
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title={forData == 'follower' ? 'Followers' : 'Following'}
          back={() => navigation.goBack()}
        />
      </View>

      <View style={styles.body}>
        <FlatList
          data={forData == 'follower' ? followers : following}
          refreshing={forData == 'follower' ? userLoading : followingLoading}
          onRefresh={() => {
            forData == 'follower' ? followersList() : followingList();
          }}
          keyExtractor={(item) => item.userDetails[0].id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={{
                  marginVertical: 5,
                  padding: 10,
                  borderRadius: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      overflow: 'hidden',
                      backgroundColor: '#dddddd50',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: Constants.btnColor,
                      borderWidth: !item.userDetails[0].profile_picture ? 1 : 0,
                    }}>
                    {item.userDetails[0].profile_picture ? (
                      <FastImage
                        //  source={item.profile_picture?{uri:'http://3.130.98.232/'+item.profile_picture}:require('../assets/Icons/thumb.png')}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          overflow: 'hidden',
                          resizeMode: 'cover',
                        }}
                        source={{
                          uri:
                            'http://3.130.98.232/' +
                            item.userDetails[0].profile_picture,
                          headers: {Authorization: 'someAuthToken'},
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          overflow: 'hidden',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <SemiBoldText
                          style={{fontSize: 26, color: Constants.btnColor}}>
                          {item.userDetails[0].first_name
                            .charAt(0)
                            .toUpperCase() +
                            item.userDetails[0].last_name
                              .charAt(0)
                              .toUpperCase()}
                        </SemiBoldText>
                      </View>
                    )}
                  </View>

                  <View style={{flex: 1, paddingLeft: 15}}>
                    <SemiBoldText style={{fontSize: 18}}>
                      {item.userDetails[0].first_name}{' '}
                      {item.userDetails[0].last_name}
                    </SemiBoldText>
                  </View>
                </View>
              </TouchableOpacity>
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
                <BoldText>
                  No {forData == 'follower' ? 'followers' : 'following'} yet!
                </BoldText>
              </View>
            );
          }}
          onEndReachedThreshold={0.5}
          //   onEndReached={loadMoreData}
        />
      </View>
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
    marginVertical: 2,
    paddingHorizontal: 10,
  },
});
