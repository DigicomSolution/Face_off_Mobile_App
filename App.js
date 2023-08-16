import React, {useState, useEffect, useContext} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import configureStore from './store/ConfigureStore';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import Routes from './Router';
const store = configureStore();
export const UserContext = React.createContext({
  profile: {},
  loading: true,
  token: null,
  setData: () => {},
});
export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default function App(props) {
  const userContext = useContext(UserContext);
  const setUserData = (data) => {
    setState({...state, ...data});
  };
  const initState = {
    profile: {},
    token: null,
    loading: true,
    setData: setUserData,
  };
  const [state, setState] = useState(initState);

  // useEffect(() => {
  //   // loginVoximplant();

  //   const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
  //       console.log(JSON.stringify(remoteMessage), 'App onNotificationOpenedApp--->>');
  //   });
  //   return unsubscribe;
  // }, []);

  // useEffect(()=>{
  //   const unsubscribe = messaging().setBackgroundMessageHandler(remoteMessage =>{
  //     console.log(JSON.stringify(remoteMessage), 'App notification background ===>')
  //   })
  //   return unsubscribe;
  // },[])

  // useEffect(()=>{
  //   const unsubscribe = messaging().getInitialNotification().then(remoteMessage => {
  //       console.log(JSON.stringify(remoteMessage),"App getInitialNotification")
  //       userContext.setData({notification:remoteMessage})
  //     })
  //     return unsubscribe;
  // },[])

  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:::', authorizationStatus);
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <Provider store={store}>
      <UserProvider value={state}>
        <MenuProvider>
          <FlashMessage position="top" />
          <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
          <SafeAreaView style={{flex: 0}} />
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Routes />
          </View>
        </MenuProvider>
      </UserProvider>
    </Provider>
  );
}
