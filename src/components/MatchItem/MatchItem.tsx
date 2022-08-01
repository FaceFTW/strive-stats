import {Box, Paper, Typography} from '@mui/material';
import React from 'react';
import {CHARACTER_LIST} from '../characters/charlist';
import {MatchData} from './MatchData';
import './MatchItem.css';

const spacerStyle = {
	flexGrow: 1,
};

const MatchItem = (props: MatchData) => {
	const playerImage = require(`../characters/${CHARACTER_LIST[props.playerChar].charAsset}`);
	const opponentImage = require(`../characters/${CHARACTER_LIST[props.opponentChar].charAsset}`);
	return (
		<>
			<Paper sx={{display: 'block', width: '40rem'}} elevation={3}>
				<Box component='span' sx={{display: 'flex', p: '2rem 2rem 0rem 2rem'}}>
					<img className='item-img' src={playerImage} />

					<Typography component='div' variant='h6' sx={{m: '1.75rem 1rem 0rem 1rem'}}>
						{CHARACTER_LIST[props.playerChar].charName}
					</Typography>
					<Box sx={spacerStyle}></Box>
					<Typography component='div' variant='h6' sx={{margin: '1.75rem 1rem 0rem 1rem'}}>
						{CHARACTER_LIST[props.opponentChar].charName}
					</Typography>
					<img className='item-img opponent-img' src={opponentImage} />
				</Box>
				<Box component='span' sx={{display: 'flex', p: '2rem', pt: '0rem'}}>
					<Box sx={spacerStyle}></Box>
					<Box
						component='div'
						sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '-1rem'}}
					>
						<Typography component='div' variant='h4' sx={{color: props.playerWin ? '#7d0802' : '#a0a0a0'}}>
							{props.playerWin ? 'WIN' : 'LOSE'}
						</Typography>
						<Typography component='div' variant='caption'>
							Floor {props.floorNumber} - {new Date(props.matchTimestamp).toISOString()}
						</Typography>
					</Box>
					<Box sx={spacerStyle}></Box>
				</Box>
			</Paper>
		</>
	);
};

export default MatchItem;
