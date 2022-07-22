import {createAction, createSlice} from '@reduxjs/toolkit';

/*********************************************
 * STATE INTERFACE
 *********************************************/
declare interface IAuthState {
	uid: string;
}

/*********************************************
 * SELECTORS
 *********************************************/

/*********************************************
 * ACTIONS
 *********************************************/
const AUTH_ACTION_PREFIX = '@@AUTH';

export const reset = createAction(`${AUTH_ACTION_PREFIX}/RESET`);

/*********************************************
 * REDUCERS
 *********************************************/
export const initialAuthState: IAuthState = {uid: ''};

const authSlice = createSlice({
	name: AUTH_ACTION_PREFIX,
	initialState: initialAuthState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(reset, (state) => {
			state.uid = initialAuthState.uid;
		});
	},
});

export default authSlice.reducer;
