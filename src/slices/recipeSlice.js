import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  recipes: [], // Initial state containing an empty array of recipes
};

export const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    // Set all recipes
    setRecipes: (state, action) => {
      state.recipes = action.payload; // Set the recipes from payload
    },

    // Add a new recipe to the list
    addRecipe: (state, action) => {
      state.recipes.push(action.payload); // Add a new recipe
    },

    // Update a specific recipe
    updateRecipe: (state, action) => {
      const {id, updatedRecipe} = action.payload;
      const index = state.recipes.findIndex(recipe => recipe.id === id);
      if (index !== -1) {
        state.recipes[index] = {...state.recipes[index], ...updatedRecipe}; // Update the recipe with new data
      }

      // Sort recipes after updating
      state.recipes.sort((a, b) => {
        // Sort by favourite first (descending), then by accessTime (descending)
        if (b.favourite !== a.favourite) {
          return b.favourite - a.favourite;
        }
        return new Date(b.accessTime) - new Date(a.accessTime);
      });
    },

    // Remove a recipe by its ID
    removeRecipe: (state, action) => {
      state.recipes = state.recipes.filter(
        recipe => recipe.id !== action.payload,
      ); // Remove the recipe by ID
    },

    // Toggle the favourite status of a recipe and sort the recipes
    toggleFavourite: (state, action) => {
      const {id} = action.payload; // Get the recipe ID from the payload
      console.log('id : ', id);
      const recipe = state.recipes.find(recipe => recipe.id === id); // Find the recipe
      if (recipe) {
        recipe.favourite = !recipe.favourite; // Toggle the favourite status

        // Sort the recipes by favourite and accessTime
        state.recipes.sort((a, b) => {
          if (b.favourite !== a.favourite) {
            return b.favourite - a.favourite; // Favourites first
          }
          return new Date(b.accessTime) - new Date(a.accessTime); // Then sort by access time
        });
      }
    },

    // Update the access time of a recipe and sort the recipes
    updateAccessTime: (state, action) => {
      const {id, newAccessTime} = action.payload; // Get the recipe ID and new access time from the payload
      console.log('id : ', id);
      const recipe = state.recipes.find(recipe => recipe.id === id); // Find the recipe
      if (recipe) {
        recipe.accessTime = newAccessTime; // Update the access time

        // Sort the recipes after access time is updated
        state.recipes.sort((a, b) => {
          if (b.favourite !== a.favourite) {
            return b.favourite - a.favourite; // Sort favourites first
          }
          return new Date(b.accessTime) - new Date(a.accessTime); // Sort by access time
        });
      }
    },
  },
});

// Export the actions to be used in components
export const {
  setRecipes,
  addRecipe,
  updateRecipe,
  removeRecipe,
  toggleFavourite,
  updateAccessTime,
} = recipeSlice.actions;

// Selector to get all recipes
export const selectAllRecipes = state => state.recipes.recipes;

export default recipeSlice.reducer;
