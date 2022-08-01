import {IFirestoreMatchData} from '../components/MatchItem/MatchData';
import {ApiCharacter, EApiPlayer, IApiPlayer, IApiReplay} from './ggst.api';

//Makes API Enum useable with Charlist
function convertApiChartoCharKey(apiChar: ApiCharacter): string {
	switch (apiChar) {
		case ApiCharacter.SOL:
			return 'SOL';
		case ApiCharacter.KYK:
			return 'KYK';
		case ApiCharacter.MAY:
			return 'MAY';
		case ApiCharacter.AXL:
			return 'AXL';
		case ApiCharacter.CHP:
			return 'CHP';
		case ApiCharacter.POT:
			return 'POT';
		case ApiCharacter.FAU:
			return 'FAU';
		case ApiCharacter.MLL:
			return 'MLL';
		case ApiCharacter.ZAT:
			return 'ZAT';
		case ApiCharacter.RAM:
			return 'RAM';
		case ApiCharacter.LEO:
			return 'LEO';
		case ApiCharacter.NAG:
			return 'NAG';
		case ApiCharacter.GIO:
			return 'GIO';
		case ApiCharacter.ANJ:
			return 'ANJ';
		case ApiCharacter.INO:
			return 'INO';
		case ApiCharacter.GLD:
			return 'GLD';
		case ApiCharacter.JKO:
			return 'JKO';
		case ApiCharacter.COS:
			return 'COS';
		case ApiCharacter.BKN:
			return 'BKN';
		case ApiCharacter.TST:
			return 'TST';
	}
}

function mapToIApiReplay(rawArray: any[]): IApiReplay {
	return {
		id: rawArray[0],
		unknown1: rawArray[1],
		floor: rawArray[2],
		player1Char: rawArray[3],
		player2Char: rawArray[4],
		player1: {
			striveId: rawArray[5][0],
			playerName: rawArray[5][1],
			steamId: rawArray[5][2],
			steamId16: rawArray[5][3],
		} as IApiPlayer,
		player2: {
			striveId: rawArray[6][0],
			playerName: rawArray[6][1],
			steamId: rawArray[6][2],
			steamId16: rawArray[6][3],
		} as IApiPlayer,
		winner: rawArray[7],
		date: rawArray[8],
		unknown2: rawArray[9],
		views: rawArray[10],
		unknown3: rawArray[11],
		likes: rawArray[12],
	};
}

function findUserPlayer(striveId: string, replay: IApiReplay): EApiPlayer {
	if (replay.player1.striveId === striveId) {
		return EApiPlayer.P1;
	} else {
		return EApiPlayer.P2;
	}
}

function convertApiReplaytoFireReplay(apiReplay: IApiReplay, striveId: string): IFirestoreMatchData {
	if (findUserPlayer(striveId, apiReplay) === EApiPlayer.P1) {
		return {
			playerUID: apiReplay.player1.striveId,
			playerChar: convertApiChartoCharKey(apiReplay.player1Char),
			opponentChar: convertApiChartoCharKey(apiReplay.player2Char),
			playerWin: apiReplay.winner === EApiPlayer.P1,
			matchFloor: apiReplay.floor,
			matchTime: apiReplay.date,
			isApiData: true,
		};
	} else {
		return {
			playerUID: apiReplay.player2.striveId,
			playerChar: convertApiChartoCharKey(apiReplay.player2Char),
			opponentChar: convertApiChartoCharKey(apiReplay.player1Char),
			playerWin: apiReplay.winner === EApiPlayer.P2,
			matchFloor: apiReplay.floor,
			matchTime: apiReplay.date,
			isApiData: true,
		};
	}
}
