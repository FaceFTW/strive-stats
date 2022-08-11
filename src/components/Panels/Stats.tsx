import {Box} from '@mui/system';
import {DocumentReference} from 'firebase/firestore';
import React from 'react';
import {useMemo, useState} from 'react';
import {useFirestoreDocData} from 'reactfire';
import {Pie, PieChart, ResponsiveContainer} from 'recharts';
import {IFirestorePlayerData} from '../../api/firebase.api';
import {CHARACTERS, CharSelect} from '../modules/CharSelect';

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
				name: char2,
				count: docData.matchupStats[char][char2],
			};
		});
	});

	return data;
};

const generateBreakdown = (char: string, data: StatPanelData) => {
	return Object.keys(data.charSpecificWinData[char]).map((char2) => {
		return data.charSpecificWinData[char][char2];
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

	return (
		<Box>
			<CharSelect
				label='StatsChar'
				value={selectedChar}
				onChange={(e) => setSelectedChar(e.target.value ?? 'SOL')}
			/>

			<ResponsiveContainer width={'80%'} height={400}>
				<PieChart>
					<Pie
						data={breakdownData}
						nameKey='name'
						dataKey='count'
						valueKey='count'
						cx='50%'
						cy='50%'
						outerRadius={50}
					>
						{/* {charBreakdown.map((entry, index) => (
							<Cell key={`cell-${index}`} />
						))} */}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
}
