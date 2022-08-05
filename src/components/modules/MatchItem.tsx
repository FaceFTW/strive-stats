import {Box, Paper, Typography} from '@mui/material';
import {IFirestoreMatchData} from '../../api/firebase.api';
import {CHARACTER_LIST} from '../characters/charlist';

const spacerStyle = {
	flexGrow: 1,
};

export interface MatchItemProps {
	match: IFirestoreMatchData;
	onClick?: (docId: string | undefined) => Promise<void>;
	deleteCallback?: (docId: string | undefined) => Promise<void>;
	updateCallback?: (docId: string | undefined) => Promise<void>;
}

const MatchItem = (props: MatchItemProps) => {
	const playerImage = require(`../characters/${
		CHARACTER_LIST[props.match.playerChar].charAsset
	}`);
	const opponentImage = require(`../characters/${
		CHARACTER_LIST[props.match.opponentChar].charAsset
	}`);

	return (
		<>
			<Paper sx={{display: 'block', width: '40rem'}} elevation={3}>
				<Box component='span' sx={{display: 'flex', p: '1rem 1rem 0rem 1rem'}}>
					<img
						className='item-img'
						alt={CHARACTER_LIST[props.match.playerChar].charName}
						src={playerImage}
					/>
					<Typography component='div' variant='h6' sx={{m: '1.75rem 1rem 0rem 1rem'}}>
						{CHARACTER_LIST[props.match.playerChar].charName}
					</Typography>
					<Box sx={spacerStyle}></Box>
					<Typography component='div' variant='h6' sx={{m: '1.75rem 1rem 0rem 1rem'}}>
						{CHARACTER_LIST[props.match.opponentChar].charName}
					</Typography>
					<img
						className='item-img opponent-img'
						alt={CHARACTER_LIST[props.match.opponentChar].charName}
						src={opponentImage}
					/>
				</Box>
				<Box component='span' sx={{display: 'flex', p: '1rem', pt: '0rem'}}>
					<Box sx={spacerStyle}></Box>
					<Box
						component='div'
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							mt: '-1rem',
						}}
					>
						<Typography
							component='div'
							variant='h4'
							sx={{color: props.match.playerWin ? '#7d0802' : '#a0a0a0'}}
						>
							{props.match.playerWin ? 'WIN' : 'LOSE'}
						</Typography>
						<Typography component='div' variant='caption'>
							Floor {props.match.matchFloor} - {props.match.matchTime}
						</Typography>
					</Box>
					<Box sx={spacerStyle}></Box>
				</Box>
			</Paper>
		</>
	);
};

export default MatchItem;
