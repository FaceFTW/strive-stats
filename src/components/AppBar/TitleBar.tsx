import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import {
	AppBar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	ThemeProvider,
	Toolbar,
	Typography,
} from '@mui/material';
import React from 'react';
import {appTheme} from '../theme';

export default function TitleBar() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const handleDialogOpen = () => setDialogOpen(true);
	const handleDialogClose = () => setDialogOpen(false);




	return (
		<ThemeProvider theme={appTheme}>
			<Box sx={{flexGrow: 1}}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{flexGrow: 1}}>
							-STRIVE- STATS
						</Typography>

						<IconButton onClick={handleMenuClick}>
							<MoreVertIcon />
						</IconButton>
						<Menu id='options-menu' open={openMenu} onClose={handleMenuClose} anchorEl={anchorEl}>
							<MenuItem>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								Login
							</MenuItem>
							<MenuItem>
								<ListItemIcon>
									<LogoutIcon />
								</ListItemIcon>
								Logout
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleDialogOpen}>
								<ListItemIcon>
									<InfoIcon />
								</ListItemIcon>
								About
							</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
			</Box>
			<Dialog open={dialogOpen}>
				<DialogTitle>About</DialogTitle>
				<Divider />
				<DialogContent>
					<Typography variant='body1'>
						Copyright © 2020 Alex 'FaceFTW' Westerman. All rights reserved. Source code for this site is
						under the MIT License. &nbsp;
						<br />
						<br />
						GUILTY GEAR, GUILTY GEAR -STRIVE-, and all associated assets/names are property/trademark of Arc
						System Works. All rights reserved.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
