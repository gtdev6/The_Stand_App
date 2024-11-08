import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Navigation from '../Components/Navigation';
import React, {useEffect} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Androw from 'react-native-androw';
import {resolveImageSource} from '../Components/RecipeCard';
import {updateLastAccessedTime} from '../Utitlites/databaseConfig';
import {db} from '../../AppWrapper';
import {setRecipes, updateAccessTime} from '../slices/recipeSlice';
import {useDispatch} from 'react-redux';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {RFPercentage} from 'react-native-responsive-fontsize';

function splitTextIfContainsExactPhrase(fullText, searchPhrase) {
  const lowerFullText = fullText.toLowerCase();
  const lowerSearchWords = searchPhrase.toLowerCase().split(' ');

  let currentIndex = 0;
  let beforePhrase = '';
  let matchingPhrase = '';
  let remainingText = '';
  let foundLemonade = false;

  for (let word of lowerSearchWords) {
    const wordIndex = lowerFullText.indexOf(word, currentIndex);

    if (wordIndex !== -1) {
      if (matchingPhrase === '') {
        // Set `beforePhrase` only for the first matched word
        beforePhrase = fullText.slice(0, wordIndex).trim();
      }

      if (word === 'lemonade') {
        foundLemonade = true;
        remainingText = fullText.slice(wordIndex).trim(); // Include "lemonade" and text after it
        break;
      } else {
        // Append only the matched word to `matchingPhrase`
        matchingPhrase +=
          fullText.slice(wordIndex, wordIndex + word.length) + ' ';
      }

      // Move currentIndex to just after the found word
      currentIndex = wordIndex + word.length;
    }
  }

  if (!foundLemonade) return null; // Return null if "lemonade" wasn't found

  const windowWidth = Dimensions.get('window').width;

  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.ingredientsItemText,
        {
          fontSize: windowWidth > 420 ? responsiveFontSize(2.4) : 20,
        },
      ]}>
      {beforePhrase}{' '}
      <Text allowFontScaling={false} style={{fontFamily: 'AnonymousPro-Bold'}}>
        {matchingPhrase.trim()}
      </Text>{' '}
      {remainingText}
    </Text>
  );
}

