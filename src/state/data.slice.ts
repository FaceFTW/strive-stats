import {createAction, createSlice} from '@reduxjs/toolkit';

/*********************************************
 * STATE INTERFACE
 *********************************************/
declare interface IDataState {
	uid: string;
}

/*********************************************
 * SELECTORS
 *********************************************/

/*********************************************
 * ACTIONS
 *********************************************/
const DATA_ACTION_PREFIX = '@@DATA';

export const reset = createAction(`${DATA_ACTION_PREFIX}/RESET`);

/*********************************************
 * REDUCERS
 *********************************************/
export const initialDataState: IDataState = {uid: ''};

const dataSlice = createSlice({
	name: DATA_ACTION_PREFIX,
	initialState: initialDataState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(reset, (state) => {
			state.uid = initialDataState.uid;
		});
	},
});

export default dataSlice.reducer;
