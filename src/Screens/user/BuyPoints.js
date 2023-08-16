import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import _ from 'lodash';
import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Loader from '../../Components/Loader';
import Constants from '../constants.json';
import {Button} from '../../Components/button';
import {GET_USER_INFO} from '../../utils/Queries';
import {BUY_POINTS} from '../../utils/Mutations';
import {UserContext} from '../../../App';
const {height, width} = Dimensions.get('screen');
const productIds = Platform.select({
  ios: ['20_point', '30_points', '60_points', '150_points'],
  android: ['20_point', '30_points', '60_points', '150_points'],
});
export default function BuyPoints({route, navigation}) {
  const [productList, setProductList] = useState([]);
  const userContext = useContext(UserContext);
  const [receipt, setReceipt] = useState('');
  const [availableItemsMessage, setAvailableItemsMessage] = useState('');
  const [loadingActivity, setloadingActivity] = useState(false);
  let purchaseUpdateSubscription;
  let purchaseErrorSubscription;

  const [callMe, {data: userData, loading: userLoading, error: userError}] =
    useLazyQuery(GET_USER_INFO, {fetchPolicy: 'network-only'});

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

  useEffect(() => {
    setloadingActivity(true);
    // getAvailablePurchases()
    getItems();

    inAPp();
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    };
  }, []);
  const inAPp = async () => {
    try {
      const result = await RNIap.initConnection();
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      console.log('result', result);
    } catch (err) {
      console.warn(err.code, err.message);
    }

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              finishTransactionIOS(purchase.transactionId);
              setloadingActivity(false);
              // console.log(finishPurchase,"finishPurchase")
            } else if (Platform.OS === 'android') {
              // If consumable (can be purchased again)
              consumePurchaseAndroid(purchase.purchaseToken);
              console.log(
                await consumePurchaseAndroid(purchase.purchaseToken),
                'consumePurchaseAndroid(purchase.purchaseToken);',
              );
              // If not consumable
              acknowledgePurchaseAndroid(purchase.purchaseToken);
              console.log(
                await acknowledgePurchaseAndroid(purchase.purchaseToken),
                'acknowledgePurchaseAndroid(purchase.purchaseToken);',
              );

              setloadingActivity(false);
            }
            const ackResult = await finishTransaction(purchase);
            console.log(ackResult, 'ackResult');
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }

          setReceipt(receipt);
        }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
      // Alert.alert('purchase error', error.message);
    });
  };

  const getAvailablePurchases = async () => {
    try {
      console.info(
        'Get available purchases (non-consumable or unconsumed consumable)',
      );
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        setAvailableItemsMessage(`Got ${purchases.length} items.`);
        setReceipt(purchases[0].transactionReceipt);
      }
    } catch (err) {
      console.log(err.code, err.message);
      // Alert.alert(err.message);
    }
  };

  const getItems = async () => {
    try {
      const products = await RNIap.getProducts(productIds);
      // console.log('Products', products);

      let data = products.sort((a, b) => {
        var productsA = Number(a.price),
          productsB = Number(b.price);
        if (productsA > productsB) {
          return 1;
        }

        if (productsA < productsB) {
          return -1;
        }
        return 0;
      });
      setProductList(data);
      setloadingActivity(false);
    } catch (err) {
      console.log(err.code, err.message);
    }
  };

  const requestPurchase = async (sku) => {
    try {
      let purchase = await RNIap.requestPurchase(sku);
      if (Platform.OS == 'ios') {
        setloadingActivity(true);
        let temp_data = {
          transcation_id: purchase.transactionId,
          product_id: purchase.productId,
          points: get_points(purchase.productId),
          transcation_date: moment(purchase.transactionDate).format(
            'YYYY-MM-DD',
          ),
          transcation_time: moment(purchase.transactionDate).format('hh:mm A'),
        };
        buyPointsiOS({
          variables: {
            pointsPurchaseInput: temp_data,
          },
        });
        // console.log(temp_data, "10_points")
      } else {
        setloadingActivity(true);
        let temp_data = {
          transcation_id: purchase.transactionId,
          product_id: purchase.productId,
          points: get_points(purchase.productId),
          transcation_date: moment(purchase.transactionDate).format(
            'YYYY-MM-DD',
          ),
          transcation_time: moment(purchase.transactionDate).format('hh:mm A'),
        };
        buyPointsiOS({
          variables: {
            pointsPurchaseInput: temp_data,
          },
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  const get_points = (points) => {
    switch (points) {
      case '20_point':
        {
          return 20;
        }
        break;
      case '30_points':
        {
          return 30;
        }
        break;
      case '60_points':
        {
          return 60;
        }
        break;
      case '150_points':
        {
          return 150;
        }
        break;
      default: {
        return 0;
      }
    }
  };

  const [buyPointsiOS] = useMutation(BUY_POINTS, {
    onCompleted(data) {
      console.log(data, 'data');
      if (data) {
        callMe();
        setloadingActivity(false);
      }
    },
    onError(error, operation) {
      console.log(JSON.stringify(error), 'error');
      setLoadingActivity(false);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Buy Points" back={() => navigation.goBack()} />
      </View>

      {/* <RegularText>{JSON.stringify(purchaseItem)}</RegularText> */}
      <View style={styles.bottomPart}>
        <View style={{zIndex: 10}}>
          <Loader loading={loadingActivity} />
        </View>

        {/* <Button title={"Get available purchases"} onPress={() => getAvailablePurchases()} style={{ alignSelf: 'center', marginVertical: 50, borderRadius: 10, minHeight: 40, paddingHorizontal: 15 }} /> */}
        {/* <Button title={"Get Products"} onPress={() => getItems()} style={{ alignSelf: 'center', borderRadius: 10, minHeight: 40, paddingHorizontal: 15 }} /> */}
        <FlatList
          data={productList}
          keyExtractor={(item) => item.productId}
          ItemSeparatorComponent={() => (
            <View style={{width: 10, height: 20}} />
          )}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#f5f6fa',
                  paddingHorizontal: 15,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}>
                <View
                  style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#fee666',
                      borderRadius: 15,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      width: 65,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/Icons/nuevo-sol.png')}
                      style={{marginRight: 10, resizeMode: 'contain'}}
                    />
                    {Platform.OS === 'android' ? (
                      <SemiBoldText style={{}}>
                        +{item.title.match(/\d/g).join('')}
                      </SemiBoldText>
                    ) : (
                      <SemiBoldText
                        style={{textAlign: 'right', alignSelf: 'flex-end'}}>
                        +{item.title}
                      </SemiBoldText>
                    )}
                  </View>
                  <SemiBoldText style={{marginLeft: 10}}>Points</SemiBoldText>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => requestPurchase(item.productId)}
                    style={{
                      backgroundColor: Constants.btnColor,
                      borderRadius: 7,
                      paddingVertical: 3,
                      paddingHorizontal: 10,
                    }}>
                    <SemiBoldText style={{color: 'white'}}>
                      {item.localizedPrice} Buy Now
                    </SemiBoldText>
                  </TouchableOpacity>
                </View>
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
  },
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  textViewStyle: {
    flex: 1,
    marginBottom: 20,
    fontWeight: '400',

    // flexDirection: 'row',
  },
  descriptionStyle: {
    fontWeight: '400',
    letterSpacing: 0.7,
  },
});
