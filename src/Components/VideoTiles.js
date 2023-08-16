import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import VideoPlayer from './VideoPlayer';
import {BoldText, RegularText, SemiBoldText} from './styledTexts';
import Loader from './Loader';
import Constants from '../Screens/constants.json';
import Comments from '../Screens/user/Comments';
let userId = '';
export default function VideoTile({
  commentPress,
  claimPress,
  firstItem,
  data,
  winnerImage,
  from,
  userProfilePress,
  againstUserProfilePress,
  deleteTopic,
  repostTopic,
  onPress,
}) {
  const [loading, setLoading] = React.useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [show, setShow] = useState(false);
  const [videoUrl, setUrl] = useState('');
  const onHide = () => {
    setShow(false);
  };
  const calcDays = (date) => {
    var startDate = moment();
    var endDate = moment(date);
    // let current = new Date();
    // let dataPosted = new Date(date);
    // var Difference_In_Time = current.getTime() - dataPosted.getTime();
    var Difference_In_Days = startDate.diff(endDate, 'days');
    if (Difference_In_Days > 1) {
      return moment(date).format('MM/DD/YYYY');
    } else {
      let posted_date = moment(date).format('MM/DD/YYYY');
      let today = moment().format('MM/DD/YYYY');
      if (posted_date == today) {
        return moment(date).format('hh:mm A');
      } else {
        return moment(date).format('MM/DD/YYYY');
      }
    }

    // return new Date(date).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  };
  return (
    <View
      style={{
        margin: 10,
        marginBottom: 0,
        padding: 10,
        borderRadius: 2,
        borderTopColor: '#ddd',
        borderTopWidth: firstItem ? 0 : 1,
      }}
      key={JSON.stringify(data)}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <View style={{flex: 1}}>
          <View>
            <SemiBoldText style={{flex: 1}}>
              {/* Claim:  */}
              {data.claim}.
            </SemiBoldText>
          </View>
          <View style={{}}>
            <RegularText style={{fontSize: 12, color: '#357DF5'}}>
              #{data.category}
            </RegularText>
          </View>
        </View>
        {/* <View style={{width:50, height:50, borderRadius:25, overflow:'hidden', backgroundColor:'#dddddd50', justifyContent:'center', alignItems:'center', borderColor:Constants.btnColor, borderWidth:!data.profile_picture?1:0}}>
            {data.profile_picture?
            <FastImage
                //  source={item.profile_picture?{uri:'http://3.130.98.232/'+item.profile_picture}:require('../assets/Icons/thumb.png')} 
                 style={{width:50, height:50, borderRadius:25, overflow:'hidden',resizeMode:'cover'}} 
                 source={{
                    uri: 'http://3.130.98.232/'+data.profile_picture,
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.high,
                 }}
                resizeMode={FastImage.resizeMode.cover}
                />
                :<SemiBoldText style={{fontSize:26, color: Constants.btnColor}}>{data.username.match(/\b(\w)/g).join('').toUpperCase()}</SemiBoldText>
                }
            </View> */}
        {/* <TouchableOpacity onPress={userProfilePress} style={{flex:1, marginLeft:10}}>
                <RegularText>{data.username.toLowerCase().split(' ').map((str) => str.charAt(0).toUpperCase() + str.substring(1)).join(' ')}</RegularText>
                <View style={{borderRadius:10, borderWidth:1, borderColor:'#ddd', paddingHorizontal:5, alignSelf: 'flex-start'}}>
                    <RegularText style={{fontSize:12}}>{data.category}</RegularText>
                </View>
            </TouchableOpacity> */}
        {from ? null : (
          <Menu style={{}}>
            <MenuTrigger>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                  marginHorizontal: 10,
                }}
                source={require('../assets/Icons/Options.png')}
              />
            </MenuTrigger>
            <MenuOptions
              customStyles={{optionWrapper: {width: 150}}}
              optionsContainerStyle={{width: 130, paddingVertical: 10}}>
              <MenuOption
                onSelect={repostTopic}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 15,
                }}>
                <Image
                  source={require('../assets/Icons/send.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
                <RegularText
                  style={{color: 'black', paddingLeft: 10, marginTop: 0}}>
                  Repost
                </RegularText>
              </MenuOption>
              <MenuOption
                onSelect={deleteTopic}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 15,
                }}>
                <Image
                  source={require('../assets/Icons/delete.png')}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
                <RegularText
                  style={{color: 'black', paddingLeft: 10, marginTop: 0}}>
                  Delete
                </RegularText>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
      {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                <RegularText style={{ fontSize: 12, flex: 1 }}>Posted: {(data) ? calcDays(data.created_at) : "5:52pm"}</RegularText>
                <RegularText style={{ fontSize: 12 }}>Time left to vote: 03:18:25</RegularText>
            </View> */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingBottom: 10,
          marginBottom: 5,
          borderBottomColor: '#ddd',
          borderBottomWidth: 1,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <RegularText style={{fontSize: 12}}>Time left to vote:</RegularText>
          {data.active ? (
            <CountDown
              until={Number(data.timeLeft)}
              countdownTime={true}
              timeToShow={['H', 'M', 'S']}
              // onFinish={() => alert('finished')}
              // onPress={() => alert('hello')}
              digitStyle={{}}
              digitTxtStyle={{
                color: Constants.btnColor,
                fontSize: 14,
                fontWeight: 'bold',
              }}
              // timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
              showSeparator
              separatorStyle={{color: Constants.btnColor, fontWeight: 'bold'}}
              timeLabels={{h: null, m: null, s: null}}
              size={8}
            />
          ) : (
            <RegularText style={{fontSize: 14}}>00:00:00</RegularText>
          )}
          {/* <RegularText style={{ fontSize: 12 }}>Time left to vote: {item.counter}</RegularText> */}
        </View>
        <RegularText style={{fontSize: 12}}>
          Posted: {calcDays(data.created_at)}
        </RegularText>
      </View>
      <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: '#dddddd50',
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: Constants.btnColor,
              borderWidth: !data.profile_picture ? 1 : 0,
            }}>
            {data.profile_picture ? (
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
                  uri: 'http://3.130.98.232/' + data.profile_picture,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <SemiBoldText style={{fontSize: 26, color: Constants.btnColor}}>
                {data.username
                  .match(/\b(\w)/g)
                  .join('')
                  .toUpperCase()}
              </SemiBoldText>
            )}
          </View>

          <TouchableOpacity
            style={{flex: 1, marginLeft: 10}}
            onPress={userProfilePress}>
            <RegularText>
              {data.username
                .toLowerCase()
                .split(' ')
                .map((str) => str.charAt(0).toUpperCase() + str.substring(1))
                .join(' ')}
            </RegularText>
          </TouchableOpacity>
        </View>
        {data.against_username && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                overflow: 'hidden',
                backgroundColor: '#dddddd50',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Constants.btnColor,
                borderWidth: !data.profile_picture ? 1 : 0,
              }}>
              {data.against_profile_picture ? (
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
                    uri: 'http://3.130.98.232/' + data.against_profile_picture,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              ) : (
                <SemiBoldText style={{fontSize: 26, color: Constants.btnColor}}>
                  {data.against_username
                    ? data.against_username
                        .match(/\b(\w)/g)
                        .join('')
                        .toUpperCase()
                    : ''}
                </SemiBoldText>
              )}
            </View>
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={againstUserProfilePress}>
              <RegularText>
                {data.against_username
                  ? data.against_username
                      .toLowerCase()
                      .split(' ')
                      .map(
                        (str) => str.charAt(0).toUpperCase() + str.substring(1),
                      )
                      .join(' ')
                  : ''}
              </RegularText>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{flexDirection: 'row', height: 200}}>
        {data ? (
          data.video ? (
            <ImageBackground
              source={
                data.thumbnail
                  ? {uri: 'http://3.130.98.232/' + data.thumbnail}
                  : ''
              }
              resizeMode={'cover'}
              style={{
                flex: 1,
                height: 200,
                backgroundColor: '#a1a1a1',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setUrl(data.video);
                  setThumbnail('http://3.130.98.232/' + data.thumbnail);
                  setShow(true);
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}>
                <Image
                  source={require('../assets/Icons/play-icon.png')}
                  style={{width: 50, height: 50, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              {!data.active &&
                data.totalFavourVotes > data.totalAgainstVotes && (
                  <Image
                    source={winnerImage}
                    style={{
                      width: 150,
                      resizeMode: 'contain',
                      position: 'absolute',
                      bottom: -50,
                      right: 0,
                      tintColor: Constants.btnColor,
                      opacity: 0.8,
                    }}
                  />
                )}
            </ImageBackground>
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#a1a1a1',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/Icons/camera.png')}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          )
        ) : null}

        {data ? (
          data.against_video ? (
            <ImageBackground
              source={
                data.against_video_thumbnail
                  ? {uri: 'http://3.130.98.232/' + data.against_video_thumbnail}
                  : ''
              }
              resizeMode={'cover'}
              style={{
                flex: 1,
                height: 200,
                backgroundColor: '#a1a1a1',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setUrl(data.against_video);
                  setThumbnail(
                    'http://3.130.98.232/' + data.against_video_thumbnail,
                  );
                  setShow(true);
                }}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}>
                <Image
                  source={require('../assets/Icons/play-icon.png')}
                  style={{width: 50, height: 50, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              {!data.active &&
                data.totalAgainstVotes > data.totalFavourVotes && (
                  <Image
                    source={winnerImage}
                    style={{
                      width: 150,
                      resizeMode: 'contain',
                      position: 'absolute',
                      bottom: -50,
                      right: 0,
                      tintColor: Constants.btnColor,
                      opacity: 0.8,
                    }}
                  />
                )}
            </ImageBackground>
          ) : // <TouchableOpacity onPress={() => { setShow(true); setUrl(data.against_video) }} style={{ flex: 1, backgroundColor: '#a1a1a1', justifyContent: 'center', alignItems: 'center' }}>
          //     <Image source={require('../assets/Icons/play-icon.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />

          // </TouchableOpacity>
          data.userIsResponder ? (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                backgroundColor: '#a1a1a1',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/Icons/camera.png')}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                backgroundColor: '#a1a1a1',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/Icons/user-a.png')}
                style={{width: 100, height: 100, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
      <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
        <View
          style={{
            fontSize: 12,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/Icons/eye.png')}
            style={{paddingRight: 12}}
          />
          <RegularText style={{paddingLeft: 4, fontSize: 12}}>
            Views: {data.views}
          </RegularText>
        </View>
        <View style={{flex: 1}}>
          <RegularText style={{fontSize: 12, textAlign: 'center'}}>
            Votes: {data ? data.totalVotes : '365'}
          </RegularText>
        </View>
        <TouchableOpacity onPress={commentPress} style={{flex: 1}}>
          <RegularText style={{fontSize: 12, textAlign: 'right'}}>
            {data ? data.totalComments : '430'} Comments
          </RegularText>
        </TouchableOpacity>
      </View>
      {winnerImage &&
        !data.active &&
        data.totalAgainstVotes == data.totalFavourVotes && (
          <SemiBoldText style={{marginTop: 15}}>Result: No Winner</SemiBoldText>
        )}
      <VideoPlayer
        show={show}
        onHide={onHide}
        url={videoUrl}
        thumbnail={thumbnail}
      />
    </View>
  );
}
