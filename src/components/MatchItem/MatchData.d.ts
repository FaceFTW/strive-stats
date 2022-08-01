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
	playerUID: string;
	playerChar: string;
	opponentChar: string;
	playerWin: boolean;
	matchFloor: number; //TODO change to enum typing
	matchTime: timestamp; //TODO change to unix epoch format ez????
	isApiData: boolean;
}

declare interface IFirestorePlayerData {
	id: string; //NOTE is auth uid
	playerName: string; //GGST Player Name for potential API usage
	lastFetchTimestamp: timestamp; //TODO need unix epoch
	//EXPERIMENTAL FUNKY MODE BELOW
	matchupStats: {[playerChar: Character]: {[opponentChar: Character]: number}};
}
