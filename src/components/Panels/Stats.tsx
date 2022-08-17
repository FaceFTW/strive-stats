import {
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material';
import {Box} from '@mui/system';
import {DocumentReference} from 'firebase/firestore';
import {useMemo, useState} from 'react';
import {useFirestoreDocData} from 'reactfire';
import {Cell, Label, Pie, PieChart, ResponsiveContainer, Tooltip, Legend} from 'recharts';
import {IFirestorePlayerData} from '../../api/firebase.api';
import {CHARACTER_COLORS, CHARACTER_LIST} from '../characters/charlist';
import {CHARACTERS, CharSelect} from '../modules/CharSelect';
import React from 'react';
import {MatchupBreakdownTable} from '../modules/stats/MatchupBreakdown';

export interface StatsPanelProps {
	userDataRef: DocumentReference<IFirestorePlayerData>;
}

export interface StatPanelData {
	totalMatches: number;
	charTotalMatchCount: {[char: string]: number};
	charTotalWinData: {[char: string]: number};
	charSpecificWinData: {
		[char: string]: {[char: string]: {name: string; count: number}};
	};
}

const defaultData = () => {
	const data: StatPanelData = {} as StatPanelData;
	data.totalMatches = 0;
	data.charTotalMatchCount = {};
	data.charTotalWinData = {};
	data.charSpecificWinData = {};

	CHARACTERS.forEach((char) => {
		data.charTotalWinData[char] = 0;
		data.charTotalMatchCount[char] = 0;
		data.charSpecificWinData[char] = {};
		CHARACTERS.forEach((char2) => {
			data.charSpecificWinData[char][char2] = {name: char2, count: 0};
		});
	});

	return data;
};

const calculateStats = (docData: IFirestorePlayerData) => {
	const data: StatPanelData = defaultData();

	CHARACTERS.forEach((char) => {
		data.totalMatches += docData.totalMatches[char] || 0;
		data.charTotalMatchCount[char] = docData.totalMatches[char] || 0;
		data.charTotalWinData[char] = 0;
		data.charSpecificWinData[char] = {};

		CHARACTERS.forEach((char2) => {
			data.charTotalWinData[char] += docData.matchupStats[char][char2];
			data.charSpecificWinData[char][char2] = {
				name: CHARACTER_LIST[char2].charName,
				count: docData.matchupStats[char][char2],
			};
		});
	});

	return data;
};

const generateBreakdown = (char: string, data: StatPanelData) => {
	return Object.keys(data.charSpecificWinData[char]).map((char2) => {
		return {...data.charSpecificWinData[char][char2], internal: char2};
	});
};

const generateOverallWinBreakdown = (data: StatPanelData) => {
	return Object.keys(data.charTotalWinData).map((char) => {
		return {
			name: CHARACTER_LIST[char].charName,
			count: data.charTotalWinData[char],
			internal: char,
		};
	});
};

export default function StatsPanel(props: StatsPanelProps) {
	const [selectedChar, setSelectedChar] = useState<string>('SOL');
	const {status: docStatus, data: docData} = useFirestoreDocData<IFirestorePlayerData>(
		props.userDataRef,
	);

	const statData = useMemo(() => {
		if (docStatus === 'success' && docData) {
			return calculateStats(docData);
		}
		return defaultData();
	}, [docStatus, docData]);
	const breakdownData = useMemo(() => {
		if (docStatus === 'success' && docData && statData) {
			return generateBreakdown(selectedChar, statData);
		}
		return [];
	}, [docStatus, docData, selectedChar, statData]);
	const overallWinBreakdown = useMemo(() => {
		if (docStatus === 'success' && docData && statData) {
			return generateOverallWinBreakdown(statData);
		}
		return [];
	}, [docStatus, docData, statData]);
	const overallWinRate = useMemo(() => {
		let winCount = 0;
		Object.keys(statData.charTotalWinData).forEach((char) => {
			winCount += statData.charTotalWinData[char];
		});
		return [
			{data: (winCount / statData.totalMatches) * 100},
			{data: 100 - (winCount / statData.totalMatches) * 100},
		];
	}, [statData]);
	const overallWinCount = useMemo(() => {
		let winCount = 0;
		Object.keys(statData.charTotalWinData).forEach((char) => {
			winCount += statData.charTotalWinData[char];
		});
		return winCount;
	}, [statData]);
	const overallMatchCount = useMemo(() => {
		let matchCount = 0;
		Object.keys(statData.charTotalMatchCount).forEach((char) => {
			matchCount += statData.charTotalMatchCount[char];
		});
		return matchCount;
	}, [statData]);

	const showBreakdownPie = () => {
		if (
			statData &&
			statData.charTotalMatchCount[selectedChar] > 0 &&
			statData.charTotalWinData[selectedChar] > 0
		) {
			return (
				<Grid container>
					<Grid item xs={12} md={6}>
						<ResponsiveContainer width={'100%'} height={250}>
							<PieChart>
								<Tooltip />
								<Pie
									data={breakdownData}
									nameKey='name'
									dataKey='count'
									valueKey='count'
									cx='50%'
									cy='50%'
									outerRadius={100}
								>
									{breakdownData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={CHARACTER_COLORS[entry.internal] ?? '#777777'}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</Grid>
					<Grid item xs={12} md={6} sx={{flexDirection: 'row', justifyContent: 'center'}}>
						<MatchupBreakdownTable
							data={breakdownData
								.sort((a, b) => b.count - a.count)
								.slice(0, 10)
								.filter((entry) => entry.count > 0)}
						/>
					</Grid>
				</Grid>
			);
		} else {
			return <div>No data to show</div>;
		}
	};

	const showOverallDiagram = () => {
		if (statData && statData.totalMatches > 0) {
			return (
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Box sx={{d: 'flex', justifyContent: 'center'}}>
							<Typography variant='button' textAlign='center'>
								Overall Win Rate
							</Typography>
							<ResponsiveContainer width={'80%'} height={200}>
								<PieChart>
									<Pie
										innerRadius={60}
										outerRadius={80}
										data={overallWinRate}
										dataKey={'data'}
									>
										<Label
											value={`${overallWinRate[0].data.toFixed(1)}%`}
											position='center'
											dy={-10}
											fontSize={30}
										/>
										<Label
											value={`W: ${overallWinCount ?? 0}  L: ${
												overallMatchCount - overallWinCount ?? 0
											}`}
											position='center'
											dy={20}
										/>
										{overallWinRate.map((entry, index) => {
											return (
												<Cell
													key={`cell-${index}`}
													fill={index === 0 ? '#570602' : '#f5f5f5'}
												/>
											);
										})}
									</Pie>
								</PieChart>
							</ResponsiveContainer>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Grid container>
							<Grid item xs={12} md={6}>
								<ResponsiveContainer width={'80%'} height={200}>
									<PieChart>
										<Pie
											outerRadius={80}
											data={overallWinBreakdown}
											dataKey={'count'}
										>
											{overallWinBreakdown.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={
														CHARACTER_COLORS[entry.internal] ??
														'#777777'
													}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</Grid>
							<Grid item xs={12} md={6}>
								<TableContainer
									component={Paper}
									sx={{width: 'fit-content', alignSelf: 'center'}}
								>
									<Table
										size='small'
										aria-label='a dense table'
										sx={{flexShrink: 1}}
									>
										<TableBody>
											{overallWinBreakdown
												.sort((a, b) => b.count - a.count)
												.slice(0, 5)
												.filter((row) => row.count > 0)
												.map((row) => {
													return (
														<TableRow key={`row-${row.internal}`}>
															<TableCell
																component='th'
																scope='row'
																size='small'
																padding='checkbox'
																align='left'
															>
																<Box
																	sx={{
																		width: 10,
																		height: 10,
																		backgroundColor:
																			CHARACTER_COLORS[
																				row.internal
																			],
																		border: '2px solid grey',
																	}}
																/>
															</TableCell>
															<TableCell
																component='th'
																scope='row'
																padding='none'
															>
																{row.name}
															</TableCell>
															<TableCell
																align='right'
																sx={{width: '20px'}}
															>
																{row.count}
															</TableCell>
														</TableRow>
													);
												})}
										</TableBody>
									</Table>
								</TableContainer>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			);
		} else {
			return <div>No data to show</div>;
		}
	};

	return (
		// <Paper elevation={3} sx={{padding: '1rem'}}>
		<Box sx={{d: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
			<Box sx={{d: 'flex', justifyContent: 'center'}}>
				<Typography variant='h5'>Overall Stats</Typography>
				{showOverallDiagram()}
			</Box>
			<Box>
				<Typography variant='h5'>Character Matchup Stats</Typography>
				<CharSelect
					label='StatsChar'
					value={selectedChar}
					onChange={(e) => setSelectedChar(e.target.value ?? 'SOL')}
				/>
				{showBreakdownPie()}
			</Box>
		</Box>
		// </Paper>
	);
}
