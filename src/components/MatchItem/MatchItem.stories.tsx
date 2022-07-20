import React from 'react';
import {CHARACTER_LIST} from '../characters/charlist';
import {MatchData} from './MatchData';
import MatchItem from './MatchItem';

export default {
	title: 'Match Item',
	component: MatchItem,
};

const template = (args: MatchData) => <MatchItem {...args} />;

export const Primary = {
	args: {
		playerChar: CHARACTER_LIST['SOL'],
		opponentChar: CHARACTER_LIST['KYK'],
		playerWins: 2,
		opponentWins: 1,
		matchTimestamp: Date.now(),
		floorNumber: 8,
	},
};
