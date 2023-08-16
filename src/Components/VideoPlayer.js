import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Constants from '../Screens/constants.json';
import {FEEDS_AOI} from '../utils/Queries';
import {WATCH_VIDEO_MUTATION} from '../utils/Mutations';
const {width, height} = Dimensions.get('window');

export default function Videos({
  show,
  onHide,
  url,
  thumbnail,
  videoType,
  topic_id,
  page,
  pageSize,
  claim,
  feedType,
  isCategory,
}) {
  const [feeds, {data: feedData, loading: feedLoading, error: feedError}] =
    useLazyQuery(FEEDS_AOI, {fetchPolicy: 'network-only'});

  function watchCount() {
    if (videoType == 'favour') {
      console.log({
        video_type_flag: true,
        topic_id: Number(topic_id),
      });
      watchVideo({
        variables: {
          videoViewsInput: {
            video_type_flag: true,
            topic_id: Number(topic_id),
          },
        },
      });
    } else if (videoType == 'against') {
      console.log({
        video_type_flag: false,
        topic_id: Number(topic_id),
      });
      watchVideo({
        variables: {
          videoViewsInput: {
            video_type_flag: false,
            topic_id: Number(topic_id),
          },
        },
      });
    }
  }

  const [watchVideo] = useMutation(WATCH_VIDEO_MUTATION, {
    onCompleted(data) {
      if (data) {
        console.log(data, 'data');
        console.log(
          {
            // page: page,
            // pageSize: pageSize,
            claim: claim,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
          'watch video',
        );
        feeds({
          variables: {
            // page: page,
            // pageSize: pageSize,
            claim: claim,
            isCategory: isCategory,
            sorting_id: 1,
            type: feedType,
          },
        });
      }
    },
    onError(error, operation) {
      if (error.graphQLErrors) {
        if (error.graphQLErrors.length > 0) {
          console.log(error.graphQLErrors[0].message.toString());
        }
      }
      // console.log(JSON.stringify(error))
      // ErrorHandler.showError(error);
    },
  });

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        statusBarTranslucent={false}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}>
        <View style={styles.centeredView}>
          <TouchableOpacity
            onPress={() => onHide()}
            style={{alignSelf: 'flex-end', position: 'relative'}}>
            <Image source={require('../assets/Icons/close.png')} style={{}} />
          </TouchableOpacity>
          <View style={styles.modalView}>
            <View style={{width: width * 0.9}}>
              <VideoPlayer
                video={url ? {uri: url} : null}
                // videoWidth={width*.9}
                // videoHeight={250}
                controlsTimeout={2000}
                autoplay
                resizeMode={'cover'}
                hideControlsOnStart={false}
                // onStart={watchCount()}
                onEnd={() => {
                  watchCount();
                  setTimeout(() => {
                    onHide();
                  }, 1000);
                }}
                // navigator={this.props.navigator}
                // toggleResizeModeOnFullscreen={false}
                // disableFullscreen
                // disableBack
                // disableVolume
                // disableControlsAutoHide={true}
                thumbnail={{uri: thumbnail}}
                customStyles={{
                  videoWrapper: {borderRadius: 5},
                  wrapper: {borderRadius: 5, overflow: 'hidden'},
                  thumbnail: {
                    width: width * 0.9,
                    height: 250,
                    resizeMode: 'cover',
                    flex: 1,
                  },
                  video: {width: width * 0.9, height: 250},
                  controls: {backgroundColor: '#fff'},
                  playIcon: {color: '#00000090'},
                  controlIcon: {color: '#00000090'},
                  seekBarFullWidth: {backgroundColor: '#fff'},
                  seekBarBackground: {backgroundColor: '#ddd'},
                  seekBarKnob: {backgroundColor: Constants.btnColor},
                  seekBarProgress: {backgroundColor: Constants.btnColor},
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalView: {
    // margin: 20,
    // height:300,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5
  },
});
