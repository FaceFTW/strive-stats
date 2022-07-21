import DownloadIcon from '@mui/icons-material/Download';
import {Button, DialogActions, DialogContent, DialogTitle, Divider, TextField} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import React from 'react';
import {appTheme} from '../theme';

export const BatchFAB = () => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<ThemeProvider theme={appTheme}>
			<Fab color='primary' onClick={handleClickOpen}>
				<DownloadIcon />
			</Fab>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Batch Import</DialogTitle>
				<Divider />
				<DialogContent>
					<TextField label='GGST Player Name' name='playerName' />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					{/* TODO Add Proper Submit Handler. Batch Import is secondary to primary CRUD atm */}
					<Button onClick={handleClose}>Import</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
};
