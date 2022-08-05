import AddIcon from '@mui/icons-material/Add';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider} from '@mui/material';
import Fab from '@mui/material/Fab';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React from 'react';
import {appTheme} from '../theme';
import MatchDialogContent from './MatchDialogContent';

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
		setFloorValue(1);
		setDidWin(true);
	};
	const handleClose = () => setOpen(false);

	const [playerCharValue, setPlayerCharValue] = React.useState('');
	const [opponentCharValue, setOpponentCharValue] = React.useState('');
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
						onClick={() => {
							props.handleSubmit(
								playerCharValue,
								opponentCharValue,
								floorValue,
								didWin,
							);
							setOpen(false);
						}}
					>
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</ThemeProvider>
	);
}
