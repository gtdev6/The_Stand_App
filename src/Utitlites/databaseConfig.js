import SQLite from 'react-native-sqlite-storage';
import {recipesData} from './staticData';
import {Image} from 'react-native';
import RNFS from 'react-native-fs';

export function openDatabase() {
  const db = SQLite.openDatabase(
    {
      name: 'TheStandApp.db',
      location: 'default', // default location is 'default' or 'Library'
    },
    () => {
      console.log('Database opened successfully');
    },
    error => {
      console.log('Error opening database: ', error);
    },
  );
  return db;
}

export function createRecipesTable(db) {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Recipe (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mainTitle TEXT NOT NULL,
      subTitle TEXT,
      imageUri TEXT,
      image TEXT,
      ingredients TEXT,   -- JSON string of ingredients
      servings INTEGER,
      directions TEXT,    -- JSON string of directions
      ingredientsPrice REAL,
      favourite INTEGER,  -- 0 for false, 1 for true
      lastAccessed TEXT DEFAULT (datetime('now'))   -- store as ISO 8601 timestamp (e.g., '2024-10-22T10:00:00Z')
    )`,
      [],
      () => {
        // console.log('Recipe table created successfully');
      },
      error => {
        console.log('Error creating table:', error);
      },
    );
  });
}

export function createRecipeDetailsTable(db) {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS RecipeDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipeId INTEGER NOT NULL,
        currentCupsSold INTEGER DEFAULT 0,
        pricePerCup REAL NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES Recipe (id) ON DELETE CASCADE
      )`,
      [],
      () => {
        console.log('RecipeDetails table created successfully');
      },
      error => {
        console.log('Error creating RecipeDetails table:', error);
      },
    );
  });
}

export function createRecipe(db, recipe) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Recipe (mainTitle, subTitle, imageUri, image, ingredients, servings, directions, ingredientsPrice, favourite, lastAccessed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        recipe.mainTitle,
        recipe.subTitle,
        recipe.imageUri,
        recipe.image,
        recipe.ingredients,
        recipe.servings,
        recipe.directions,
        recipe.ingredientsPrice,
        recipe.favourite,
        recipe.lastAccessed,
      ],
      (tx, results) => {
        // console.log('Recipe inserted successfully');
      },
      error => {
        console.log('Error inserting recipe:', error);
      },
    );
  });
}

export const getAllRecipes = db => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        // Sort by favourite first (1 = true), then by lastAccessed in descending order
        'SELECT * FROM Recipe ORDER BY favourite DESC, lastAccessed DESC',
        [],
        (tx, results) => {
          const rows = results.rows;
          let recipes = [];
          // console.log('Rows Length : ', rows.item(0));
          for (let i = 0; i < rows.length; i++) {
            const recipe = rows.item(i);
            try {
              recipes.push({
                id: recipe.id,
                mainTitle: recipe.mainTitle,
                subTitle: recipe.subTitle,
                imageUri: recipe.imageUri,
                image: recipe.image,
                ingredients: JSON.parse(recipe.ingredients), // Parse JSON string to array
                servings: recipe.servings,
                directions: JSON.parse(recipe.directions), // Parse JSON string to array
                ingredientsPrice: recipe.ingredientsPrice,
                favourite: Boolean(recipe.favourite), // Convert 0/1 to boolean
                lastAccessed: recipe.lastAccessed,
              });
              // console.log('Recipe favourite', recipe.favourite);
            } catch (e) {
              console.log('Error', e);
            }
          }
          resolve(recipes); // Return sorted recipes
        },
        error => {
          console.log('Error fetching recipes:', error);
          reject(error);
        },
      );
    });
  });
};

export const updateLastAccessedTime = (db, recipeId) => {
  const currentTimestamp = new Date().toISOString(); // Get current date in ISO 8601 format

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Recipe SET lastAccessed = ? WHERE id = ?',
        [currentTimestamp, recipeId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            // console.log(
            //   `Recipe with ID ${recipeId} lastAccessed time updated successfully`,
            // );
            resolve(true); // Successfully updated
          } else {
            // console.log('No recipe found with the given ID');
            resolve(false); // No rows updated
          }
        },
        error => {
          console.log('Error updating lastAccessed time:', error);
          reject(error);
        },
      );
    });
  });
};

