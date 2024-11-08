import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {captureRef} from 'react-native-view-shot';
import RNPrint from 'react-native-print';
import Navigation from '../Components/Navigation';
import React, {useRef, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {request, PERMISSIONS} from 'react-native-permissions';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Androw from 'react-native-androw';
import Share from 'react-native-share';

const MarketScreen = ({navigation}) => {
  const viewRef = useRef();
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const scrollViewRef = useRef(null);
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState('DATE');
  const [timeText, setTimeText] = useState('TIME');

  const [printBtnPressed, setPrintBtnPressed] = useState(false);
  const [shareBtnPressed, setShareBtnPressed] = useState(false);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date'); // Start with date picker
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const insets = useSafeAreaInsets();
  const locationInputFieldRef = useRef();
  const safeAreaHeight = windowHeight - insets.top - insets.bottom;
  const [location, setLocation] = useState('');

  const postContWidth = windowWidth - 80; // 0.91
  const postContHeight = postContWidth / (322 / 416);
  const postContFontSize = 0.11 * postContHeight;
  const minPostContHeight = (windowWidth - wp(5)) / (322 / 416);

  const handleDefocus = () => {
    if (locationInputFieldRef.current) {
      locationInputFieldRef.current.blur();
    }
  };

  console.log('Screen Width : ', windowWidth);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    }
    return true;
  };

  const saveImage = async () => {
    handleDefocus();
    const permission = await requestPermission();
    if (permission) {
      captureRef(viewRef, {
        format: 'png',
        quality: 1,
      }).then(
        uri => {
          saveImageToPhotos(uri);
        },
        error => console.error('Oops, snapshot failed', error),
      );
    }
  };

  const saveImageToPhotos = async uri => {
    const path = `${
      RNFS.TemporaryDirectoryPath
    }/Lemonade_Market_${Date.now()}.png`; // Path to temporary directory

    // Move the file to a temporary location
    await RNFS.moveFile(uri, path);

    // Now share the image, which allows saving it to Photos on iOS
    Share.open({
      url: 'file://' + path,
      title: 'Save Image',
      subject: 'Save Image to Photos',
      type: 'image/png',
    })
      .then(() => console.log('Image saved to Photos'))
      .catch(error => console.log('Error saving image to Photos:', error));
  };

  const formatDate = date => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = date => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Enables 12-hour format
    }).format(date);
  };

  const onChange = (event, selectedValue) => {
    const currentDate = selectedValue || date;
    // setShow(false);
    setDate(currentDate);

    if (Platform.OS === 'android') {
      if (event.type === 'set') {
        if (mode == 'date') {
          setShow(false);
          setDate(currentDate);
          setDateText(formatDate(currentDate));
          setMode('time');
          setShow(true);
          console.log('Selected Date : ', formatDate(currentDate));
        } else {
          console.log('Mode : ', mode);
          console.log('show ', show);
          setShow(false);
          setSelectedDateTime(currentDate);
          setTimeText(formatTime(currentDate));
          console.log('show ', show);
          console.log('Selected Date and time : ', formatTime(currentDate));
        }
      } else {
        setShow(false);
      }
    } else {
      if (mode === 'date') {
        setDate(currentDate);
        setDateText(formatDate(currentDate));
        console.log('Selected Date : ', formatDate(currentDate));
      } else {
        setSelectedDateTime(currentDate);
        setTimeText(formatTime(selectedDateTime));
        console.log('Selected Date and time : ', formatTime(currentDate));
      }
    }
  };

  const showDateTimePicker = () => {
    setMode('date'); // Start with date mode
    setShow(true); // Show the picker
  };

  const handleCaptureAndPrint = async () => {
    try {
      // Capture the view and get the image as base64 directly
      const base64String = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
        result: 'base64', // Directly capture in base64
      });

      const base64Data = `data:image/png;base64,${base64String}`;

      // await RNPrint.print({
      //   html: `<img src="${base64Data}" width="100%" />`, // Embed the base64 image for printing
      // });
      await RNPrint.print({
        html: `
    <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 210mm;
            height: 297mm;
          }
          .print-image {
            width: 100%;
            height: auto;
            max-width: 100%; /* Prevents image overflow */
          }
        </style>
      </head>
      <body>
        <img src="${base64Data}" width="100%" />
      </body>
    </html>
  `,
      });
    } catch (error) {
      console.error('Capture or Print Error:', error);
    }
  };

  const _scrollToInput = reactNode => {
    scrollViewRef.current?.scrollToFocusedInput(reactNode); // Ensure that scrollViewRef is not null
  };

  return (
    <View style={[styles.root, {position: 'relative'}]}>
      <SafeAreaView height={safeAreaHeight}>
        <Navigation
          navigationTitle={'MARKETING'}
          onPressBackBtn={() => navigation.goBack()}
          onPressForwardtBtn={() => navigation.goBack()}
          enableLeftBtn={true}
          enableRightBtn={false}
          style={{marginTop: Platform.OS === 'android' ? 25 : 0}}
        />
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          extraHeight={90}
          extraScrollHeight={50}
          height={safeAreaHeight - 100}
          style={{
            paddingVertical: 20,
            paddingHorizontal: wp(5),
          }}>
          <Androw style={styles.postContainerWrapper}>
            <View
              style={[styles.postContainer, {minHeight: minPostContHeight}]}
              collapsable={false}
              ref={viewRef}>
              <Text
                allowFontScaling={false}
                style={[styles.posterHeading, {fontSize: postContFontSize}]}>
                LEMONADE
              </Text>
              <View style={styles.posterImageWrapper}>
                <Image
                  style={styles.posterImage}
                  source={require('../../assets/images/lemon_cartoon.png')}
                />
              </View>

              <View style={styles.posterStandView}>
                <Text
                  allowFontScaling={false}
                  style={[styles.postStandText, {fontSize: postContFontSize}]}>
                  STAND
                </Text>
                <TouchableOpacity onPress={showDateTimePicker}>
                  <View style={styles.postDateTimeView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.postDateTimeText}>
                      {dateText}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={styles.postDateTimeText}>
                      {timeText}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.postLocationView}>
                <Image
                  style={styles.postLocationImage}
                  source={require('../../assets/images/location.png')}
                />
                <TextInput
                  allowFontScaling={false}
                  style={[
                    styles.postLocationTextInput,
                    {
                      fontSize:
                        windowWidth > 420
                          ? location.length > 20
                            ? wp(4.5)
                            : wp(5)
                          : windowWidth < 400
                          ? location.length > 20
                            ? wp(3.8)
                            : wp(4.2)
                          : location.length > 20
                          ? wp(4)
                          : wp(4.5),
                    },
                  ]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder={'ENTER LOCATION HERE'}
                  placeholderTextColor={'#737161'}
                  ref={locationInputFieldRef}
                  adjustsFontSizeToFit={true}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  multiline={true}
                  maxLength={55}
                  onFocus={event => {
                    _scrollToInput(event.target); // Scroll to the input field when it gains focus
                  }}
                />
              </View>
            </View>
          </Androw>
          <Androw style={styles.marketBtnWrapper}>
            <TouchableOpacity
              onPressIn={() => setPrintBtnPressed(true)}
              onPressOut={() => setPrintBtnPressed(false)}
              onPress={handleCaptureAndPrint}
              style={[
                styles.marketBtnContainer,
                styles.printBtnContainer,
                printBtnPressed && styles.bottomBtnPressed,
              ]}>
              <Text style={[styles.marketBtnText, styles.printBtnText]}>
                Print
              </Text>
            </TouchableOpacity>
          </Androw>
          <Androw style={styles.marketBtnWrapper}>
            <TouchableOpacity
              onPressIn={() => setShareBtnPressed(true)}
              onPressOut={() => setShareBtnPressed(false)}
              style={[
                styles.marketBtnContainer,
                styles.shareBtnContainer,
                shareBtnPressed && styles.bottomBtnPressed,
                {marginBottom: 40},
              ]}
              onPress={saveImage}>
              <Text style={[styles.marketBtnText, styles.shareBtnText]}>
                Share
              </Text>
            </TouchableOpacity>
          </Androw>
        </KeyboardAwareScrollView>
      </SafeAreaView>
      {show && (
        <View style={styles.dateTimePickerRoot}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.datePickerWrapper}>
              <DateTimePicker
                value={date}
                mode={mode}
                // is24Hour={true}
                display="spinner"
                onChange={onChange}
                textColor={'black'}
                style={styles.datePicker}
              />
              {Platform.OS !== 'android' && (
                <TouchableOpacity
                  style={styles.datePickerDoneBtn}
                  onPress={() => {
                    if (mode === 'date') {
                      setMode('time');
                    } else {
                      setShow(false);
                    }
                  }}>
                  <Text style={styles.datePickerBtnText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBDE',
  },
  postContainerWrapper: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  postContainer: {
    backgroundColor: '#FFFBDE',
    width: '100%',
    // height: 450,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#7dccfd',
    borderWidth: 4,
    padding: 10,
    marginBottom: 30,
    // aspectRatio: 322 / 416,
    borderRadius: 2,
  },
  posterHeading: {
    marginTop: 20,
    width: '100%',
    fontSize: wp(14),
    // lineHeight: 80,
    // backgroundColor: 'blue',
    textAlign: 'center',
    fontFamily: 'Cooper Black Italic Pro',
    transform: [{scaleY: 1.3}],
    color: 'black',
  },
  posterImageWrapper: {
    // width: '100%',
    maxWidth: '80%',
    width: '80%',
    aspectRatio: 1.089,
    // maxHeight: 250,
    // height: '50%',
    // maxHeight: '50%',
    alignItems: 'center',
    marginBottom: 10,
  },
  posterImage: {
    width: '80%',
    maxWidth: '100%',
    maxHeight: '100%',
    aspectRatio: 1.089,
  },
  posterStandView: {
    // marginTop: -30,
    width: '100%',
    // backgroundColor: 'orange',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 5,
  },
  postStandText: {
    // marginLeft: '10%',
    fontSize: wp(14),
    fontFamily: 'Cooper Black Italic Pro',
    transform: [{scaleY: 1.3}],
    color: 'black',
  },
  postDateTimeView: {
    gap: 5,
    maxHeight: 50,
  },
  postDateTimeText: {
    // fontSize: 18,
    fontSize: wp(5),
    fontFamily: 'Cooper Black Italic Pro',
    transform: [{scaleY: 1.3}],
    color: '#837b68',
  },
  postLocationView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 4,
  },
  postLocationImage: {
    maxHeight: 24,
    maxWidth: 24,
    height: 24,
    transform: [{translateY: Platform.OS === 'android' ? 0 : -10}],
    aspectRatio: 192 / 257,
    objectFit: 'scale-down',
  },
  postLocationTextInput: {
    width: '90%',
    // backgroundColor: 'orange',
    minHeight: 40,
    padding: 5,
    fontSize: 20,
    fontFamily: 'Cooper Black Italic Pro',
    letterSpacing: 1.5,
    transform: [{scaleY: 1.3}],
    color: '#837b68',
  },
  marketBtnContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  printBtnContainer: {
    backgroundColor: '#7dccfd',
  },
  shareBtnContainer: {
    backgroundColor: '#7dccfd',
  },
  marketBtnWrapper: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  marketBtnText: {
    fontSize: 40,
    fontFamily: 'AnonymousPro-Regular',
  },
  printBtnText: {
    color: 'white',
  },
  shareBtnText: {
    color: 'white',
  },
  bottomBtnPressed: {
    backgroundColor: '#FF6F8D',
    opacity: 1,
  },

  //   ==============
  dateTimePickerRoot: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  datePickerWrapper: {
    backgroundColor: 'rgba(255,251,222,1)',
    opacity: 1,
    borderRadius: 20,
    color: 'white',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  datePickerDoneBtn: {
    minHeight: 50,
    width: '100%',
    minWidth: '80%',
    // minWidth: '80%',
    padding: 5,
    backgroundColor: 'rgba(128,56,19,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  datePickerBtnText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MarketScreen;
