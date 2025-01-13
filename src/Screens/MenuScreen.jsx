import {
  View,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import React from 'react';
import MenuItem from '../Components/MenuItem';

const menuItemsData = [
  {
    image: require('../../assets/images/MenuItems/recipes.png'),
    menuTitle: 'Recipes',
    menuDesc: 'Learn and share your favorites',
    backgroundColor: '#fa7a98',
  },
  {
    image: require('../../assets/images/MenuItems/money.png'),
    menuTitle: 'Money',
    menuDesc: 'Basic accounting to maximize earning',
    backgroundColor: '#3ad99c',
  },
  {
    image: require('../../assets/images/MenuItems/market.png'),
    menuTitle: 'Market',
    menuDesc: 'Spread the word in your community',
    backgroundColor: '#74ccfa',
  },
  {
    image: require('../../assets/images/MenuItems/build.png'),
    menuTitle: 'Stand',
    menuDesc: 'How to build your own stand',
    backgroundColor: '#d97b46',
  },
];

const MenuScreen = ({navigation}) => {
  const scaleSize = size => size * PixelRatio.get();
  console.log('------------------------------------');
  console.log('Pixel Ratio : ', PixelRatio.get());
  const styles = StyleSheet.create({
    root: {
      // backgroundColor: 'orange',
      height: '100%',
      width: '100%',
      backgroundColor: '#FFFBDE',
    },
    menuHeadingWrapper: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      // paddingVertical: scaleSize(10),
      // marginTop: scaleSize(20),
      marginTop: 20,
    },
    menuHeading: {
      fontFamily: 'Caveat-Bold',
      // lineHeight: 65,
      width: '100%',
      textAlign: 'center',
      marginTop: -8,
      color: 'black',
      // backgroundColor: 'yellow'
    },
    menuHeadingWithStroke: {
      position: 'absolute',
      fontFamily: 'Caveat-Bold',
      color: '#A3A3A3',
      left: 0,
      top: 2,
      right: 2,
      bottom: 0,
      textAlign: 'center',
      zIndex: -10,
      textShadowColor: 'rgba(200, 143, 0, 1)',
      textShadowOffset: {width: 1, height: 2},
      textShadowRadius: 5,
    },
    menuScrollView: {
      // backgroundColor: 'blue',
    },
    menuContainer: {
      // borderWidth: 4,
      // borderColor: 'black',
      minHeight: 600,
      height: '100%',
      maxHeight: '80%',
      rowGap: 30,
      alignItems: 'center',
      padding: 20,
    },
  });

  return (
    <View style={{backgroundColor: '#FFFBDE', height: '100%', width: '100%'}}>
      <SafeAreaView>
        <View style={styles.root}>
          <View style={styles.menuHeadingWrapper}>
            {/*<Text style={styles.menuHeading}>The Stand App</Text>*/}
            {/*<Text style={styles.menuHeadingWithStroke}>The Stand App</Text>*/}
            <Image
              source={require('../../assets/images/the_stand_app_logo_new.png')}
            />
          </View>
          <ScrollView style={styles.menuScrollView}>
            <View style={[styles.menuContainer, {padding: responsiveWidth(5)}]}>
              {menuItemsData.map((menuItem, index) => (
                <MenuItem
                  key={index}
                  menuItem={menuItem}
                  onTap={() => {
                    navigation.navigate(menuItem.menuTitle);
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default MenuScreen;
