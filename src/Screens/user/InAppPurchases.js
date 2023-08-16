import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import IAP from 'react-native-iap';
import Header from '../../Components/Header';
import {
  RegularText,
  BoldText,
  SemiBoldText,
} from '../../Components/styledTexts';
import Constants from '../constants.json';

const productIds = ['com.hl.iside', 'com.cooni.point5000'];

export default function Help({route, navigation}) {
  const [purchaseItem, setProducts] = useState([]);

  useEffect(() => {
    inAPp();
  }, []);
  const inAPp = async () => {
    try {
      let products = await IAP.getProducts(productIds);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="IN-APP Purchases" back={() => navigation.goBack()} />
      </View>
      <ScrollView style={styles.body} bounces={false}>
        {/* <RegularText>{JSON.stringify(purchaseItem)}</RegularText> */}
        <View style={styles.bottomPart}>
          <View style={styles.textViewStyle}>
            <RegularText style={{marginTop: 10}}>
              Points: 20 for .99, 30 for 1.99, 60 for 2.99, 150 for 4.99{' '}
            </RegularText>
          </View>
          <View style={styles.textViewStyle}>
            <SemiBoldText>
              Rebuttal: 30 points
              <RegularText style={styles.descriptionStyle}>
                {' '}
                15 seconds to respond after watching your opponent's video (in
                addition to your 30 seconds){' '}
              </RegularText>
            </SemiBoldText>
          </View>
          <View style={styles.textViewStyle}>
            <SemiBoldText>
              Extend voting: 20 points
              <RegularText style={styles.descriptionStyle}>
                {' '}
                extends the voting 24 hours (can only be done once by each
                party){' '}
              </RegularText>
            </SemiBoldText>
          </View>
          <View style={styles.textViewStyle}>
            <SemiBoldText>
              Promote your dispute: 30 points
              <RegularText style={styles.descriptionStyle}>
                {' '}
                make your video a featured dispute for 2 hours.{' '}
              </RegularText>
            </SemiBoldText>
          </View>
          <SemiBoldText style={styles.textViewStyle}>
            Comments: 10 points{' '}
          </SemiBoldText>
          {/* <View style={styles.textViewStyle}>
                        <SemiBoldText>Ask the pro's: $2.99
                        <RegularText  style={styles.descriptionStyle}> get a personalized response from someone experienced in field of disagreement (e.g. relationship experts, life coach, mediator, parents, etc.)  </RegularText>
                        </SemiBoldText>
                        
                    </View> */}
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
  bottomPart: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
