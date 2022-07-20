import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React from 'react';
import {appTheme} from '../theme';

export interface AddFABProps {}

export default function AddFAB(props: AddFABProps) {
	return (
		<>
			<ThemeProvider theme={appTheme}>
				<Fab color='primary'>
					<AddIcon fontSize='large' />
					Test
				</Fab>
			</ThemeProvider>
		</>
	);
}
