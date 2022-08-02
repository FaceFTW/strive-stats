import {Character} from '../characters/charlist';

declare interface MatchData {
	id?: string;
	playerChar: string;
	opponentChar: string;
	playerWin: boolean;
	matchTimestamp: number; //Use Unix Epoch format because serialization
	floorNumber?: number;
}

declare interface IFirestoreMatchData {
	id?: string;
	striveId?: string;
	playerChar: string;
	opponentChar: string;
	playerWin: boolean;
	matchFloor: number;
	matchTime: timestamp;
	isApiData: boolean;
	uid: string;
}

declare interface IFirestorePlayerData {
	id: string; //NOTE is auth uid
	playerName: string; //GGST Player Name for potential API usage
	striveId: string;
	lastFetchTimestamp: timestamp;
	//EXPERIMENTAL FUNKY MODE BELOW
	matchupStats: {
		[playerChar: Character]: {
			totalMatches: number;
			[opponentChar: Character]: number;
		};
	};
}
