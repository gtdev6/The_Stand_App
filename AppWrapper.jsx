import {Provider} from 'react-redux';
import React from 'react';
import App from './App';
import store from './src/store/store';
import {openDatabase} from './src/Utitlites/databaseConfig';

export const db = openDatabase();
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App db={db} />
    </Provider>
  );
};

export default AppWrapper;
