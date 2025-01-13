import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  Image,
  Platform,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Navigation from '../Components/Navigation';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import Androw from 'react-native-androw';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const carts = [
  {
    title: 'Classic Stand',
    desc: 'Traditional look with a sturdy design',
    image: require('../../assets/images/Carts/classic_stand_image.png'),
    link: 'https://www.backporchbliss.com/sawdust-saturday-lemonade-stand/',
  },
  {
    title: 'Portable Stand',
    desc: 'Quick setup, perfect for any location',
    image: require('../../assets/images/Carts/portable_stand_image.png'),
    link: 'https://www.hgtv.com/design/make-and-celebrate/handmade/easy-and-portable-lemonade-stand-for-kids',
  },
  {
    title: 'Cardboard Stand',
    desc: "A great way to re-use old box's",
    image: require('../../assets/images/Carts/cardboard_stand_image.png'),
    link: 'https://thepinterestedparent.com/2016/02/cardboard-lemonade-stand/',
  },
];

function CartCard({cart, reverseStyle = false}) {
  const [cartPressed, setCartPressed] = useState(false);
  const openLinkInBrowser = async link => {
    const url = link; // Replace with your desired URL

    const supported = await Linking.canOpenURL(url);
    console.log('Supported or Not', supported);
    // if (supported) {
    await Linking.openURL(url);
    // } else {
    //   Alert.alert(`Don't know how to open this URL: ${url}`);
    // }
  };

  const windowWidth = Dimensions.get('window').width;
  return (
    <Androw style={styles.cartStandCardWrapper}>
      <TouchableOpacity
        onPress={() => openLinkInBrowser(cart.link)}
        onPressIn={() => setCartPressed(true)}
        onPressOut={() => setCartPressed(false)}
        style={[
          styles.cartStandCard,
          {flexDirection: reverseStyle ? 'row-reverse' : 'row'},
          cartPressed && {opacity: 1},
        ]}>
        <View
          style={[
            styles.cartDetailsView,
            {alignItems: reverseStyle ? 'flex-end' : 'flex-start'},
          ]}>
          <Text
            allowFontScaling={false}
            style={[
              styles.cartDetailsH1,
              {
                fontSize:
                  windowWidth > 420
                    ? responsiveFontSize(3.2)
                    : windowWidth < 400
                    ? 20
                    : 22,
              },
            ]}>
            {cart ? cart.title : 'Classic Stand'}
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.cartDetailsText,
              {textAlign: reverseStyle ? 'right' : 'left'},
              {
                fontSize:
                  windowWidth > 420
                    ? responsiveFontSize(2.3)
                    : windowWidth < 400
                    ? 20
                    : 22,
              },
            ]}
            numberOfLines={3}>
            {cart ? cart.desc : 'Traditional look with a sturdy design'}
          </Text>
        </View>
        <Image
          style={styles.cartImage}
          source={
            cart
              ? cart.image
              : require('../../assets/images/Carts/classic_stand_image.png')
          }
        />
      </TouchableOpacity>
    </Androw>
  );
}

const BuildScreen = ({navigation}) => {
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const safeAreaHeight = windowHeight - insets.top - insets.bottom;

  return (
    <View style={styles.root}>
      <SafeAreaView height={safeAreaHeight}>
        <Navigation
          navigationTitle={'Stand'}
          onPressBackBtn={() => navigation.goBack()}
          // onPressForwardBtn={() => navigation.navigate('Market')}
          enableLeftBtn={true}
          enableRightBtn={false}
          style={{marginTop: Platform.OS === 'android' ? 25 : 0}}
        />
        <ScrollView height={safeAreaHeight - 100}>
          <View style={styles.cartStandsListRoot}>
            {carts.map((cart, index) => {
              return (
                <CartCard
                  key={index}
                  reverseStyle={!(index % 2 === 0)}
                  cart={cart}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    // backgroundColor: 'white',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFFBDE',
  },
  cartStandsListRoot: {
    height: '100%',
    minHeight: '100%',
    width: '100%',
    paddingHorizontal: 35,
    paddingVertical: 20,
    gap: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  cartStandCardWrapper: {
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: 'rgba(32,32,32,0.5)',
    shadowOffset: {width: 0, height: 5},
  },

  cartStandCard: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 2,
    borderColor: 'black',
    minHeight: 120,
    height: hp(15),
    // maxHeight: 150,
    aspectRatio: 311 / 119,
    borderRadius: 20,
    backgroundColor: '#d57b3f',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 5,
  },
  cartDetailsView: {
    width: '70%',
    height: '100%',
    // backgroundColor: 'white',
    gap: 5,
  },
  cartDetailsH1: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'AnonymousPro-Bold',
  },
  cartDetailsText: {
    fontSize: 20,
    fontFamily: 'AnonymousPro-Regular',
    color: 'black',
  },
  cartImage: {
    width: '30%',
    height: '100%',
    objectFit: 'contain',
  },
});

export default BuildScreen;
