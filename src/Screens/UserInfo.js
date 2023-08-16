import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  FlatList,
  TextInput,
  Dimensions,
  Appearance,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {TextInputMask} from 'react-native-masked-text';
import Toast from 'react-native-simple-toast';
import {gql} from 'apollo-boost';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import {RegularText, BoldText, SemiBoldText} from '../Components/styledTexts';
import ModalPicker from '../Components/searchModalPicker';
import ErrorHandler from '../Components/ErrorHandler';
import ActionSheet from '../Components/ActionSheet';
import Constants from './constants.json';
import Input from '../Components/InputField';
import {Button} from '../Components/button';
import Header from '../Components/Header';
import {UserContext} from '../../App';
import Loader from '../Components/Loader';
import {EDIT_PROFILE, CREATE_PROFILE} from '../utils/Mutations';

export default function Profile({navigation, route}) {
  const [action, setAction] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const formatterRef = useRef(null);
  const userContext = useContext(UserContext);
  const [picture, setPicture] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [showDatePicker, setDatePicker] = useState(false);
  const [nameInitials, setNameInitials] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState(0);
  const {height, width} = Dimensions.get('screen');

  // useEffect(() => {
  //   if (route.params.from == 'profile') {
  //     setPicture('http://3.130.98.232/' + userContext.profile.profile_picture)
  //     setFirstName(userContext.profile.first_name)
  //     setLastName(userContext.profile.last_name)
  //     setEmail(userContext.profile.email)
  //     setPhone(userContext.profile.phone)
  //     setAge(moment(userContext.profile.dob).format('MMM DD, YYYY'))
  //     setCity(userContext.profile.city)
  //     setState(userContext.profile.state)
  //   }
  // }, [0])
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params.from == 'profile') {
        // console.log(userContext.profile)
        if (userContext.profile.profile_picture) {
          setPicture(
            'http://3.130.98.232/' + userContext.profile.profile_picture,
          );
        }

        setFirstName(userContext.profile.first_name);
        setLastName(userContext.profile.last_name);
        setEmail(userContext.profile.email);
        // setMaskedPhone(userContext.profile.phone)
        // setPhone(userContext.profile.phone)
        setAge(moment(userContext.profile.dob).format('MMM DD, YYYY'));
        setCity(userContext.profile.city);
        setState(userContext.profile.state);
        let initial =
          userContext.profile.first_name.charAt(0).toUpperCase() +
          ' ' +
          userContext.profile.last_name.charAt(0).toUpperCase();
        setNameInitials(initial);
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
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
      setPicture(data);
      setNameInitials('');
      setAction(false);
    });
    // })
  };
  // console.log(picture)
  const openGalary = () => {
    ImagePicker.openPicker({
      cropping: false,
      includeBase64: true,
      mediaType: 'photo',
      compressImageQuality: 0.4,
    }).then((image) => {
      let data = `data:${image.mime};base64,${image.data}`;
      setPicture(data);
      setNameInitials('');
      setAction(false);
    });
  };

  const nameExtractor = () => {
    setPicture('');
    let initial =
      firstName.charAt(0).toUpperCase() +
      ' ' +
      lastName.charAt(0).toUpperCase();
    setNameInitials(initial);
    setPicture('');
    setAction(false);
  };

  const appLogo = () => {
    let logo = require('../assets/Icons/big-logo.png');
    setPicture(Constants.applogo);
    setNameInitials('');
    setAction(false);
  };
  const editProfile = async () => {
    AsyncStorage.getItem('Accesstoken').then((data) => {
      if (data) {
        if (firstName == '') {
          Toast.showWithGravity(
            'Please enter first name!',
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else if (lastName == '') {
          Toast.showWithGravity(
            'Please enter last name!',
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else if (email == '') {
          Toast.showWithGravity(
            'Please enter email address!',
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else if (reg.test(email) === false) {
          Toast.showWithGravity(
            'Please enter valid email address',
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else if (picture === null || (picture === '' && nameInitials == '')) {
          Toast.showWithGravity(
            'Please upload profile picture',
            Toast.LONG,
            Toast.BOTTOM,
          );
        } else {
          setLoadingActivity(true);
          let temp_data = {
            email,
            first_name: firstName,
            last_name: lastName,
            city: city,
            state: state,
            // age: moment(age).format("MM/DD/YYYY")
          };
          if (age) {
            temp_data['dob'] = moment(age).format('MM/DD/YYYY');
          }
          if (picture.length > 200) {
            temp_data['profile_picture'] = picture;
          }

          if (nameInitials != '') {
            temp_data['profile_picture'] = null;
          }
          if (route.params.from == 'profile') {
            console.log(temp_data, 'temp_data');
            editUserProfile({
              variables: {
                editUserProfileInput: temp_data,
              },
            });
          } else {
            createProfile({
              variables: {
                createUserProfileInput: temp_data,
              },
            });
          }
        }
      }
    });
  };
  const [createProfile] = useMutation(CREATE_PROFILE, {
    onCompleted(data) {
      if (data) {
        setData(data.createUserProfile);
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error), 'error');
      //   if (error.graphQLErrors) {
      //     if (error.graphQLErrors.length > 0) {
      //       Toast.showWithGravity(error.graphQLErrors[0].message.toString(), Toast.LONG, Toast.BOTTOM);
      //     }
      //   }
      //   console.log(form, 'form');
      // setData({})
      setLoadingActivity(false);
      //   ErrorHandler.showError(error);
    },
  });

  const [editUserProfile] = useMutation(EDIT_PROFILE, {
    onCompleted(data) {
      if (data) {
        console.log('*********', data, '***********');
        setEditData(data.editUserProfile);
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
    navigation.reset({
      index: 0,
      routes: [{name: 'tabs'}],
    });
  };

  const setEditData = async (data) => {
    let token = await AsyncStorage.getItem('Accesstoken');
    userContext.setData({token: token, loading: false, profile: data});
    setTimeout(() => {
      setLoadingActivity(false);
      navigation.goBack();
    }, 1000);
  };
  return (
    <View style={styles.container}>
      {route.params.from == 'profile' ? (
        <View style={styles.header}>
          <Header title="Edit Profile" back={() => navigation.goBack()} />
        </View>
      ) : null}
      <KeyboardAwareScrollView
        style={styles.body}
        bounces={true}
        extraHeight={300}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          {route.params.from == 'login' ? (
            <RegularText style={{fontSize: 20}}>Profile</RegularText>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              setAction(true);
            }}
            style={{marginTop: 10}}>
            {picture !== '' ? (
              <Image
                source={{uri: picture}}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: '#ddd',
                  resizeMode: 'cover',
                }}
              />
            ) : nameInitials !== '' ? (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: Constants.btnColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <SemiBoldText style={{fontSize: 36, color: Constants.btnColor}}>
                  {nameInitials}
                </SemiBoldText>
              </View>
            ) : (
              <Image
                source={require('../assets/Icons/Bitmap.png')}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}
              />
            )}
          </TouchableOpacity>
          <RegularText
            style={{fontSize: 20, color: Constants.btnColor, marginTop: 15}}>
            Upload Photo
          </RegularText>
        </View>
        <Loader loading={loadingActivity} />
        <View style={styles.topPart}>
          <BoldText>Contact Info</BoldText>
          <Input
            placeholder={'First Name'}
            image={require('../assets/Icons/user.png')}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
          <Input
            placeholder={'Last Name'}
            image={require('../assets/Icons/user.png')}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />

          <TouchableOpacity
            onPress={() => setDatePicker(!showDatePicker)}
            style={[
              {
                flexDirection: 'row',
                minHeight: 45,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#C0C0C0',
                borderRadius: 2,
                marginVertical: 10,
                justifyContent: 'center',
              },
            ]}>
            {/* <RegularText style={{fontSize:15,color:'gray',paddingBottom:7}}>{(props.label)}</RegularText> */}
            <View
              style={{
                width: 50,
                minHeight: 45,
                backgroundColor: '#feeed9',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../assets/Icons/calendar.png')}
                style={{
                  width: 20,
                  height: 20,
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  right: 15,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: '#fff',
                height: 45,
              }}>
              <RegularText
                style={{
                  color: age ? '#2a6b9c' : '#b2b2b2',
                  fontSize: 15,
                  paddingHorizontal: 10,
                }}>
                {age ? age : 'Age'}
              </RegularText>
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showDatePicker}
            maximumDate={new Date()}
            mode="date"
            customHeaderIOS={() => {
              return null;
            }}
            onConfirm={(date) => {
              setDatePicker(false);
              let currentDate = date || time;
              let new_currentDate = moment(date).format('MMM DD, YYYY');
              setAge(new_currentDate);

              // setTime(currentDate);
            }}
            onCancel={() => setDatePicker(false)}
          />
          <Input
            placeholder={'Email'}
            image={require('../assets/Icons/mail.png')}
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <Input
            placeholder={'City'}
            image={require('../assets/Icons/location.png')}
            onChangeText={(text) => setCity(text)}
            value={city}
          />
          <ModalPicker
            dataSource={stateList}
            dummyDataSource={stateList}
            defaultValue={true}
            leftIcon={require('../assets/Icons/location.png')}
            pickerTitle={'Select State'}
            showSearchBar={true}
            showPickerTitle={true}
            pickerStyle={styles.pickerStyle}
            selectedLabel={stateList[state].label}
            placeHolderLabel={'Select State'}
            searchBarPlaceHolder={'Search...'}
            selectLabelTextStyle={styles.selectLabelTextStyle}
            placeHolderTextStyle={styles.placeHolderTextStyle}
            dropDownImageStyle={styles.dropDownImageStyle}
            dropDownImage={require('../assets/Icons/dropDown.png')}
            selectedValue={(value) => {
              setState(value);
            }}
          />
          {/* <View style={{ flexDirection: 'row', minHeight: 45, alignItems: 'center', borderWidth: 1, borderColor: "#C0C0C0", borderRadius: 2, marginVertical: 10 }}>
                        <View style={{ width: 50, minHeight: 45, backgroundColor: '#feeed9', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../assets/Icons/phone_iphone.png')}
                                style={{ height: 30, borderWidth: 1, resizeMode: 'contain' }}
                            />
                        </View>
                        <TextInputMask
                            type={'custom'}
                            editable={false}
                            options={{
                                mask: '+1 (999) 999-9999',
                                getRawValue: function (value, settings) {
                                    let result = value;
                                    result = result.replace('+1', '');
                                    result = result.replace('(', '');
                                    result = result.replace(') ', '');
                                    result = result.replace('', '');
                                    result = result.replace('-', '');
                                    return result;
                                }
                            }}
                            placeholder={'+1 (000) 000-0000'}
                            placeholderTextColor={'#404040'}
                            style={[{ flex: 1, color: '#2a6b9c', fontSize: 15, paddingHorizontal: 10, minHeight: 45, backgroundColor: '#fff' }]}

                            keyboardType={'number-pad'}
                            maxLength={17}
                            textContentType={'telephoneNumber'}
                            value={maskedPhone}
                            onChangeText={value => {
                                setMaskedPhone(value);
                                let result = value;
                                result = result.replace('+1', '');
                                result = result.replace('(', '');
                                result = result.replace(') ', '');
                                result = result.replace('', '');
                                result = result.replace('-', '');
                                setPhone(result)
                                if (value.length >= 17) {
                                    Keyboard.dismiss();
                                }
                            }}
                            ref={formatterRef}
                        />

                    </View> */}

          <Button
            title={route.params.from == 'profile' ? 'Save' : 'Next'}
            onPress={() => editProfile()}
            style={{
              alignSelf: 'center',
              marginTop: 60,
              width: width * 0.8,
              borderRadius: 2,
              minHeight: 50,
            }}
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
              icon: require('../assets/Icons/cameraPicker.png'),
              onPress: openCameraPicker,
            },
            {
              id: '2',
              title: 'Gallery',
              icon: require('../assets/Icons/image.png'),
              onPress: openGalary,
            },
            {
              id: '3',
              title: 'Use App Logo',
              icon: require('../assets/Icons/image.png'),
              onPress: appLogo,
            },
            {
              id: '4',
              title: 'Use Name Initials',
              icon: require('../assets/Icons/image.png'),
              onPress: nameExtractor,
            },
          ]}
        />
      </KeyboardAwareScrollView>
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
  },
  body: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  topPart: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
  },

  selectLabelTextStyle: {
    color: '#2a6b9c',
    textAlign: 'left',
    fontSize: 15,
    width: '99%',
    flex: 1,
    padding: 10,
    // flexDirection: "row"
  },
  placeHolderTextStyle: {
    color: '#000',
    padding: 10,
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
  },
  dropDownImageStyle: {
    marginLeft: 10,
    width: 10,
    height: 10,
    alignSelf: 'center',
  },
  pickerStyle: {
    shadowColor: '#DDDDDD',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0,
    elevation: 2,
    color: '#2a6b9c',
    fontFamily: 'Poppins-Regular',
    paddingRight: 10,
    height: 45,
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const stateList = [
  {
    label: 'Alabama',
    abbr: 'AL',
    value: 0,
  },
  {
    label: 'Alaska',
    abbr: 'AK',
    value: 1,
  },
  {
    label: 'American Samoa',
    abbr: 'AS',
    value: 2,
  },
  {
    label: 'Arizona',
    abbr: 'AZ',
    value: 3,
  },
  {
    label: 'Arkansas',
    abbr: 'AR',
    value: 4,
  },
  {
    label: 'California',
    abbr: 'CA',
    value: 5,
  },
  {
    label: 'Colorado',
    abbr: 'CO',
    value: 6,
  },
  {
    label: 'Connecticut',
    abbr: 'CT',
    value: 7,
  },
  {
    label: 'Delaware',
    abbr: 'DE',
    value: 8,
  },
  {
    label: 'District Of Columbia',
    abbr: 'DC',
    value: 9,
  },
  {
    label: 'Federated States Of Micronesia',
    abbr: 'FM',
    value: 10,
  },
  {
    label: 'Florida',
    abbr: 'FL',
    value: 11,
  },
  {
    label: 'Georgia',
    abbr: 'GA',
    value: 12,
  },
  {
    label: 'Guam',
    abbr: 'GU',
    value: 13,
  },
  {
    label: 'Hawaii',
    abbr: 'HI',
    value: 14,
  },
  {
    label: 'Idaho',
    abbr: 'ID',
    value: 15,
  },
  {
    label: 'Illinois',
    abbr: 'IL',
    value: 16,
  },
  {
    label: 'Indiana',
    abbr: 'IN',
    value: 17,
  },
  {
    label: 'Iowa',
    abbr: 'IA',
    value: 18,
  },
  {
    label: 'Kansas',
    abbr: 'KS',
    value: 19,
  },
  {
    label: 'Kentucky',
    abbr: 'KY',
    value: 20,
  },
  {
    label: 'Louisiana',
    abbr: 'LA',
    value: 21,
  },
  {
    label: 'Maine',
    abbr: 'ME',
    value: 22,
  },
  {
    label: 'Marshall Islands',
    abbr: 'MH',
    value: 23,
  },
  {
    label: 'Maryland',
    abbr: 'MD',
    value: 24,
  },
  {
    label: 'Massachusetts',
    abbr: 'MA',
    value: 25,
  },
  {
    label: 'Michigan',
    abbr: 'MI',
    value: 26,
  },
  {
    label: 'Minnesota',
    abbr: 'MN',
    value: 27,
  },
  {
    label: 'Mississippi',
    abbr: 'MS',
    value: 28,
  },
  {
    label: 'Missouri',
    abbr: 'MO',
    value: 29,
  },
  {
    label: 'Montana',
    abbr: 'MT',
    value: 30,
  },
  {
    label: 'Nebraska',
    abbr: 'NE',
    value: 31,
  },
  {
    label: 'Nevada',
    abbr: 'NV',
    value: 32,
  },
  {
    label: 'New Hampshire',
    abbr: 'NH',
    value: 33,
  },
  {
    label: 'New Jersey',
    abbr: 'NJ',
    value: 34,
  },
  {
    label: 'New Mexico',
    abbr: 'NM',
    value: 35,
  },
  {
    label: 'New York',
    abbr: 'NY',
    value: 36,
  },
  {
    label: 'North Carolina',
    abbr: 'NC',
    value: 37,
  },
  {
    label: 'North Dakota',
    abbr: 'ND',
    value: 38,
  },
  {
    label: 'Northern Mariana Islands',
    abbr: 'MP',
    value: 39,
  },
  {
    label: 'Ohio',
    abbr: 'OH',
    value: 40,
  },
  {
    label: 'Oklahoma',
    abbr: 'OK',
    value: 41,
  },
  {
    label: 'Oregon',
    abbr: 'OR',
    value: 42,
  },
  {
    label: 'Palau',
    abbr: 'PW',
    value: 43,
  },
  {
    label: 'Pennsylvania',
    abbr: 'PA',
    value: 44,
  },
  {
    label: 'Puerto Rico',
    abbr: 'PR',
    value: 45,
  },
  {
    label: 'Rhode Island',
    abbr: 'RI',
    value: 46,
  },
  {
    label: 'South Carolina',
    abbr: 'SC',
    value: 47,
  },
  {
    label: 'South Dakota',
    abbr: 'SD',
    value: 48,
  },
  {
    label: 'Tennessee',
    abbr: 'TN',
    value: 49,
  },
  {
    label: 'Texas',
    abbr: 'TX',
    value: 50,
  },
  {
    label: 'Utah',
    abbr: 'UT',
    value: 51,
  },
  {
    label: 'Vermont',
    abbr: 'VT',
    value: 52,
  },
  {
    label: 'Virgin Islands',
    abbr: 'VI',
    value: 53,
  },
  {
    label: 'Virginia',
    abbr: 'VA',
    value: 54,
  },
  {
    label: 'Washington',
    abbr: 'WA',
    value: 55,
  },
  {
    label: 'West Virginia',
    abbr: 'WV',
    value: 56,
  },
  {
    label: 'Wisconsin',
    abbr: 'WI',
    value: 57,
  },
  {
    label: 'Wyoming',
    abbr: 'WY',
    value: 58,
  },
];