export const updateFavouriteStatus = (db, recipeId, isFavourite) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Recipe SET favourite = ? WHERE id = ?',
        [isFavourite ? 1 : 0, recipeId], // Convert boolean to 0 or 1
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log(`Recipe with ID ${recipeId} updated successfully`);
            resolve(true); // Successfully updated
          } else {
            // console.log('No recipe found with the given ID');
            resolve(false); // No rows updated
          }
        },
        error => {
          console.log('Error updating favourite status:', error);
          reject(error);
        },
      );
    });
  });
};
export const checkAndPrepopulateRecipes = async db => {
  return new Promise((resolve, reject) => {
    db.transaction(async tx => {
      // Step 1: Check if the Recipe table is empty
      tx.executeSql(
        'SELECT COUNT(*) AS count FROM Recipe',
        [],
        async (tx, results) => {
          const count = results.rows.item(0).count;

          if (count === 0) {
            // console.log('Recipe table is empty. Prepopulating data...');

            // Step 2: Prepopulate the Recipe table if empty
            for (const recipe of recipesData) {
              // Step 3: Insert the prepopulated recipes into the database
              tx.executeSql(
                `INSERT INTO Recipe (mainTitle, subTitle, imageUri, image, ingredients, servings, directions, ingredientsPrice, favourite, lastAccessed) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
                [
                  recipe.mainTitle,
                  recipe.subTitle,
                  recipe.imageUri,
                  recipe.image,
                  JSON.stringify(recipe.ingredients),
                  recipe.servings,
                  JSON.stringify(recipe.directions),
                  recipe.ingredientsPrice,
                  0, // Assuming favourite defaults to 0
                  null, // lastAccessed can be null or use default from the database
                ],
                (tx, results) => {
                  // console.log('Recipe inserted successfully:', results);
                },
                error => {
                  console.log('Error inserting recipe:', error);
                  reject(error);
                },
              );
            }

            resolve('Table was empty, prepopulated with recipes.');
          } else {
            // console.log('Recipe table is not empty.');
            resolve('Table already contains data.');
          }
        },
        error => {
          console.log('Error checking if table is empty:', error);
          reject(error);
        },
      );
    });
  });
};

export const fetchRecipe = async (db, recipeId) => {
  try {
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Recipe WHERE id = ?',
        [recipeId],
        (_, {rows}) => {
          if (rows.length > 0) {
            const updatedRecipe = rows.item(0);
            console.log('Updated Recipe:', updatedRecipe); // Update state with the fetched recipe
          }
        },
        (_, error) => {
          console.error('Error fetching recipe:', error);
        },
      );
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
  }
};

export function createRecipeDetails(db, details) {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO RecipeDetails (recipeId, currentCupsSold, pricePerCup) VALUES (?, ?, ?)',
      [details.recipeId, details.currentCupsSold, details.pricePerCup],
      (tx, results) => {
        console.log('RecipeDetails inserted successfully');
      },
      error => {
        console.log('Error inserting into RecipeDetails:', error);
      },
    );
  });
}

export function createOrUpdateRecipeDetails(db, details) {
  db.transaction(tx => {
    // Step 1: Check if RecipeDetails already exists for the given recipeId
    tx.executeSql(
      'SELECT * FROM RecipeDetails WHERE recipeId = ?',
      [details.recipeId],
      (tx, results) => {
        if (results.rows.length > 0) {
          // RecipeDetails already exists, so update the record
          const existingRecord = results.rows.item(0);
          tx.executeSql(
            'UPDATE RecipeDetails SET currentCupsSold = ?, pricePerCup = ? WHERE recipeId = ?',
            [details.currentCupsSold, details.pricePerCup, details.recipeId],
            (tx, results) => {
              // console.log('RecipeDetails updated successfully');
            },
            error => {
              console.log('Error updating RecipeDetails:', error);
            },
          );
        } else {
          // RecipeDetails doesn't exist, so insert a new record
          tx.executeSql(
            'INSERT INTO RecipeDetails (recipeId, currentCupsSold, pricePerCup) VALUES (?, ?, ?)',
            [details.recipeId, details.currentCupsSold, details.pricePerCup],
            (tx, results) => {
              // console.log('RecipeDetails inserted successfully');
            },
            error => {
              console.log('Error inserting into RecipeDetails:', error);
            },
          );
        }
      },
      error => {
        console.log('Error checking existing RecipeDetails:', error);
      },
    );
  });
}

export const getRecipeWithDetails = (db, recipeId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          r.id AS recipeId, 
          r.mainTitle, 
          r.subTitle, 
          r.ingredients, 
          r.directions, 
          r.imageUri, 
          r.image, 
          r.favourite, 
          r.lastAccessed, 
          rd.currentCupsSold, 
          rd.pricePerCup 
         FROM Recipe r
         LEFT JOIN RecipeDetails rd ON r.id = rd.recipeId
         WHERE r.id = ?`,
        [recipeId],
        (tx, results) => {
          if (results.rows.length > 0) {
            const recipeWithDetails = results.rows.item(0);
            resolve(recipeWithDetails);
          } else {
            resolve(null); // No recipe found
          }
        },
        error => {
          console.log('Error fetching recipe with details:', error);
          reject(error);
        },
      );
    });
  });
};

export const resetDatabase = db => {
  db.transaction(tx => {
    tx.executeSql('DROP TABLE IF EXISTS RecipeDetails', [], () => {
      console.log('RecipeDetails table dropped');
    });
    tx.executeSql('DROP TABLE IF EXISTS Recipe', [], async () => {
      console.log('Recipe table dropped');
      createRecipesTable(db);
      createRecipeDetailsTable(db);
      await checkAndPrepopulateRecipes(db);
    });
  });
};
