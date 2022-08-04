import AddIcon from '@mui/icons-material/Add';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	SelectChangeEvent,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React from 'react';
import MatchDialogContent from './MatchDialogContent';
import {appTheme} from '../theme';

export interface AddFABProps {
	handleSubmit: (
		playerChar: string,
		opponentChar: string,
		floor: number,
		didWin: boolean,
	) => void;
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
					<MatchDialogContent
						playerChar={playerCharValue}
						setPlayerChar={setPlayerCharValue}
						opponentChar={opponentCharValue}
						setOpponentChar={setOpponentCharValue}
						floor={floorValue}
						setFloor={setFloorValue}
						didWin={didWin}
						setDidWin={setDidWin}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={() =>
							props.handleSubmit(
								playerCharValue,
								opponentCharValue,
								floorValue,
								didWin,
							)
						}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
