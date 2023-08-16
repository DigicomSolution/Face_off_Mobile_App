import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Keyboard,
  FlatList,
} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import Toast from 'react-native-simple-toast';

import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import {COMMENT_LIST} from '../../utils/Queries';
import {COMMENT_MUTATION} from '../../utils/Mutations';
import Constants from '../constants.json';
import {UserContext} from '../../../App';

export default function Comments({route, navigation}) {
  const {topic_id, active} = route.params;
  const [comment, setComment] = useState('');
  const [refreshing, setRefresh] = useState(false);
  const [commentArray, setCommentArray] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [
    comments,
    {data: commentData, loading: commentLoading, error: commentError},
  ] = useLazyQuery(COMMENT_LIST, {fetchPolicy: 'network-only'});

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      comments({variables: {topic_id: Number(topic_id)}});
    });

    return unsubscribe;
    // console.log(userContext);
  }, [navigation]);

  // useEffect(() => {
  //         comments({ variables: { topic_id: Number(topic_id) } });
  // }, [0])

  useEffect(() => {
    // console.log(commentData, JSON.stringify(commentError))
    if (commentData && commentData.commentList) {
      setCommentData(commentData.commentList);
    }
  }, [commentData, commentError]);

  const setCommentData = (data) => {
    setCommentArray(data);
  };
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Comments" back={() => navigation.goBack()} />
      </View>
      {/* <ImageBackground source={require('../../assets/Icons/votingbg.png')} style={{ flex: 1 }}> */}
      <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        keyboardShouldPersistTaps={'always'}
        scrollEnabled={true}
        extraHeight={110}
        enableOnAndroid={true}
        bounce={false}>
        <View style={{flex: 9}}>
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
        </View>
        {active && (
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                alignItems: 'flex-end',
                position: 'absolute',
                bottom: 0,
                width: '99%',
              }}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    minHeight: 50,
                    alignItems: 'flex-end',
                    borderWidth: 0,
                    borderColor: '#C0C0C0',
                    borderRadius: 2,
                    marginBottom: 10,
                    marginHorizontal: 10,
                    marginTop: 10,
                    elevation: 5,
                    shadowColor: '#DDDDDD',
                    shadowOffset: {width: 0, height: 0},
                    shadowRadius: 0.5,
                    shadowOpacity: 1,
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                  },
                ]}>
                <TextInput
                  textColor={'red'}
                  style={{
                    paddingTop: 10,
                    paddingBottom: Platform.OS == 'ios' ? 15 : 10,
                    color: '#2a6b9c',
                    fontSize: 15,
                    paddingHorizontal: 10,
                    backgroundColor: '#fff',
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
          </View>
        )}
      </KeyboardAwareScrollView>
      {/* </ImageBackground> */}
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
});
