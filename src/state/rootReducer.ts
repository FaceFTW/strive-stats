import {combineReducers} from '@reduxjs/toolkit';
import authSlice from './auth.slice';
import dataSlice from './data.slice';

const rootReducer = combineReducers({
	auth: authSlice,
	data: dataSlice,
});

export default rootReducer;
