import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RecipeCard from '../Components/RecipeCard';
import Navigation from '../Components/Navigation';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllRecipes, setRecipes} from '../slices/recipeSlice';
import {getAllRecipes} from '../Utitlites/databaseConfig';
import {db} from '../../AppWrapper';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const imageAssets = {
  '../../assets/images/LemonadeImages/country_time_lemonade.png': require('../../assets/images/LemonadeImages/country_time_lemonade.png'),
  '../../assets/images/LemonadeImages/classic_homemade_lemonade.png': require('../../assets/images/LemonadeImages/classic_homemade_lemonade.png'),
  '../../assets/images/LemonadeImages/strawberry_lemonade.png': require('../../assets/images/LemonadeImages/strawberry_lemonade.png'),
  '../../assets/images/LemonadeImages/country_time_pink_lemonade.png': require('../../assets/images/LemonadeImages/country_time_pink_lemonade.png'),
  '../../assets/images/LemonadeImages/mint_lemonade.png': require('../../assets/images/LemonadeImages/mint_lemonade.png'),
};

const RecipesScreen = ({navigation}) => {
  const recipes = useSelector(selectAllRecipes);
  const windowHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const safeAreaHeight = windowHeight - insets.top - insets.bottom;

  useEffect(() => {}, [recipes]);
  return (
    <View style={styles.root}>
      <SafeAreaView height={safeAreaHeight}>
        <Navigation
          navigationTitle={'RECIPES'}
          onPressBackBtn={() => navigation.goBack()}
          onPressForwardBtn={() => {
            if (recipes && recipes.length > 0) {
              navigation.navigate('Money', {recipe: recipes[0]});
            }
          }}
          enableLeftBtn={true}
          enableRightBtn={true}
          style={{
            marginTop: Platform.OS === 'android' ? '6%' : '0%',
          }}
        />
        <ScrollView
          style={{marginBottom: Platform.OS === 'android' ? '8%' : '0%'}}>
          <View style={[styles.recipeCardContainer]}>
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                navigation={navigation}
                recipe={recipe}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fefbe6',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  //   ScrollViews
  recipeCardContainer: {
    gap: 40,
    paddingHorizontal: 35,
    paddingVertical: 20,
  },
});

export default RecipesScreen;
