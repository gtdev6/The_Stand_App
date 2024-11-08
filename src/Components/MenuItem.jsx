import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

import React, {useState} from 'react';
import {darkenColor} from '../Utitlites/helperFunctions';
// import {Shadow} from 'react-native-shadow-2';
import Androw from 'react-native-androw';
import {useHeight} from '../Utitlites/useHeight';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const MenuItem = ({menuItem, onTap}) => {
  const screenHeight = useHeight();
  const screenWidth = Dimensions.get('window').width;
  console.log('Screen Width : ', screenWidth);
  console.log('Screen Height : ', screenHeight);
  const [btnPressed, setBtnPressed] = useState(false);
  const {image, menuTitle, menuDesc, backgroundColor} = menuItem;
  const darkerColor = darkenColor(backgroundColor, -20);

  const height = screenHeight > 900 ? responsiveHeight(15) : 127;
  const menuItemHeight = screenHeight > 900 ? '100%' : 127;
  const padding = screenHeight > 900 ? 0.06 * 0.3 * screenHeight : 0.11 * 127;
  // const fontSizeH = screenHeight > 900 ? RFPercentage(4) : 36;
  const fontSizeH = responsiveFontSize(4.2);
  const fontSizeP =
    screenWidth > 420
      ? screenWidth > 450
        ? responsiveFontSize(2.4)
        : responsiveFontSize(2.1)
      : screenWidth < 400
      ? 18
      : 20;
  // console.log('Font Size', fontSizeH);
  // console.log('Font Size Paragraph', fontSizeP);

  return (
    // <View style={{flex: 1, width: '100%', maxHeight: 150, height: '100%'}}>
    <Androw style={styles.menuItemWrapper}>
      <TouchableOpacity
        style={[
          styles.menuItemBtn,
          btnPressed ? {opacity: 1} : {},
          {
            height: height,
            maxWidth: responsiveWidth(90),
          },
        ]}
        onPressIn={() => setBtnPressed(true)}
        onPressOut={() => setBtnPressed(false)}
        onPress={onTap}>
        <View
          style={[
            styles.menuItem,
            {backgroundColor},
            btnPressed ? {backgroundColor: darkerColor} : {},
            {minHeight: menuItemHeight, padding: padding},
          ]}>
          <View style={styles.menuItemImageRoot}>
            <Image
              style={styles.menuItemImage}
              source={image ? image : {uri: 'https://placehold.co/400x400'}}
            />
          </View>
          <View style={styles.menuItemContainer}>
            <Text
              allowFontScaling={false}
              style={[styles.menuItemTitle, {fontSize: fontSizeH}]}>
              {menuTitle}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.menuItemDesc,
                {fontSize: fontSizeP, maxWidth: responsiveWidth(55)},
              ]}>
              {menuDesc}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Androw>
    // </View>
  );
};

const styles = StyleSheet.create({
  menuItemWrapper: {
    shadowOffset:
      Platform.OS === 'android' ? {width: 0, height: 6} : {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowColor: 'rgba(0,0,0,1)',
  },

  menuItem: {
    borderWidth: 2,
    // maxHeight: 150,
    minHeight: 127,
    // width: ,
    height: '100%',
    borderRadius: 20,
    flexDirection: 'row',
    columnGap: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 15,
  },
  menuItemBtn: {
    height: '22%',
    // maxHeight: 150,
    width: '100%',
    borderRadius: 20,
  },
  menuItemImageRoot: {
    // width: '25%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
  },
  menuItemContainer: {
    height: '100%',
    width: '70%',
    // paddingVertical: 8,
    rowGap: 4,
  },
  menuItemTitle: {
    fontSize: 34,
    letterSpacing: 2,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  menuItemDesc: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
});

export default MenuItem;
