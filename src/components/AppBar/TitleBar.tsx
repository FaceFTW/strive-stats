import {AppBar, Box, Button, ThemeProvider, Toolbar, Typography} from '@mui/material';
import React from 'react';
import {appTheme} from '../theme';

export class TitleBar extends React.Component {
	render(): React.ReactNode {
		return (
			<>
			<ThemeProvider theme={appTheme}>
				<Box sx={{flexGrow: 1}}>
					<AppBar position='static'>
						<Toolbar>
							<Typography variant='h6' component='div' sx={{flexGrow: 1}}>
								-STRIVE- STATS
							</Typography>
							<Button color='inherit'>Login</Button>
						</Toolbar>
					</AppBar>
				</Box></ThemeProvider>
			</>
		);
	}
}
