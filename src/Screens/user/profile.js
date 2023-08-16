import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import ImagePicker from 'react-native-image-crop-picker';
import {gql} from 'apollo-boost';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';

import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import InfoTile from '../../Components/ProfileInfoTile';
import {UserContext} from '../../../App';
import ActionSheet from '../../Components/ActionSheet';
import {stateList} from '../UserInfo';
import {
  FOLLOWER_COUNT,
  FOLLOWING_COUNT,
  GET_USER_INFO,
} from '../../utils/Queries';
import {EDIT_PROFILE, INVITE_FRIENDS} from '../../utils/Mutations';

export default function profile({route, navigation}) {
  const [action, setAction] = useState(false);
  const userContext = useContext(UserContext);
  const [picture, setPicture] = useState('');
  const [follower, setFollower] = useState(null);
  const [following, setFollowing] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [nameInitials, setNameInitials] = useState('');
  const {height, width} = Dimensions.get('screen');

  const [callMe, {data: userData, loading: userLoading, error: userError}] =
    useLazyQuery(GET_USER_INFO, {fetchPolicy: 'network-only'});
  const [
    followers,
    {data: followerData, loading: followerLoading, error: followerError},
  ] = useLazyQuery(FOLLOWER_COUNT, {fetchPolicy: 'network-only'});
  const [
    followings,
    {data: followingData, loading: followingLoading, error: followingError},
  ] = useLazyQuery(FOLLOWING_COUNT, {fetchPolicy: 'network-only'});

  useEffect(() => {
    if (userContext.profile.profile_picture != null) {
      setPicture('http://3.130.98.232/' + userContext.profile.profile_picture);
    } else if (userContext.profile) {
      let initial =
        userContext.profile.first_name.charAt(0).toUpperCase() +
        userContext.profile.last_name.charAt(0).toUpperCase();
      setNameInitials(initial);
    }
  }, [userContext]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      followers();
      followings();
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  useEffect(() => {
    if (followerData && followerData.followerCount) {
      setFollower(followerData.followerCount.follower);
    }
    if (followerError && followerError.graphQLErrors) {
      if (followerError.graphQLErrors.length > 0) {
        setFollower(0);
      }
    }
  }, [followerData, followerError]);

  useEffect(() => {
    if (followingData && followingData.followingCount) {
      setFollowing(followingData.followingCount.following);
    }
    if (followingError && followingError.graphQLErrors) {
      if (followingError.graphQLErrors.length > 0) {
        setFollowing(0);
      }
    }
  }, [followingData, followingError]);

  const openCameraPicker = () => {
    // setAction(false).then(()=>{
    ImagePicker.openCamera({
      cropping: true,
      compressImageQuality: 0.4,
      includeBase64: true,
      mediaType: 'photo',
      height: 500,
      width: 500,
    }).then((image) => {
      let data = `data:${image.mime};base64,${image.data}`;
      // setPicture(data);
      setLoadingActivity(true);
      editUserProfile({
        variables: {
          editUserProfileInput: {
            profile_picture: data,
            email: userContext.profile.email,
            first_name: userContext.profile.first_name,
            last_name: userContext.profile.last_name,
          },
        },
      });
      setAction(false);
    });
    // })
  };
  const openGalary = () => {
    ImagePicker.openPicker({
      cropping: false,
      includeBase64: true,
      mediaType: 'photo',
      compressImageQuality: 0.4,
    }).then((image) => {
      let data = `data:${image.mime};base64,${image.data}`;
      // setPicture(data);
      setLoadingActivity(true);
      editUserProfile({
        variables: {
          editUserProfileInput: {
            profile_picture: data,
            email: userContext.profile.email,
            first_name: userContext.profile.first_name,
            last_name: userContext.profile.last_name,
          },
        },
      });
      setAction(false);
    });
  };

  const nameExtractor = () => {
    setPicture('');
    let initial =
      userContext.profile.first_name.charAt(0).toUpperCase() +
      ' ' +
      userContext.profile.last_name.charAt(0).toUpperCase();
    setNameInitials(initial);
    editUserProfile({
      variables: {
        editUserProfileInput: {
          profile_picture: null,
          email: userContext.profile.email,
          first_name: userContext.profile.first_name,
          last_name: userContext.profile.last_name,
        },
      },
    });
    setAction(false);
  };

  const appLogo = () => {
    setPicture(Constants.applogo);
    setLoadingActivity(true);
    editUserProfile({
      variables: {
        editUserProfileInput: {
          profile_picture: Constants.applogo,
          email: userContext.profile.email,
          first_name: userContext.profile.first_name,
          last_name: userContext.profile.last_name,
        },
      },
    });
    setAction(false);
  };

  async function doLogout() {
    AsyncStorage.clear().then(() => {
      RNRestart.Restart();
      // userContext.setData({ token: null, loading: false, userType: null })
    });
  }

  const [editUserProfile] = useMutation(EDIT_PROFILE, {
    onCompleted(data) {
      setLoadingActivity(false);
      if (data) {
        setData(data.editUserProfile);
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error), 'error');
      setLoadingActivity(false);
    },
  });

  const setData = async (data) => {
    let token = await AsyncStorage.getItem('Accesstoken');
    userContext.setData({token: token, loading: false, profile: data});
    setLoadingActivity(false);
    console.log(data);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Please install the app Face Off. ${
          Platform.OS == 'android' ? 'http://onelink.to/yjxu33' : ''
        }`,
        title: 'Join Face Off',
        url: 'http://onelink.to/yjxu33',
      });
      console.log({result});
      if (result.action === Share.sharedAction) {
        // if (result.activityType) {
        // shared with activity type of result.activityType
        inviteFriends();
        // } else {
        //   // shared
        // }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [inviteFriends] = useMutation(INVITE_FRIENDS, {
    onCompleted(data) {
      if (data) {
        callMe();
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error), 'error');
      setLoadingActivity(false);
    },
  });

  useEffect(() => {
    if (userData && userData.getUserProfile) {
      setUserData(userData.getUserProfile);
    }
    // console.log(JSON.stringify(userError), "in getUserProfile")
  }, [userData]);

  const setUserData = async (data) => {
    let token = await AsyncStorage.getItem('Accesstoken');
    userContext.setData({token: token, loading: false, profile: data});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Profile" />
      </View>
      <ScrollView style={styles.body} bounces={false}>
        <View style={styles.topPart}>
          <View style={styles.topImageStripe}>
            <TouchableOpacity
              onPress={() => {
                setAction(true);
              }}
              style={styles.imageView}>
              {loadingActivity ? (
                <ActivityIndicator size="large" color={Constants.btnColor} />
              ) : picture !== '' ? (
                <Image
                  source={{uri: picture}}
                  style={styles.imageStyle}
                  onLoad={() => {
                    return (
                      <ActivityIndicator
                        size="large"
                        color={Constants.btnColor}
                      />
                    );
                  }}
                />
              ) : nameInitials !== '' ? (
                <View
                  style={[
                    styles.imageStyle,
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <SemiBoldText
                    style={{fontSize: 36, color: Constants.btnColor}}>
                    {nameInitials}
                  </SemiBoldText>
                </View>
              ) : (
                <Image
                  source={require('../../assets/Icons/thumb.png')}
                  style={styles.imageStyle}
                />
              )}
              <Image
                source={require('../../assets/Icons/edit.png')}
                style={{
                  width: 30,
                  height: 30,
                  position: 'absolute',
                  right: 15,
                  top: 0,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: 10,
            justifyContent: 'center',
          }}>
          <RegularText>
            {userContext.profile.first_name} {userContext.profile.last_name}
          </RegularText>
          <RegularText>Age: {userContext.profile.age}</RegularText>
          <RegularText style={{textAlign: 'center'}}>
            Location: {userContext.profile.city},{' '}
            {stateList[userContext.profile.state].label}
          </RegularText>
        </View>

        <View style={styles.pointsCard}>
          <View style={{alignItems: 'center'}}>
            <BoldText>{userContext.profile.points}</BoldText>
            <RegularText style={{color: 'gray'}}>Points</RegularText>
            <TouchableOpacity
              onPress={() => navigation.navigate('buyPoints')}
              style={{
                alignItems: 'center',
                backgroundColor: Constants.btnColor,
                width: 80,
                borderRadius: 5,
                marginTop: 5,
              }}>
              <RegularText style={{color: 'white'}}>Buy Points</RegularText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('followers', {forData: 'follower'})
            }
            style={{
              alignItems: 'center',
              borderRightWidth: 1,
              borderLeftWidth: 1,
              paddingHorizontal: 15,
              borderRightColor: '#ddd',
              borderLeftColor: '#ddd',
            }}>
            <BoldText>{follower ? follower : 0}</BoldText>
            <RegularText style={{color: 'gray'}}>Followers</RegularText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('followers', {forData: 'following'})
            }
            style={{alignItems: 'center'}}>
            <BoldText>{following ? following : 0}</BoldText>
            <RegularText style={{color: 'gray'}}>Following</RegularText>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPart}>
          <BoldText style={{marginBottom: 5}}>Basic Information</BoldText>
          <InfoTile
            icon={require('../../assets/Icons/user-profile.png')}
            title="Edit Profile"
            // value={userContext.profile.email}
            expandIcon={require('../../assets/Icons/back-button.png')}
            onPressTile={() =>
              navigation.navigate('userInfo', {from: 'profile'})
            }
          />
          {/* <InfoTile 
                        icon={require('../../assets/Icons/followers.png')}
                        title="Followers"
                        onPressTile={()=> navigation.navigate('followers')}
                    /> */}
          <InfoTile
            icon={require('../../assets/Icons/share.png')}
            title="Invite Friends"
            onPressTile={() => onShare()}
          />
          <InfoTile
            icon={require('../../assets/Icons/about-us.png')}
            title="Feedback"
            onPressTile={() => navigation.navigate('feedback')}
          />
          <InfoTile
            icon={require('../../assets/Icons/BLOCK-USER.png')}
            title="Blocked Users"
            onPressTile={() => navigation.navigate('unblock')}
          />
          <InfoTile
            icon={require('../../assets/Icons/app.png')}
            title="IN-APP Purchases"
            onPressTile={() => navigation.navigate('purchases')}
          />
          <InfoTile
            icon={require('../../assets/Icons/help.png')}
            title="Help"
            onPressTile={() => navigation.navigate('help')}
          />
          <InfoTile
            icon={require('../../assets/Icons/about-us.png')}
            title="Terms and Conditions"
            onPressTile={() => navigation.navigate('termsCondition')}
          />
          <InfoTile
            icon={require('../../assets/Icons/help.png')}
            title="Contact Us"
            onPressTile={() => Linking.openURL('mailto:isideapp@gmail.com')}
          />
          <InfoTile
            icon={require('../../assets/Icons/logout.png')}
            title="Logout"
            onPressTile={doLogout}
            isLast
          />
        </View>
        <ActionSheet
          visible={action}
          setVisible={setAction}
          Heading={'Select a source for image'}
          button={[
            {
              id: '1',
              title: 'Camera',
              icon: require('../../assets/Icons/cameraPicker.png'),
              onPress: openCameraPicker,
            },
            {
              id: '2',
              title: 'Gallery',
              icon: require('../../assets/Icons/image.png'),
              onPress: openGalary,
            },
            {
              id: '3',
              title: 'Use App Logo',
              icon: require('../../assets/Icons/image.png'),
              onPress: appLogo,
            },
            {
              id: '4',
              title: 'Use Name Initials',
              icon: require('../../assets/Icons/image.png'),
              onPress: nameExtractor,
            },
          ]}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  topImageStripe: {
    flex: 1,
  },
  imageView: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: Constants.btnColor,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  pointsCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 5,
    marginHorizontal: Dimensions.get('window').width * 0.04,
    borderColor: '#EEEEEE',
    alignItems: 'center',
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
