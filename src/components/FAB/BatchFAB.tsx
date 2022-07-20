import {Download} from '@mui/icons-material';
import {Fab, ThemeProvider} from '@mui/material';
import React from 'react';
import {appTheme} from '../theme';

export const BatchFAB = () => {
	<>
		<ThemeProvider theme={appTheme}>
			<Fab color='primary'>
				<Download></Download>
			</Fab>
		</ThemeProvider>
	</>;
};
