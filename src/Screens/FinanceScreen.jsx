import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {unstable_batchedUpdates} from 'react-native';
import Navigation from '../Components/Navigation';
import React, {useEffect, useRef, useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Slider} from '@rneui/base';
import Androw from 'react-native-androw';
import {useSelector} from 'react-redux';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

function formatNumber(num) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

const FinanceScreen = ({route, navigation}) => {
  const firstRecipe = useSelector(state => state.recipes.recipes[0]);
  let {recipe} = route.params ?? firstRecipe;
  if (!recipe) recipe = firstRecipe;
  const [ingredientCost, setIngredientCost] = useState(
    `$${recipe.ingredientsPrice}` ?? `0`,
  );

  const [totalSales, setTotalSales] = useState(recipe.servings);
  const [pricePerCup, setPricePerCup] = useState(0.0);
  const [otherCost, setOtherCost] = useState('');
  const [totalProfit, setTotalProfit] = useState(0.0);
  const [totalRevenue, setTotalRevenue] = useState(0.0);
  const [totalCost, setTotalCost] = useState(0.0);

  const otherCostF = parseFloat(otherCost) || 0.0;
  let ingredient_Cost = parseFloat(
    ingredientCost.startsWith('$') ? ingredientCost.slice(1) : ingredientCost,
  );

  if (isNaN(ingredient_Cost)) {
    ingredient_Cost = 0;
  }

  // let totalCost = 0;
  // let totalCost = ingredient_Cost + otherCostF;
  useEffect(() => {
    if (totalCost == isNaN(totalCost)) {
      setTotalCost(0);
    }
  }, [totalCost]);

  // const totalProfit = (totalSales * pricePerCup - totalCost).toFixed(2);
  // const totalProfit = 0;

  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  // console.log('Window Width : ', windowWidth);
  const insets = useSafeAreaInsets();
  const safeAreaHeight = windowHeight - insets.top - insets.bottom;
  const scrollViewRef = useRef(null); // Use useRef to access the scroll view instance

  const _scrollToInput = reactNode => {
    scrollViewRef.current?.scrollToFocusedInput(reactNode); // Ensure that scrollViewRef is not null
  };

  const handleNumberInput = input => {
    const validInput = input ? input.toString() : '';
    const filteredInput = validInput.replace(/[^0-9.]/g, '');
    const decimalCount = (filteredInput.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return validInput.slice(0, -1);
    }
    return filteredInput;
  };

  useEffect(() => {
    const cost = recipe.ingredientsPrice ?? 0;
    setIngredientCost(`${cost}`);
  }, []);

  useEffect(() => {
    setTotalProfit(() => (totalSales * pricePerCup - totalCost).toFixed(2));
  }, [totalCost]);

  return (
    <View style={styles.root}>
      <SafeAreaView>
        <Navigation
          navigationTitle={'FINANCES'}
          onPressBackBtn={() => navigation.goBack()}
          onPressForwardBtn={() => navigation.navigate('Build')}
          enableLeftBtn={true}
          enableRightBtn={true}
          style={{marginTop: Platform.OS === 'android' ? 20 : 0}}
        />
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          extraHeight={Platform.OS === 'android' ? 150 : 200}
          extraScrollHeight={50}
          contentContainerStyle={{
            gap: 15,
            justifyContent: 'flex-start',
          }}>
          <View>
            <Androw style={styles.profitViewWrapper}>
              <View
                style={[
                  styles.profitView,
                  styles.financeView,
                  {width: windowWidth - 40},
                ]}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.profitLabelText,
                    {
                      fontSize:
                        windowWidth > 420
                          ? responsiveFontSize(4.2)
                          : windowWidth < 400
                          ? 32
                          : 36,
                    },
                  ]}>
                  PROFITS:
                </Text>
                <TextInput
                  allowFontScaling={false}
                  style={[
                    styles.profitTextfield,
                    {
                      fontSize:
                        windowWidth > 420
                          ? totalProfit < 0
                            ? `-$${formatNumber(totalProfit * -1)}`.length > 7
                              ? `-$${formatNumber(totalProfit * -1)}`.length > 9
                                ? responsiveFontSize(1.8)
                                : responsiveFontSize(2.4)
                              : responsiveFontSize(2.8)
                            : `$${formatNumber(totalProfit)}`.length > 6
                            ? responsiveFontSize(2.7)
                            : responsiveFontSize(3.2)
                          : totalProfit < 0
                          ? `-$${formatNumber(totalProfit * -1)}`.length > 7
                            ? 16
                            : 22
                          : `$${formatNumber(totalProfit)}`.length > 6
                          ? 20
                          : 22,
                    },
                  ]}
                  keyboardType={'number-pad'}
                  maxLength={12}
                  value={
                    totalProfit < 0
                      ? `-$${formatNumber(totalProfit * -1)}`
                      : `$${formatNumber(totalProfit)}`
                  }
                  editable={false}
                  focusable={false}
                />
              </View>
            </Androw>
          </View>

          <Androw style={styles.revenueViewWrapper}>
            <View
              style={[
                styles.financeView,
                styles.revenueView,
                {width: windowWidth - 40},
              ]}>
              <View style={styles.letterContainer}>
                {'REVENUE'.split('').map((char, index) => (
                  <Text
                    allowFontScaling={false}
                    key={index}
                    style={[
                      styles.letter,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(3.6) : 28,
                      },
                    ]}>
                    {char}
                  </Text>
                ))}
              </View>
              <View style={styles.revenueDetailsView}>
                <View style={styles.cupsRevenueView}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.cupsTextRV,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.8) : 20,
                      },
                    ]}>{`${totalSales} cups`}</Text>
                  <Slider
                    value={totalSales}
                    onValueChange={newValue => {
                      setTotalSales(newValue);
                      setIngredientCost(
                        `${(
                          (totalSales / recipe.servings) *
                          recipe.ingredientsPrice
                        ).toFixed(2)}`,
                      );
                      // const totalProfit = (
                      //   totalSales * pricePerCup -
                      //   totalCost
                      // ).toFixed(2);
                      // setTotalProfit(totalProfit);
                    }}
                    maximumValue={100}
                    minimumValue={0}
                    step={1}
                    allowTouchTrack
                    trackStyle={styles.trackStyle}
                    thumbStyle={{
                      height: 32,
                      width: 32,
                      backgroundColor: '#dafcee',
                      borderWidth: 2,
                      borderColor: 'black',
                    }}
                    maximumTrackTintColor={'#fff'}
                    minimumTrackTintColor={'#feeb4b'}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.cupsTotalSalesTextRV,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                      },
                    ]}>
                    Total Sales
                  </Text>
                </View>
                <View style={styles.cupsRevenueView}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.cupsTextRV,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.8) : 20,
                      },
                    ]}>{`$ ${pricePerCup.toFixed(2)} / cup`}</Text>
                  <Slider
                    value={pricePerCup}
                    onValueChange={newValue => {
                      setPricePerCup(newValue);
                      // const totalProfit = (
                      //   totalSales * pricePerCup -
                      //   totalCost
                      // ).toFixed(2);
                      // setTotalProfit(totalProfit);
                    }}
                    maximumValue={10}
                    minimumValue={0}
                    step={0.1}
                    allowTouchTrack
                    trackStyle={styles.trackStyle}
                    thumbStyle={{
                      height: 32,
                      width: 32,
                      backgroundColor: '#dafcee',
                      borderWidth: 2,
                      borderColor: 'black',
                    }}
                    maximumTrackTintColor={'#fff'}
                    minimumTrackTintColor={'#feeb4b'}
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.cupsTotalSalesTextRV,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                      },
                    ]}>
                    Price Per Cup
                  </Text>
                </View>
                <View style={styles.cupsFormulaView}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.cupsFormulaViewFText,
                      {
                        fontSize:
                          windowWidth > 420
                            ? responsiveFontSize(1.8)
                            : windowWidth < 400
                            ? 12
                            : 14,
                      },
                    ]}>
                    Total Sales x Price Per Cup =
                  </Text>
                  <View style={styles.cupsFormulaLV}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.cupsFormulaLVText,
                        {
                          fontSize:
                            windowWidth > 420
                              ? responsiveFontSize(2.9)
                              : windowWidth < 400
                              ? 20
                              : 24,
                        },
                      ]}>
                      Total Revenue
                    </Text>
                    <TextInput
                      allowFontScaling={false}
                      style={[
                        styles.cupsFormulaLVTextField,
                        {
                          fontSize:
                            windowWidth > 420
                              ? `$${(totalSales * pricePerCup).toFixed(2)}`
                                  .length > 6
                                ? responsiveFontSize(1.6)
                                : responsiveFontSize(2)
                              : windowWidth < 400
                              ? `$${(totalSales * pricePerCup).toFixed(2)}`
                                  .length > 7
                                ? 11
                                : `$${(totalSales * pricePerCup).toFixed(2)}`
                                    .length > 5
                                ? 13
                                : 15
                              : 16,
                        },
                      ]}
                      value={`$${formatNumber(totalRevenue)}`}
                      keyboardType={'number-pad'}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Androw>

          <Androw style={styles.costViewWrapper}>
            <View
              style={[
                styles.financeView,
                styles.costView,
                {width: windowWidth - 40},
              ]}>
              <View style={styles.letterContainer}>
                {'COST'.split('').map((char, index) => (
                  <Text
                    allowFontScaling={false}
                    key={index}
                    style={[
                      styles.letter,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(3.6) : 28,
                      },
                    ]}>
                    {char}
                  </Text>
                ))}
              </View>
              <View style={styles.costDetailsView}>
                <View style={styles.costDetailsViewUpperWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.costDetailsViewUWText,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                      },
                    ]}>
                    Ingredients
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    style={styles.costDetailsViewUWTF}
                    placeholder={'type here'}
                    placeholderTextColor={'#afafaf'}
                    textAlign={'center'}
                    maxLength={5}
                    keyboardType={'number-pad'}
                    onFocus={event => {
                      _scrollToInput(event.target);
                    }}
                    value={`$${ingredientCost}`}
                    // editable={false}
                    onChangeText={newText => {
                      const sanitizedText = newText.startsWith('$')
                        ? newText.slice(1)
                        : newText;
                      let validInput = handleNumberInput(sanitizedText);
                      if (isNaN(parseFloat(validInput))) {
                        validInput = '';
                      }
                      setIngredientCost(`${validInput}`);
                      const totalRevenue = (totalSales * pricePerCup).toFixed(
                        2,
                      );
                      let tempIngredientCost = parseFloat(validInput);
                      if (isNaN(tempIngredientCost)) {
                        tempIngredientCost = 0;
                      }
                      // setTotalProfit(
                      //   parseFloat(totalRevenue).toFixed(2) -
                      //     parseFloat(tempIngredientCost + otherCostF).toFixed(
                      //       2,
                      //     ),
                      // );
                      // console.log(
                      //   'Total Profit : ----',
                      //   tempIngredientCost +
                      //     otherCostF +
                      //     parseFloat(totalRevenue),
                      // );
                    }}
                    focusable={true}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.costDetailsSignText,
                    {
                      fontSize:
                        windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                      marginRight:
                        windowWidth > 420 ? 10 : windowWidth < 400 ? 20 : 10,
                    },
                  ]}>
                  +
                </Text>
                <View style={styles.costDetailsViewUpperWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.costDetailsViewUWText,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                      },
                    ]}>
                    {' '}
                    Other
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    style={styles.costDetailsViewUWTF}
                    placeholder={'type here'}
                    placeholderTextColor={'#afafaf'}
                    textAlign={'center'}
                    keyboardType={'number-pad'}
                    onFocus={event => {
                      _scrollToInput(event.target); // Scroll to the input field when it gains focus
                    }}
                    value={`${otherCost}`}
                    maxLength={5}
                    onChangeText={text => {
                      const validInput = handleNumberInput(text);
                      let ingredientsPrice = parseFloat(
                        ingredientCost.startsWith('$')
                          ? ingredientCost.slice(1)
                          : ingredientCost,
                      );
                      let other_Cost = parseFloat(validInput);
                      if (isNaN(other_Cost)) {
                        other_Cost = '';
                      }
                      setOtherCost(other_Cost);
                      // if (isNaN(ingredientsPrice)) {
                      //   ingredientsPrice = 0;
                      // }

                      // const totalRevenue = (totalSales * pricePerCup).toFixed(
                      //   2,
                      // );
                      // setTotalProfit(
                      //   parseFloat(totalRevenue).toFixed(2) -
                      //     (ingredientsPrice + other_Cost),
                      // );
                    }}
                  />
                </View>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.costDetailsSignText,
                    {
                      fontSize:
                        windowWidth > 420 ? responsiveFontSize(2.4) : 16,
                    },
                    // {
                    //   paddingRight:
                    //     windowWidth > 420 ? 15 : windowWidth < 400 ? -10 : -4,
                    // },
                  ]}>
                  =
                </Text>
                <View style={styles.costDetailsBottomWrapperView}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.costDetailsBWText,
                      {
                        fontSize:
                          windowWidth > 420
                            ? responsiveFontSize(3.2)
                            : windowWidth < 400
                            ? 20
                            : 24,
                      },
                    ]}>
                    Total Cost
                  </Text>
                  <TextInput
                    allowFontScaling={false}
                    style={[
                      styles.costDetailsBWTF,
                      {
                        fontSize:
                          windowWidth > 420
                            ? responsiveFontSize(2.3)
                            : `$${parseFloat(totalCost).toFixed(2)}`.length > 7
                            ? 18
                            : 22,
                      },
                    ]}
                    value={`$${formatNumber(totalCost)}`}
                    onFocus={event => {
                      _scrollToInput(event.target); // Scroll to the input field when it gains focus
                    }}
                    keyboardType={'number-pad'}
                    editable={false}
                    focusable={false}
                  />
                </View>
              </View>
            </View>
          </Androw>
          <Androw style={styles.costViewWrapper}>
            <TouchableOpacity
              onPress={() => {
                unstable_batchedUpdates(() => {
                  setTotalRevenue(prevState => totalSales * pricePerCup);
                  setTotalCost(ingredient_Cost + otherCostF);
                });
              }}
              style={[styles.calculateBtn, {width: windowWidth - 40}]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.calculateBtnText,
                  {
                    fontSize: windowWidth > 420 ? responsiveFontSize(4.6) : 36,
                  },
                ]}>
                CALCULATE
              </Text>
            </TouchableOpacity>
          </Androw>
        </KeyboardAwareScrollView>
        {/*</KeyboardAvoidingView>*/}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  root: {
    backgroundColor: '#fefbe6',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    width: '100%',
  },

  profitViewWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // marginBottom: 25,
  },
  profitView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  financeView: {
    alignSelf: 'center',
    padding: 15,
    marginTop: 10,
    backgroundColor: '#4bd89e',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 2,
    color: 'black',
  },
  profitLabelText: {
    width: '60%',
    fontSize: 34,
    letterSpacing: 2,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  profitTextfield: {
    backgroundColor: '#feeb4b',
    borderWidth: 3,
    borderColor: 'black',
    width: '35%',
    height: 70,
    borderRadius: 12,
    fontSize: 24,
    padding: 10,
    fontFamily: 'AnonymousPro-Regular',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  revenueViewWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  revenueView: {
    flexDirection: 'row',
    borderRadius: 25,
    gap: 10,
    // marginBottom: 30,
    // maxHeight: 200,
    overflow: 'hidden',
  },
  letterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontSize: 30,
    color: 'black',
  },
  revenueDetailsView: {
    // borderWidth: 2,
    // borderColor: 'black',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  cupsRevenueView: {
    // borderWidth: 2,
    // borderColor: 'blue',
    width: '90%',
  },
  cupsTextRV: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'AnonymousPro-Bold',
    // fontWeight: '800',
  },
  cupsTotalSalesTextRV: {
    marginTop: -2,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  revenueSlider: {
    width: '100%',
    height: 10,
  },
  trackStyle: {
    backgroundColor: '#feeb4b',
    color: 'red',
    height: 15,
    borderRadius: 7,
  },
  cupsFormulaView: {
    backgroundColor: '#feeb4b',
    borderWidth: 1,
    borderColor: 'black',
    width: '90%',
    height: 72,
    borderRadius: 10,
    padding: 8,
    gap: 5,
  },
  cupsFormulaViewFText: {
    fontSize: 14,
    maxWidth: '100%',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  cupsFormulaLV: {
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxHeight: '60%',
  },
  cupsFormulaLVText: {
    fontSize: 24,
    width: '70%',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  cupsFormulaLVTextField: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    width: '27%',
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 3,
    padding: 5,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    textAlign: 'center',
  },
  /*
   * COST DETAILS VIEW
   * */
  costViewWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // marginBottom: 80,
  },
  costView: {
    flexDirection: 'row',
    borderRadius: 25,
    gap: 10,
    marginBottom: 10,
  },
  costDetailsView: {
    // borderWidth: 2,
    // borderColor: 'black',
    width: '90%',
    gap: 2,
    justifyContent: 'space-between',
  },
  costDetailsViewUpperWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: 'blue',
    gap: 20,
  },
  costDetailsViewUWText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    // backgroundColor: 'orange',
    paddingHorizontal: 4,
  },
  costDetailsViewUWTF: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 35,
    width: 103,
    fontSize: 18,
    lineHeight: 18,
    borderRadius: 10,
    padding: 5,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  costDetailsSignText: {
    width: '100%',
    textAlign: 'right',
    fontSize: 18,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    // textAlignVertical: 'center',
    marginTop: -5,
    paddingRight: 145,
  },
  costDetailsBottomWrapperView: {
    backgroundColor: '#feea54',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 4,
    gap: 10,
  },
  costDetailsBWText: {
    fontSize: 24,
    // letterSpacing: 3,
    fontFamily: 'AnonymousPro-Regular',
    color: 'black',
  },
  costDetailsBWTF: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    height: 30,
    width: '46%',
    fontSize: 22,
    borderRadius: 10,
    padding: 5,
    color: 'black',
    margin: 2,
    paddingHorizontal: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'AnonymousPro-Regular',
  },
  calculateBtn: {
    alignSelf: 'center',
    // height: 50,
    aspectRatio: 344 / 47,
    backgroundColor: '#feed51',
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
  },

  calculateBtnText: {
    fontSize: 36,
    // lineHeight: 34,
    letterSpacing: 1.5,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
});

export default FinanceScreen;
