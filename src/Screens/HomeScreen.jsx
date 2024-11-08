import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useHeight} from '../Utitlites/useHeight';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HomeScreen = ({navigation}) => {
  const [startBtnPressed, setStartBtnPressed] = useState(false);
  const screenHeight = useHeight();

  console.log('Screen Height : ', screenHeight);
  console.log('Screen Height to DP', hp(-25));

  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/images/logo_v1.png')}
        style={[styles.homeBackground]}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <View
          style={[
            styles.startBtnWrapper,
            {
              marginBottom:
                screenHeight < 670
                  ? hp(-34)
                  : screenHeight > 670 && screenHeight < 870
                  ? hp(-30)
                  : screenHeight > 870 && screenHeight < 910
                  ? hp(-25)
                  : hp(-29),
            },
          ]}>
          <TouchableOpacity
            style={startBtnPressed && styles.startBtnPressed}
            onPressIn={() => setStartBtnPressed(true)}
            onPressOut={() => setStartBtnPressed(false)}
            onPress={() => navigation.navigate('Menu')}>
            <View
              style={[
                styles.startBtn,
                startBtnPressed && styles.startBtnPressed,
              ]}>
              <Text allowFontScaling={false} style={styles.startBtnText}>
                START
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FFFBDE',
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  logo: {},
  homeBackground: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    zIndex: -100,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'rgba(0, 0, 0, .3)',
    backgroundColor: '#FFFBDE',
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'orange',
  },

  startBtnWrapper: {
    position: 'absolute',
    alignItems: 'center',
    bottom: '50%',
    left: '50%',
    transform: [{translateX: -80}, {translateY: -20}],
  },
  startBtn: {
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#feec61',
    width: 179,
    height: 58,
    textAlign: 'center',
    borderRadius: 30,
    paddingVertical: 5,
    alignItems: 'center',
  },
  startBtnText: {
    // height: '100%',
    // backgroundColor: 'orange',
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 38,
    // paddingHorizontal: 15,
    color: 'black',
    letterSpacing: 3,
    fontFamily: 'AnonymousPro-Bold',
  },
  startBtnPressed: {
    backgroundColor: '#FCDE1E',
    opacity: 1,
    borderRadius: 30,
  },
});

export default HomeScreen;
