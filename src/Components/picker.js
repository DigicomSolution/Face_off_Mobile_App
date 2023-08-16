import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNPicker from 'search-modal-picker';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeHolderText: 'Please Select Country',
      selectedText: '',
    };
  }
  _selectedValue(index, item) {
    this.props.selector(item.name);
    // this.setState({ selectedText: item.name });
  }

  render() {
    const {dataSource, selectedText, placeHolderText} = this.props;
    console.log(dataSource, '-----0000-=---');
    return (
      <View style={{flex: 1}}>
        <RNPicker
          dataSource={dataSource}
          dummyDataSource={dataSource}
          defaultValue={false}
          //   pickerTitle={"Country Picker"}
          showSearchBar={true}
          disablePicker={false}
          changeAnimation={'none'}
          searchBarPlaceHolder={'Search.....'}
          showPickerTitle={true}
          searchBarContainerStyle={this.props.searchBarContainerStyle}
          pickerStyle={Styles.pickerStyle}
          pickerItemTextStyle={Styles.listTextViewStyle}
          selectedLabel={selectedText}
          placeHolderLabel={placeHolderText}
          selectLabelTextStyle={Styles.selectLabelTextStyle}
          placeHolderTextStyle={Styles.placeHolderTextStyle}
          dropDownImageStyle={Styles.dropDownImageStyle}
          dropDownImage={require('../assets/Icons/dropDown.png')}
          selectedValue={(index, item) => this._selectedValue(index, item)}
        />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBarContainerStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    // shadowOpacity: 1.0,
    // shadowRadius: 5,
    // shadowOffset: {
    //   width: 1,
    //   height: 1
    // },
    // backgroundColor: "rgba(255,255,255,1)",
    shadowColor: '#d3d3d3',
    borderRadius: 10,
    elevation: 3,
    // marginLeft: 10,
    // marginRight: 10
  },

  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: 10,
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: '#D3D3D3',
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
  listTextViewStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  pickerStyle: {
    marginLeft: 18,
    elevation: 3,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 2,
    shadowOpacity: 1.0,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderWidth: 1,
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: '#d3d3d3',
    borderRadius: 5,
    flexDirection: 'row',
  },
});
