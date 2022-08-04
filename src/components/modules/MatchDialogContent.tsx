import {
	Box,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	Typography,
} from '@mui/material';
import {Floor} from '../../api/ggst.api';
import {CharSelect} from './CharSelect';

export interface MatchDialogContentProps {
	playerChar: string;
	opponentChar: string;
	didWin: boolean;
	floor: number;
	setPlayerChar: React.Dispatch<React.SetStateAction<string>>;
	setOpponentChar: React.Dispatch<React.SetStateAction<string>>;
	setDidWin: React.Dispatch<React.SetStateAction<boolean>>;
	setFloor: React.Dispatch<React.SetStateAction<number>>;
}

export default function MatchDialogContent(props: MatchDialogContentProps) {
	const changePlayerChar = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) props.setPlayerChar(event.target.value);
	};

	const changeOpponentChar = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) props.setOpponentChar(event.target.value);
	};

	return (
		<Box>
			<Typography variant='caption' marginTop='1rem'>
				PLAYER CHARACTER
			</Typography>
			<Box sx={{display: 'flex', width: '20rem'}}>
				<CharSelect label='Player' value={props.playerChar} onChange={changePlayerChar} />
			</Box>
			<Typography variant='caption' marginTop='1rem'>
				OPPONENT CHARACTER
			</Typography>
			<Box sx={{display: 'flex', width: '20rem'}}>
				<CharSelect
					label='Opponent'
					value={props.opponentChar}
					onChange={changeOpponentChar}
				/>
			</Box>

			<Box
				sx={{
					display: 'flex',
					width: '20rem',
					marginTop: '1rem',
				}}
			>
				<FormControlLabel
					value={props.didWin}
					control={
						<Switch
							defaultChecked
							onChange={(event) => props.setDidWin(event.target.checked)}
						/>
					}
					label='Did Win?'
					labelPlacement='start'
				/>
				<FormControl size='small'>
					<InputLabel id='add-fab-floor-select-label'>Floor</InputLabel>
					<Select
						sx={{display: 'flex', width: '5rem'}}
						value={props.floor}
						labelId='add-fab-floor-select-label'
						onChange={(event) => props.setFloor(event.target.value as number)}
					>
						{(Object.keys(Floor) as Array<keyof typeof Floor>)
							.filter((el) => {
								return !isNaN(Number(el));
							})
							.map((key) => (
								<MenuItem key={key} value={key}>
									{Floor[key]}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</Box>
		</Box>
	);
}
