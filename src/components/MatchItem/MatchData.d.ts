import {Character} from '../characters/charlist';

declare interface MatchData {
	playerChar: Character;
	opponentChar: Character;
	playerWins: number;
	opponentWins: number;
	matchTimestamp: number; //Use Unix Epoch format because serialization
	floorNumber?: number;
}
