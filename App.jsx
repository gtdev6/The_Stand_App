/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/Screens/HomeScreen';
import MenuScreen from './src/Screens/MenuScreen';
import RecipesScreen from './src/Screens/RecipiesScreen';
import RecipeDetails from './src/Screens/RecipeDetails';
import FinanceScreen from './src/Screens/FinanceScreen';
import BuildScreen from './src/Screens/BuildScreen';
import MarketScreen from './src/Screens/MarketScreen';

const Stack = createNativeStackNavigator();

import {LogBox} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {
  checkAndPrepopulateRecipes,
  createRecipesTable,
  getAllRecipes,
  resetDatabase,
} from './src/Utitlites/databaseConfig';
import {setRecipes} from './src/slices/recipeSlice';
import {db} from './AppWrapper';

LogBox.ignoreLogs([
  'Warning: Slider: Support for defaultProps will be removed from function components', // Suppress specific warning
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // resetDatabase(db);
        await createRecipesTable(db);
        await checkAndPrepopulateRecipes(db);
        await fetchRecipes();
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };

    initializeDatabase();
  }, []);

  // Function to fetch data from the database
  const fetchRecipes = async () => {
    try {
      const fetchedRecipes = await getAllRecipes(db);
      if (fetchedRecipes && fetchedRecipes.length > 0) {
        dispatch(setRecipes(fetchedRecipes));
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{animationEnabled: true, headerShown: false}}
        style={{backgroundColor: '#FFFBDE'}}>
        <Stack.Screen
          name={'Home'}
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Menu'}
          component={MenuScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Recipes'}
          component={RecipesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'RecipeDetails'}
          component={RecipeDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Money'}
          component={FinanceScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Build'}
          component={BuildScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Market'}
          component={MarketScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
