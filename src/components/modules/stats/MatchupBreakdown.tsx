import {
	Typography,
	TableContainer,
	Paper,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Box,
} from '@mui/material';
import {CHARACTER_COLORS} from '../../characters/charlist';
import React from 'react';

export interface MatchupBreakdownTableProps {
	data: {internal: string; name: string; count: number}[];
}

export function MatchupBreakdownTable(props: MatchupBreakdownTableProps) {
	return (
		<Box sx={{d: 'flex', justifyContent: 'center'}}>
			<Typography variant='subtitle1'>BEST MATCHUPS</Typography>
			<TableContainer component={Paper} sx={{width: 'fit-content'}}>
				<Table size='small' aria-label='a dense table'>
					<TableBody>
						{props.data.map((row) => {
							return (
								<TableRow key={`row-${row.internal}`}>
									<TableCell component='th' scope='row'>
										<Box
											sx={{
												width: 10,
												height: 10,
												mr: 1,
												backgroundColor: CHARACTER_COLORS[row.internal],
												border: '2px solid grey',
											}}
										/>
									</TableCell>
									<TableCell component='th' scope='row'>
										{row.name}
									</TableCell>
									<TableCell align='right'>{row.count}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
