import AddIcon from '@mui/icons-material/Add';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	Typography,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React from 'react';
import {Floor} from '../../api/ggst.api';
import {CharSelect} from '../CharSelect/CharSelect';
import {appTheme} from '../theme';

export interface AddFABProps {
	handleSubmit: (playerChar: string, opponentChar: string, floor: number, didWin: boolean) => void;
}

export default function AddFAB(props: AddFABProps) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
		setPlayerCharValue('');
		setOpponentCharValue('');
		setFloorValue(0);
	};
	const handleClose = () => setOpen(false);

	const [playerCharValue, setPlayerCharValue] = React.useState('');
	const changePlayerCharValue = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) setPlayerCharValue(event.target.value);
	};

	const [opponentCharValue, setOpponentCharValue] = React.useState('');
	const changeOpponentCharValue = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) setOpponentCharValue(event.target.value);
	};

	const [floorValue, setFloorValue] = React.useState(1);

	const [didWin, setDidWin] = React.useState(true);

	return (
		<ThemeProvider theme={appTheme}>
			<Fab color='primary' onClick={handleClickOpen}>
				<AddIcon fontSize='large' />
			</Fab>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add Match</DialogTitle>
				<Divider />
				<DialogContent>
					<Typography variant='caption' marginTop='1rem'>
						PLAYER CHARACTER
					</Typography>
					<Box sx={{display: 'flex', width: '20rem'}}>
						<CharSelect label='Player' value={playerCharValue} onChange={changePlayerCharValue} />
					</Box>
					<Typography variant='caption' marginTop='1rem'>
						OPPONENT CHARACTER
					</Typography>
					<Box sx={{display: 'flex', width: '20rem'}}>
						<CharSelect label='Opponent' value={opponentCharValue} onChange={changeOpponentCharValue} />
					</Box>

					<Box sx={{display: 'flex', width: '20rem', marginTop: '1rem'}}>
						<FormControlLabel
							value={didWin}
							control={<Switch checked={didWin} onChange={(event) => setDidWin(event.target.checked)} />}
							label='Did Win?'
							labelPlacement='start'
						/>
						<FormControl size='small'>
							<InputLabel id='add-fab-floor-select-label'>Floor</InputLabel>
							<Select
								sx={{display: 'flex', width: '5rem'}}
								value={floorValue}
								labelId='add-fab-floor-select-label'
								onChange={(event) => setFloorValue(event.target.value as number)}
							>
								{(Object.keys(Floor) as Array<keyof typeof Floor>)
									.filter((el) => {
										return !isNaN(Number(el));
									})
									.map((key) => (
										<MenuItem key={key} value={Floor[key]}>
											{Floor[key]}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={() => props.handleSubmit(playerCharValue, opponentCharValue, floorValue, didWin)}>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
