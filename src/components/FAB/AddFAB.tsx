import AddIcon from '@mui/icons-material/Add';
import {
	Box,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React from 'react';
import {CharSelect} from '../CharSelect/CharSelect';
import {appTheme} from '../theme';

export interface AddFABProps {
	handleSubmit: () => void;
}

export default function AddFAB(props: AddFABProps) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [playerCharValue, setPlayerCharValue] = React.useState('');
	const changePlayerCharValue = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) setPlayerCharValue(event.target.value);
	};

	const [opponentCharValue, setOpponentCharValue] = React.useState('');
	const changeOpponentCharValue = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) setOpponentCharValue(event.target.value);
	};

	return (
		<ThemeProvider theme={appTheme}>
			<Fab color='primary' onClick={handleClickOpen}>
				<AddIcon fontSize='large' />
			</Fab>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add Match</DialogTitle>
				<Divider />
				<DialogContent>
					<Typography variant='h6' marginTop='1rem'>PLAYER</Typography>
					<Box sx={{display: 'flex', width: '20rem'}}>
						<CharSelect label='Player' value={playerCharValue} onChange={changePlayerCharValue} />
						<Box sx={{flexGrow: 1}} />
						<TextField
							inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
							label='Wins'
							name='playerWins'
							defaultValue={0}
							sx={{width: '5rem'}}
						/>
					</Box>
					<Typography variant='h6' marginTop='1rem'>OPPONENT</Typography>
					<Box sx={{display: 'flex', width: '20rem'}}>
						<CharSelect label='Opponent' value={opponentCharValue} onChange={changeOpponentCharValue} />
						<Box sx={{flexGrow: 1}} />
						<TextField
							inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
							label='Wins'
							name='opponentWins'
							defaultValue={0}
							sx={{width: '5rem'}}
						/>
					</Box>
				</DialogContent>
			</Dialog>
		</ThemeProvider>
	);
}
