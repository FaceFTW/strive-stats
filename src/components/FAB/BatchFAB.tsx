import DownloadIcon from '@mui/icons-material/Download';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import React from 'react';
import {appTheme} from '../theme';

export const BatchFAB = () => {
	<>
		<ThemeProvider theme={appTheme}>
			<Fab color='primary'>
				<DownloadIcon />
			</Fab>
		</ThemeProvider>
	</>;
};
