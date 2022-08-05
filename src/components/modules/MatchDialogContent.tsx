import {Box, MenuItem, Select, SelectChangeEvent, Switch, Typography} from '@mui/material';
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

const selectStyle = {
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
};

export default function MatchDialogContent(props: MatchDialogContentProps) {
	const changePlayerChar = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) props.setPlayerChar(event.target.value);
	};

	const changeOpponentChar = (event: SelectChangeEvent<string | null>) => {
		if (event.target.value) props.setOpponentChar(event.target.value);
	};

	return (
		<Box sx={selectStyle}>
			<Box sx={selectStyle}>
				<Typography variant='caption' marginTop='1rem'>
					PLAYER CHARACTER
				</Typography>
				<CharSelect label='Player' value={props.playerChar} onChange={changePlayerChar} />
			</Box>
			<Box sx={selectStyle}>
				<Typography variant='caption' marginTop='1rem'>
					OPPONENT CHARACTER
				</Typography>
				<CharSelect
					label='Opponent'
					value={props.opponentChar}
					onChange={changeOpponentChar}
				/>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					marginTop: '1rem',
				}}
			>
				<Box sx={selectStyle}>
					<Typography variant='caption'>USER WIN</Typography>
					<Switch
						checked={props.didWin}
						onChange={(event) => props.setDidWin(event.target.checked)}
						inputProps={{'aria-label': 'controlled'}}
						required
					/>
				</Box>
				<Box sx={selectStyle}>
					<Typography variant='caption'>FLOOR</Typography>
					<Select
						sx={{display: 'flex', width: '5rem'}}
						size='small'
						value={props.floor}
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
				</Box>
			</Box>
		</Box>
	);
}
