import {Add} from '@mui/icons-material';
import {Fab, ThemeProvider} from '@mui/material';
import React from 'react';
import {appTheme} from '../theme';

export const AddFAB = () => (
	<>
		<ThemeProvider theme={appTheme}>
			<Fab color='primary'>
				<Add />
			</Fab>
		</ThemeProvider>
	</>
);
