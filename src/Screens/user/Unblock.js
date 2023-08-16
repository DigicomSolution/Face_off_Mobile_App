import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Header from '../../Components/Header';
import Toast from 'react-native-simple-toast';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';
import {GET_BLOCKED_LIST} from '../../utils/Queries';
import {UNBLOCK_USER} from '../../utils/Mutations';

export default function Unblock({navigation}) {
  const [blockData, setBlockList] = useState([]);
  const [
    blockList,
    {data: blockListData, loading: userLoading, error: userError},
  ] = useLazyQuery(GET_BLOCKED_LIST, {fetchPolicy: 'cache-and-network'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      blockList();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    blockList();
  }, [0]);
  useEffect(() => {
    // console.log(blockListData,JSON.stringify(userError))
    if (blockListData && blockListData.blockList) {
      setBlockListData(blockListData.blockList);
    }
  }, [blockListData, userLoading, userError]);

  const setBlockListData = async (data) => {
    setBlockList(data);
    //
  };

  const [unblockUser] = useMutation(UNBLOCK_USER, {
    onCompleted(data) {
      if (data) {
        console.log(data);
        blockList();
        Toast.showWithGravity('User unblocked!', Toast.LONG, Toast.BOTTOM);
        setTimeout(() => {
          // navigation.goBack();
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
        <Header title="Blocked Users" back={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <FlatList
          data={blockData}
          refreshing={userLoading}
          onRefresh={() => {
            blockList();
          }}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  marginBottom: 5,
                  padding: 10,
                  borderRadius: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ddd',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      overflow: 'hidden',
                      backgroundColor: '#dddddd40',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: Constants.btnColor,
                      borderWidth: !item.profile_picture ? 1 : 0,
                    }}>
                    {item.profile_picture ? (
                      <FastImage
                        //  source={item.profile_picture?{uri:'http://3.130.98.232/'+item.profile_picture}:require('../assets/Icons/thumb.png')}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
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
                          width: 40,
                          height: 40,
                          borderRadius: 20,
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
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('userProfile', {userId: item.id})
                    }
                    style={{flex: 4, paddingLeft: 15}}>
                    <RegularText>
                      {' '}
                      {item.first_name + ' ' + item.last_name}
                    </RegularText>
                  </TouchableOpacity>
                  <View style={{}}>
                    {/* <Button 
                                title="Unblock"
                                onPress={() => unblockUser({variables:{blocked_user: Number(route.params.userId)}})}
                                style={{  width:100, borderRadius: 10, height: 35, backgroundColor:Constants.btnColor }} 
                            /> */}
                    <TouchableOpacity
                      onPress={() =>
                        unblockUser({
                          variables: {blocked_user: Number(item.id)},
                        })
                      }>
                      <Image
                        source={require('../../assets/Icons/unblock-user.png')}
                        style={{width: 30, height: 30, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
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
                <SemiBoldText>No user blocked yet!</SemiBoldText>
              </View>
            );
          }}
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
