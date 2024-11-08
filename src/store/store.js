import {configureStore} from '@reduxjs/toolkit';
import recipeReducer from '../slices/recipeSlice';
// Create the store
const store = configureStore({
  reducer: {
    recipes: recipeReducer,
  },
});

export default store;
