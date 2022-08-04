import React from 'react';
import {CHARACTER_LIST} from '../characters/charlist';
import {IFirestoreMatchData, MatchData} from './MatchData';
import MatchItem from './MatchItem';

export default {
	title: 'Match Item',
	component: MatchItem,
};

const template = (args: IFirestoreMatchData) => <MatchItem match={args} />;

export const Primary = {
	args: {
		playerUID: '',
		playerChar: CHARACTER_LIST['SOL'],
		opponentChar: CHARACTER_LIST['KYK'],
		playerWin: true,
		matchTime: Date.now(),
		matchFloor: 8,
		isApiData: false,
	},
};
