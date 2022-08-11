import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
	Snackbar,
	ThemeProvider,
	Toolbar,
	Typography,
} from '@mui/material';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import React from 'react';
import {useFirebaseApp, useUser} from 'reactfire';
import {appTheme} from '../theme';

export default function TitleBar() {
	const app = useFirebaseApp();
	const auth = getAuth(app);

	const {data: user} = useUser();

	const googleAuth = new GoogleAuthProvider();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);
	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const [snackbarState, setSnackbarState] = React.useState({
		open: false,
		message: '',
		color: 'success',
	});
	const handleSnackbarClose = () => setSnackbarState({...snackbarState, open: false});

	const [dialogOpen, setDialogOpen] = React.useState(false);
	const handleDialogOpen = () => setDialogOpen(true);
	const handleDialogClose = () => setDialogOpen(false);

	const handleLogin = () => {
		signInWithPopup(auth, googleAuth)
			.then(() => {
				setSnackbarState({
					open: true,
					message: 'Login Successful',
					color: 'success',
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleLogout = () => {
		signOut(auth).then(() => {
			setSnackbarState({
				open: true,
				message: 'Logout Successful',
				color: 'success',
			});
		});
	};

	return (
		<ThemeProvider theme={appTheme}>
			<Box sx={{flexGrow: 1}}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6' component='div' sx={{flexGrow: 1}}>
							-STRIVE- STATS
						</Typography>

						<IconButton sx={{color: '#ffffff'}} onClick={handleMenuClick}>
							<MoreVertIcon />
						</IconButton>
						<Menu
							id='options-menu'
							open={openMenu}
							onClose={handleMenuClose}
							anchorEl={anchorEl}
						>
							<MenuItem onClick={handleLogin}>
								<ListItemIcon>
									<LoginIcon />
								</ListItemIcon>
								Login
							</MenuItem>
							<MenuItem onClick={handleLogout} hidden={user?.isAnonymous}>
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
			<Snackbar
				anchorOrigin={{vertical: 'top', horizontal: 'center'}}
				open={snackbarState.open}
				onClose={handleSnackbarClose}
				message={snackbarState.message}
				color={snackbarState.color}
			/>
			<Dialog open={dialogOpen}>
				<DialogTitle>About</DialogTitle>
				<Divider />
				<DialogContent>
					<Typography variant='body1'>
						Copyright © 2020 Alex &apos;FaceFTW&apos; Westerman. All rights reserved.
						Source code for this site is under the MIT License. &nbsp;
						<br />
						<br />
						GUILTY GEAR, GUILTY GEAR -STRIVE-, and all associated assets/names are
						property/trademark of Arc System Works. All rights reserved.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
