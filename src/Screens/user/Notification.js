import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {GET_NOTIFICATIONS} from '../../utils/Queries';
export default function notificationScreen({navigation}) {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [notificationsData, setNotifications] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [
    notification,
    {data: notificationData, loading: userLoading, error: userError},
  ] = useLazyQuery(GET_NOTIFICATIONS, {fetchPolicy: 'cache-and-network'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      notification();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    notification();
  }, [0]);
  useEffect(() => {
    // console.log(notificationData,JSON.stringify(userError))
    if (notificationData && notificationData.notificationList) {
      setNotificationData(notificationData.notificationList);
    }
  }, [notificationData, userLoading, userError]);

  const setNotificationData = async (data) => {
    setNotifications(data);
    //
  };
  useEffect(() => {
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log(remoteMessage, 'message');
      notification();
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Notifications" />
      </View>

      <View style={styles.body}>
        {/* <TouchableOpacity onPress={() => {  }} style={{alignItems:'flex-end', paddingVertical:10}}><RegularText style={{ color: Constants.primary }}>Mark all as read</RegularText></TouchableOpacity> */}
        <FlatList
          data={notificationsData}
          refreshing={userLoading}
          onRefresh={() => {
            notification();
          }}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('individualTopic', {
                    topic_id: item.topic_id,
                  });
                }}
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
                      borderWidth: !item.profile_picture ? 1 : 0,
                    }}>
                    {item.profile_picture ? (
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
                          uri: 'http://3.130.98.232/' + item.profile_picture,
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
                          {item.first_name.charAt(0).toUpperCase() +
                            item.last_name.charAt(0).toUpperCase()}
                        </SemiBoldText>
                      </View>
                    )}
                  </View>
                  <View style={{flex: 4, paddingLeft: 15}}>
                    {/* <SemiBoldText style={{fontSize:14}}>{item.first_name+" "+ item.last_name}</SemiBoldText>
                            <RegularText style={{color:'gray', fontSize:12}} numberOfLines={1}>{item.claim}</RegularText>
                            <RegularText style={{color:'gray', fontSize:12}} numberOfLines={1}>{item.message}</RegularText> */}
                    {/* {item.message.indexOf('liked')?
                            <RegularText> {item.first_name+" "+ item.last_name} is on your side in {item.claim}.</RegularText>
                            :
                            <RegularText> {item.first_name+" "+ item.last_name} commented on {item.claim}.</RegularText>
                            } */}
                    <RegularText>
                      {item.first_name + ' ' + item.last_name} {item.message}
                    </RegularText>
                  </View>
                  {/* <View style={{flex:1}}>
                            
                            <RegularText style={{color:'gray', fontSize:12}}>{item.time}</RegularText>
                            {item.type=='video'?
                            <Image 
                            source={require('../../assets/Icons/upload-video.png')}
                        />
                        :<Image 
                        source={require('../../assets/Icons/notificaion-like.png')}
                    />
                            }
                            
                            
                            
                        </View> */}
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
                <SemiBoldText>No notifications yet!</SemiBoldText>
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