const RecipeDetails = ({route, navigation}) => {
  const windowHeight = Dimensions.get('window').height;
  const windowWidth = Dimensions.get('window').width;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const safeAreaHeight = windowHeight - insets.top - insets.bottom;
  const {recipe} = route.params;

  const imageSource = resolveImageSource(recipe);

  useEffect(() => {
    (async () => {
      await updateLastAccessedTime(db, recipe.id);
      const newAccessTime = new Date().toISOString();
      dispatch(updateAccessTime({id: recipe.id, newAccessTime}));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('================================');
  console.log('Window Width: ', windowWidth);
  console.log('================================');

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <Navigation
          onPressBackBtn={() => navigation.goBack()}
          onPressRightBtn={() => navigation.goBack()}
          navigationTitle={recipe.mainTitle ? recipe.mainTitle : 'Recipe'}
          enableLeftBtn={true}
          enableRightBtn={false}
          leftBtnImage={require('../../assets/images/back_arrow.png')}
        />
        <View style={styles.recipeTitleWrapper}>
          <Text
            allowFontScaling={false}
            style={[
              styles.recipeTitle,
              {fontSize: windowWidth > 420 ? responsiveFontSize(2.8) : 24},
            ]}>
            {recipe.subTitle ? recipe.subTitle : 'Sub-Title'}
          </Text>
        </View>
        <View
          style={[
            styles.recipeDetailsRoot,
            {
              height:
                Platform.OS === 'ios'
                  ? safeAreaHeight - 150
                  : windowHeight > 1000
                  ? safeAreaHeight - hp(22)
                  : safeAreaHeight - hp(26),
            },
          ]}>
          <ScrollView>
            <View style={styles.recipeDetailsInnerWrapper}>
              <Androw style={styles.recipeMainImageWrapper}>
                <Image style={styles.recipeMainImage} source={imageSource} />
              </Androw>
              <View style={styles.recipeIngredientsWrapper}>
                <View style={styles.recipeIngredientsTitleWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.recipeIngredientsTitle,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.8) : 20,
                      },
                    ]}>
                    Ingredients
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.recipeIngredientServings,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.2) : 20,
                      },
                    ]}>
                    {`(${recipe.servings ?? '25'} Servings)`}
                  </Text>
                </View>
                <View style={styles.ingredientItemsContainer}>
                  {recipe.ingredients.map((ingredient, index) => {
                    const result = splitTextIfContainsExactPhrase(
                      ingredient,
                      `${recipe.mainTitle} ${recipe.subTitle}`,
                    );

                    return (
                      <View style={styles.ingredientsItem} key={index}>
                        <Image
                          style={styles.ingredientsItemCircle}
                          source={require('../../assets/images/tick_circle.png')}
                        />
                        {result ? (
                          result
                        ) : (
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.ingredientsItemText,
                              {
                                fontSize:
                                  windowWidth > 420
                                    ? responsiveFontSize(2.2)
                                    : 20,
                              },
                            ]}>
                            {ingredient}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={styles.recipeIngredientsWrapper}>
                <View style={styles.recipeDirectionsTitleWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.recipeDirectionsTitle,
                      {
                        fontSize:
                          windowWidth > 420 ? responsiveFontSize(2.8) : 20,
                      },
                    ]}>
                    Directions
                  </Text>
                </View>
                <View
                  style={[
                    styles.recipeDirectionsItemsContainer,
                    {
                      gap: windowWidth > 420 ? 15 : 10,
                    },
                  ]}>
                  {recipe.directions.map((direction, index) => (
                    <View style={styles.ingredientsItem} key={index}>
                      <View style={styles.directionItemCircle}>
                        <Text
                          allowFontScaling={false}
                          style={styles.directionItemCircleText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.directionItemText,
                          {
                            fontSize:
                              windowWidth > 420 ? responsiveFontSize(2.2) : 20,
                          },
                        ]}>
                        {direction}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={[styles.bottomBtnWrapper, {marginBottom: 35}]}>
          <TouchableOpacity
            style={[styles.continueBtn]}
            onPress={() => navigation.navigate('Money')}>
            <Text
              allowFontScaling={false}
              style={[
                styles.continueBtnText,
                {
                  fontSize:
                    windowWidth > 420
                      ? responsiveFontSize(2.5)
                      : windowWidth < 400
                      ? 16
                      : 19,
                },
              ]}>
              Continue to Finance Planning
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fa7a98',
  },
  recipeTitleWrapper: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
  },
  recipeTitle: {
    width: '100%',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  safeArea: {
    // borderWidth: 4,
    // borderColor: 'orange',
  },
  recipeDetailsRoot: {
    width: '100%',
    height: '74%',
    // borderWidth: 2,
  },
  recipeDetailsInnerWrapper: {
    rowGap: 15,
  },

  recipeMainImageWrapper: {
    marginVertical: 15,
    width: '92%',
    // maxHeight: 240,
    aspectRatio: 361 / 240,
    marginHorizontal: '4%',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  recipeMainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  recipeIngredientsWrapper: {
    width: '100%',
    // backgroundColor: '#ff973c',
    // height: '50%',
    paddingHorizontal: 20,
  },
  recipeIngredientsTitleWrapper: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ingredientItemsContainer: {
    marginVertical: 10,
    gap: 10,
  },
  ingredientsItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  ingredientsItemText: {
    fontSize: 20,
    maxWidth: '90%',
    letterSpacing: 1.5,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    marginTop: -1,
  },
  ingredientsItemCircle: {
    width: 24,
    height: 24,
  },
  recipeIngredientsTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'black',
    fontFamily: 'AnonymousPro-Bold',
  },
  recipeIngredientServings: {
    fontSize: 18,
    fontWeight: 'light',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  bottomBtnWrapper: {
    width: '100%',
    // height: 60,
    paddingHorizontal: 30,
    paddingVertical: 5,
  },
  continueBtn: {
    borderWidth: 2,
    borderColor: 'black',
    // height: 45,
    width: '100%',
    aspectRatio: 347 / 43,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#75ccfa',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  continueBtnText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'AnonymousPro-Bold',
  },
  recipeDirectionsTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  recipeDirectionsTitle: {
    fontSize: 22,
    color: 'black',
    fontFamily: 'AnonymousPro-Bold',
  },
  recipeDirectionsItemsContainer: {
    marginVertical: 10,
    gap: 10,
  },
  directionsItems: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  directionItemCircle: {
    borderRadius: 12,
    width: 24,
    height: 24,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  directionItemCircleText: {
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
  },
  directionItemText: {
    fontSize: 20,
    maxWidth: '90%',
    letterSpacing: 1.5,
    color: 'black',
    fontFamily: 'AnonymousPro-Regular',
    // backgroundColor: 'orange',
    marginTop: 0,
    // lineHeight: 30,
    textAlignVertical: 'top',
  },
});

export default RecipeDetails;
