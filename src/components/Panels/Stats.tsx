import {DocumentReference} from 'firebase/firestore';
import {useEffect, useMemo, useState} from 'react';
import {useFirestoreDocData, useUser} from 'reactfire';
import {IFirestorePlayerData} from '../../api/firebase.api';
import {CHARACTERS} from '../modules/CharSelect';

export interface StatsPanelProps {
	userDataRef: DocumentReference<IFirestorePlayerData>;
}

export interface StatPanelData {
	charTotalWinData: {[char: string]: {percent: number; count: number}};
	charSpecificWinData: {[char: string]: {[char: string]: {percent: number; count: number}}};
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
			defaultObj[char][char2] = {percent: 0, count: 0};
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
				percent: charData[char2] / totalMatches,
				count: charData[char2],
			};
			totalCharWins += charData[char2];
		});

		charTotalWinData[char].percent = totalCharWins / totalMatches;
		charTotalWinData[char].count = totalCharWins;
	});

	return {charTotalWinData, charSpecificWinData};
};

export default function StatsPanel(props: StatsPanelProps) {
	const [statPanelData, setStatPanelData] = useState<StatPanelData>({
		charTotalWinData: defaultTotalWinData(),
		charSpecificWinData: defaultSpecificWinData(),
	});

	const {data: user} = useUser();
	const {status: docStatus, data: docData} = useFirestoreDocData<IFirestorePlayerData>(
		props.userDataRef,
	);

	useEffect(() => {
		if (docStatus === 'success' && docData) {
			setStatPanelData(generateStatPanelData(docData));
		}
	}, [docStatus, docData]);



	return <div>Stats</div>;
}
