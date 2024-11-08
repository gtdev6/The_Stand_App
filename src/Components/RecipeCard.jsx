import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import Androw from 'react-native-androw';
import {imageAssets} from '../Screens/RecipiesScreen';
import {toggleFavourite} from '../slices/recipeSlice';
import {updateFavouriteStatus} from '../Utitlites/databaseConfig';
import {db} from '../../AppWrapper';
import {useDispatch} from 'react-redux';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

export function resolveImageSource(recipe) {
  let imageSource = Image.resolveAssetSource(
    require('../../assets/images/drink.jpg'),
  );
  if (recipe.imageUri !== undefined || recipe.imageUri !== null) {
    const imagePath = `${recipe.imageUri}`;
    imageSource = imageAssets[recipe.imageUri];
  } else if (recipe.image !== undefined || recipe.image !== null) {
    imageSource = recipe.image;
  }
  return imageSource;
}

function RecipeCard({navigation, recipe}) {
  const screenWidth = Dimensions.get('window').width;
  const dispatch = useDispatch();
  let imageSource = resolveImageSource(recipe);
  const [isFavourite, setIsFavourite] = React.useState(recipe.favourite);

  return (
    <Androw style={styles.recipeCardWrapper}>
      <TouchableOpacity
        style={styles.recipeCardBtn}
        onPress={() => navigation.navigate('RecipeDetails', {recipe})}>
        <View style={styles.recipeCardRoot}>
          <Image style={styles.recipeImage} source={imageSource} />
          <View style={styles.recipeNameContainer}>
            <View style={styles.recipeNameHeadings}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.recipeName,
                  {fontSize: screenWidth > 420 ? responsiveFontSize(2.4) : 20},
                ]}>
                {recipe.mainTitle ? recipe.mainTitle : 'Country Time'}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.recipeName,
                  {fontSize: screenWidth > 420 ? responsiveFontSize(2.4) : 20},
                ]}>
                {recipe.subTitle ? recipe.subTitle : 'Lemonade'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.recipeFavouriteBtnWrapper}
              onPress={async () => {
                setIsFavourite(!isFavourite);
                await updateFavouriteStatus(db, recipe.id, !isFavourite);
                dispatch(toggleFavourite({id: recipe.id}));
                // await fetchRecipe(db, recipe.id);
              }}>
              {isFavourite ? (
                <Image
                  style={styles.recipesHeartRedImage}
                  source={require('../../assets/images/heart_ic_liked.png')}
                />
              ) : (
                <Image
                  style={styles.recipesHeartImage}
                  source={require('../../assets/images/heart_ic.png')}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Androw>
  );
}

const styles = StyleSheet.create({
  recipeCardWrapper: {
    width: '100%',
    // height: '100%',
    shadowOffset:
      Platform.OS === 'android' ? {width: 0, height: 8} : {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowColor: 'rgba(0,0,0,1)',
    // backgroundColor: 'orange',
  },
  recipeCardBtn: {
    width: '100%',
    // height: 240,
    aspectRatio: 317 / 242,
    // overflow: 'hidden',
  },
  recipeCardRoot: {
    // height: '100%',
    width: '100%',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
    overflow: 'hidden',
  },
  recipeImage: {
    // borderTopLeftRadius: 18,
    // borderTopRightRadius: 18,
    width: '100%',
    height: '75%',
    objectFit: 'fit',
    objectPosition: 'center',
  },
  recipeNameContainer: {
    backgroundColor: '#fa7a98',
    height: '25%',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  recipeNameHeadings: {
    maxWidth: '80%',
    overflow: 'visible',
    // backgroundColor: 'orange',
  },
  recipeName: {
    fontSize: 20,
    color: '#202020',
    fontFamily: 'AnonymousPro-Regular',
  },
  recipeFavouriteBtnWrapper: {
    width: '15%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 4,
    // backgroundColor: 'blue',
  },
  recipesHeartImage: {
    width: 30,
    height: 21,
    maxHeight: 21,
    aspectRatio: 21 / 18,
  },
  recipesHeartRedImage: {
    width: 30,
    height: 21,
    maxHeight: 21,
    aspectRatio: 21 / 18,
  },
});

export default RecipeCard;
