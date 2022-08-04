import {IFirestoreMatchData} from '../../api/firebase.api';
import {CHARACTER_LIST} from '../characters/charlist';
import MatchItem from '../modules/MatchItem';

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
