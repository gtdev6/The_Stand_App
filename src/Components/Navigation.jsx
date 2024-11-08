import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

Navigation.propTypes = {onPress: PropTypes.func};
function Navigation(props) {
  const screenWidth = Dimensions.get('window').width;
  const [elementWidth, setElementWidth] = useState(0);
  const {
    onPressBackBtn,
    onPressForwardBtn,
    navigationTitle,
    enableLeftBtn,
    enableRightBtn,
    style,
    leftBtnImage,
  } = props;
  return (
    <View
      style={[
        styles.navigationTopContainer,
        {marginTop: Platform.OS === 'android' ? 20 : 0},
        style,
      ]}>
      {enableLeftBtn && (
        <TouchableOpacity
          style={styles.backBtnWrapper}
          onPress={onPressBackBtn}>
          <View style={styles.backBtnView}>
            <Image
              style={styles.backBtnImage}
              source={
                leftBtnImage
                  ? leftBtnImage
                  : require('../../assets/images/chevron_left.png')
              }
            />
          </View>
        </TouchableOpacity>
      )}
      <View
        style={styles.recipesScreenTitleWrapper}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setElementWidth(width);
        }}>
        <Text
          allowFontScaling={false}
          style={[
            styles.recipesScreenTitle,
            {
              fontSize: screenWidth > 420 ? responsiveFontSize(4) : 36,
            },
            {transform: [{translateX: -elementWidth / 2}]},
          ]}>
          {navigationTitle}
        </Text>
      </View>
      {enableRightBtn && (
        <TouchableOpacity
          style={styles.backBtnWrapper}
          onPress={onPressForwardBtn}>
          <View style={styles.backBtnView}>
            <Image
              style={styles.backBtnImage}
              source={require('../../assets/images/chevron_right.png')}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationTopContainer: {
    width: '100%',
    height: 60,
    maxHeight: 100,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  backBtnWrapper: {
    width: '20%',
  },
  backBtnView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnImage: {
    width: 24,
    height: 24,
  },
  backBtnPressed: {
    opacity: 1,
  },
  recipesScreenTitleWrapper: {
    position: 'absolute',
    // width: '60%',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
  },
  recipesScreenTitle: {
    fontSize: 36,
    // fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'AnonymousPro-Regular',
    color: 'black',
    textTransform: 'uppercase',
  },
});

export default Navigation;
