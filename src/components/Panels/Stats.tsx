import {Box} from '@mui/system';
import {DocumentReference} from 'firebase/firestore';
import {useMemo, useState} from 'react';
import {useFirestoreDocData} from 'reactfire';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Text, Label} from 'recharts';
import {IFirestorePlayerData} from '../../api/firebase.api';
import {CHARACTER_COLORS, CHARACTER_LIST} from '../characters/charlist';
import {CHARACTERS, CharSelect} from '../modules/CharSelect';
import React from 'react';
import {CircularProgress, Paper, Typography} from '@mui/material';

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

	const showPie = () => {
		if (
			statData &&
			statData.charTotalMatchCount[selectedChar] > 0 &&
			statData.charTotalWinData[selectedChar] > 0
		) {
			return (
				<ResponsiveContainer width={'80%'} height={400}>
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
			);
		} else {
			return <div>No data to show</div>;
		}
	};

	return (
		<Paper elevation={3} sx={{padding: '1rem'}}>
			<Box>
				<Typography variant='h5'>Overall Stats</Typography>
				<ResponsiveContainer width={'25%'} height={200}>
					<PieChart>
						<Pie
							innerRadius={60}
							outerRadius={80}
							data={overallWinRate}
							dataKey={'data'}
						>
							<Label
								value={`${overallWinRate[0].data}%`}
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
			<Box>
				<Typography variant='h5'>Character Matchup Stats</Typography>
				<CharSelect
					label='StatsChar'
					value={selectedChar}
					onChange={(e) => setSelectedChar(e.target.value ?? 'SOL')}
				/>
				{showPie()}
			</Box>
		</Paper>
	);
}
