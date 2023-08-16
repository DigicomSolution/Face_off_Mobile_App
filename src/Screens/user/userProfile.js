import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Toast from 'react-native-simple-toast';

import Header from '../../Components/Header';
import VideoTile from '../../Components/VideoTiles';
import {Button} from '../../Components/button';
import Loader from '../../Components/Loader';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {UserContext} from '../../../App';
import {USER_PROFILE} from '../../utils/Queries';
import {
  FOLLOW_MUTATION,
  UNFOLLOW_MUTATION,
  BLOCK_USER,
} from '../../utils/Mutations';

export default function UserProfile({route, navigation}) {
  const [userProfileData, setProfileData] = useState([]);
  const [
    userProfile,
    {data: userData, loading: userLoading, error: userError},
  ] = useLazyQuery(USER_PROFILE, {fetchPolicy: 'cache-and-network'});
  useEffect(() => {
    if (route.params.userId) {
    } else {
      navigation.goBack();
    }
  }, [route]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      userProfile({variables: {user_id: Number(route.params.userId)}});
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    userProfile({variables: {user_id: Number(route.params.userId)}});
  }, []);
  useEffect(() => {
    if (userData && userData.getUserProfileById) {
      setData(userData.getUserProfileById);
    }
  }, [userData, userError]);

  const setData = (data) => {
    setProfileData(data);
  };

  const [followUser] = useMutation(FOLLOW_MUTATION, {
    onCompleted(data) {
      if (data) {
        Toast.showWithGravity('follow!', Toast.LONG, Toast.BOTTOM);
        userProfile({variables: {user_id: Number(route.params.userId)}});
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
        Toast.showWithGravity('unfollow!', Toast.LONG, Toast.BOTTOM);
        userProfile({variables: {user_id: Number(route.params.userId)}});
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

  const [blockUser] = useMutation(BLOCK_USER, {
    onCompleted(data) {
      if (data) {
        Toast.showWithGravity('User Blocked!', Toast.LONG, Toast.BOTTOM);
        setTimeout(() => {
          navigation.goBack();
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
        <Header title="User Profile" back={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.body} bounces={false}>
        <View style={styles.topPart}>
          <View style={styles.topImageStripe}>
            <View style={styles.imageView}>
              {userProfileData.profile_picture !== null ? (
                <Image
                  source={{
                    uri:
                      'http://3.130.98.232/' + userProfileData.profile_picture,
                  }}
                  style={styles.imageStyle}
                />
              ) : (
                <View
                  style={[
                    styles.imageStyle,
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <SemiBoldText
                    style={{fontSize: 36, color: Constants.btnColor}}>
                    {userProfileData.first_name.charAt(0).toUpperCase() +
                      userProfileData.last_name.charAt(0).toUpperCase()}
                  </SemiBoldText>
                </View>
              )}
            </View>
            <View style={{flex: 1, paddingLeft: 20}}>
              <RegularText>
                {userProfileData.first_name} {userProfileData.last_name}
              </RegularText>
              <RegularText>Age: {userProfileData.age}</RegularText>
              <RegularText style={{}}>
                Location: {userProfileData.city},{' '}
                {stateList[userProfileData.state]}
              </RegularText>
              <Button
                title="Block"
                onPress={() =>
                  blockUser({
                    variables: {blocked_user: Number(route.params.userId)},
                  })
                }
                style={{
                  width: 100,
                  borderRadius: 10,
                  height: 35,
                  backgroundColor: Constants.btnColor,
                }}
              />
            </View>
          </View>
          <View style={styles.pointsCard}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                borderRightWidth: 1,
                borderRightColor: '#ddd',
              }}>
              <BoldText>{userProfileData.points}</BoldText>
              <RegularText style={{color: 'gray'}}>Points</RegularText>
            </View>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Button
                title={userProfileData.isFollow ? 'Unfollow' : 'Follow'}
                onPress={() => {
                  userProfileData.isFollow
                    ? unfollowUser({
                        variables: {followable_id: Number(route.params.userId)},
                      })
                    : followUser({
                        variables: {followable_id: Number(route.params.userId)},
                      });
                }}
                style={{
                  alignSelf: 'center',
                  width: 100,
                  borderRadius: 10,
                  height: 35,
                  backgroundColor: Constants.btnColor,
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginTop: 25,
              borderBottomWidth: 1,
              borderBottomColor: Constants.btnColor,
              justifyContent: 'center',
              paddingBottom: 5,
            }}>
            <Image source={require('../../assets/Icons/feeds.png')} />
            <RegularText style={{paddingLeft: 10, paddingTop: 2}}>
              Topics
            </RegularText>
          </View>
        </View>
        <View style={styles.bottomPart}>
          <FlatList
            refreshing={userLoading}
            onRefresh={() =>
              userProfile({variables: {user_id: Number(route.params.userId)}})
            }
            data={userProfileData.feedsList}
            keyExtractor={(item) => item.id}
            renderItem={({item, index}) => {
              return (
                <VideoTile
                  data={item}
                  firstItem={index == 0 ? true : false}
                  from="profile"
                  commentPress={() =>
                    navigation.navigate('results', {
                      topic_id: item.id,
                      item: item,
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
                    marginVertical: 20,
                  }}>
                  <RegularText> No Topics Found</RegularText>
                </View>
              );
            }}
            // onEndReachedThreshold={0.5}
            // onEndReached={loadMoreData}
          />
        </View>
      </ScrollView>
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
  topPart: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
  topImageStripe: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Constants.btnColor,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  pointsCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 5,
    borderColor: '#EEEEEE',
    padding: 10,
    shadowColor: '#DDDDDD',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 10,
    backgroundColor: 'white',
    elevation: 5,
    marginBottom: 5,
    marginTop: 10,
  },
});

let stateList = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District Of Columbia',
  'Federated States Of Micronesia',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Marshall Islands',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Northern Mariana Islands',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Islands',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];
