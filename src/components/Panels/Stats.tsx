import {Box} from '@mui/system';
import {DocumentReference} from 'firebase/firestore';
import {constants} from 'os';
import {useEffect, useState} from 'react';
import {useFirestoreDocData, useUser} from 'reactfire';
import {PieChart, Pie, ResponsiveContainer, Cell} from 'recharts';
import {IFirestorePlayerData} from '../../api/firebase.api';
import {CHARACTER_LIST} from '../characters/charlist';
import {CHARACTERS, CharSelect} from '../modules/CharSelect';

export interface StatsPanelProps {
	userDataRef: DocumentReference<IFirestorePlayerData>;
}

export interface StatPanelData {
	charTotalWinData: {[char: string]: {percent: number; count: number}};
	charSpecificWinData: {
		[char: string]: {[char: string]: {name: string; percent: number; count: number}};
	};
}

const defaultTotalWinData = (): StatPanelData['charTotalWinData'] => {
	let defaultObj: StatPanelData['charTotalWinData'] = {};
	CHARACTERS.forEach((char) => {
		defaultObj[char] = {percent: 0, count: 0};
	});

	return defaultObj;
};

const defaultSpecificWinData = (): StatPanelData['charSpecificWinData'] => {
	let defaultObj: StatPanelData['charSpecificWinData'] = {};
	CHARACTERS.forEach((char) => {
		defaultObj[char] = {};
		CHARACTERS.forEach((char2) => {
			defaultObj[char][char2] = {name: CHARACTER_LIST[char].charName, percent: 0, count: 0};
		});
	});

	return defaultObj;
};

const generateStatPanelData = (playerData: IFirestorePlayerData): StatPanelData => {
	let charTotalWinData: StatPanelData['charTotalWinData'] = {};
	let charSpecificWinData: StatPanelData['charSpecificWinData'] = {};

	CHARACTERS.forEach((char) => {
		const charData = playerData.matchupStats[char];
		const totalMatches = playerData.totalMatches[char];

		charTotalWinData[char] = {percent: 0, count: totalMatches};
		charSpecificWinData[char] = {};

		let totalCharWins = 0;
		CHARACTERS.forEach((char2) => {
			charSpecificWinData[char][char2] = {
				name: CHARACTER_LIST[char].charName,
				percent: charData[char2] / totalMatches ?? 0,
				count: charData[char2],
			};

			if (totalMatches < 1) {
				charSpecificWinData[char][char2].percent = 0;
			}
			totalCharWins += charData[char2];
		});

		charTotalWinData[char].percent = totalCharWins / totalMatches;
		charTotalWinData[char].count = totalCharWins;
	});

	return {charTotalWinData, charSpecificWinData};
};

const createCharSpecificStatArray = (
	charSpecificWinData: StatPanelData['charSpecificWinData'],
	char: string,
) => {
	const charSpecificStatArray: {name: string; percent: number; count: number}[] = [];
	CHARACTERS.forEach((char2) => {
		charSpecificStatArray.push(charSpecificWinData[char][char2]);
	});

	return charSpecificStatArray;
};

export default function StatsPanel(props: StatsPanelProps) {
	const [statPanelData, setStatPanelData] = useState<StatPanelData>({
		charTotalWinData: defaultTotalWinData(),
		charSpecificWinData: defaultSpecificWinData(),
	});
	const [selectedChar, setSelectedChar] = useState<string>('SOL');
	const [charBreakdown, setCharBreakdown] = useState([{}]);

	const {data: user} = useUser();

	const {status: docStatus, data: docData} = useFirestoreDocData<IFirestorePlayerData>(
		props.userDataRef,
	);

	useEffect(() => {
		if (docStatus === 'success' && docData) {
			setStatPanelData(generateStatPanelData(docData));
		}
	}, [docStatus, docData]);

	useEffect(() => {
		if (docStatus === 'success' && docData && selectedChar) {
			setCharBreakdown(
				createCharSpecificStatArray(statPanelData.charSpecificWinData, selectedChar),
			);
		}
	}, [docStatus, docData, selectedChar]);
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
						data={charBreakdown}
						nameKey='name'
						dataKey='percent'
						valueKey='count'
						cx='50%'
						cy='50%'
						outerRadius={50}
					>
						{charBreakdown.map((entry, index) => (
							<Cell key={`cell-${index}`}  />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
}
