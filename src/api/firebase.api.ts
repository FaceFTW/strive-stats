//NOTE This only holds helper functions for Firebase Stuff, thus any function should pull a ref or something from somewhere else

import {
	addDoc,
	collection,
	DocumentData,
	DocumentReference,
	Firestore,
	getDoc,
	QueryDocumentSnapshot,
	setDoc,
	SnapshotOptions,
	WithFieldValue,
} from 'firebase/firestore';
import {CHARACTERS} from '../components/modules/CharSelect';

export const FIRESTORE_MATCH_COLLECTION = 'MatchData';
export const FIRESTORE_USER_COLLECTION = 'UserData';

export interface MatchData {
	id?: string;
	playerChar: string;
	opponentChar: string;
	playerWin: boolean;
	matchTimestamp: number; //Use Unix Epoch format because serialization
	floorNumber?: number;
}

export interface IFirestoreMatchData {
	id?: string;
	striveId?: string;
	playerChar: string;
	opponentChar: string;
	playerWin: boolean;
	matchFloor: number;
	matchTime: number;
	isApiData: boolean;
	uid: string;
}

export interface IFirestorePlayerData {
	id: string; //NOTE is auth uid
	playerName: string; //GGST Player Name for potential API usage
	striveId: string;
	lastFetchTimestamp: number;
	//EXPERIMENTAL FUNKY MODE BELOW
	matchupStats: {
		[playerChar: string]: {
			[opponentChar: string]: number;
		};
	};
	totalMatches: {
		[playerChar: string]: number;
	};
}

export function createDefaultStatStruct() {
	let defaultStatsData: {
		[playerChar: string]: {[opponentChar: string]: number};
	} = {};
	for (let i = 0; i < CHARACTERS.length; i++) {
		defaultStatsData[CHARACTERS[i]] = {};
		for (let j = 0; j < CHARACTERS.length; j++) {
			defaultStatsData[CHARACTERS[i]][CHARACTERS[j]] = 0;
		}
	}

	return defaultStatsData;
}

export function createDefaultTotalMatchesStruct() {
	let defaultTotalMatchesData: {[playerChar: string]: number} = {};
	for (let i = 0; i < CHARACTERS.length; i++) {
		defaultTotalMatchesData[CHARACTERS[i]] = 0;
	}
	return defaultTotalMatchesData;
}

export const matchDataConverter = {
	toFirestore: (matchData: WithFieldValue<IFirestoreMatchData>): DocumentData => {
		return {...matchData};
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions,
	): IFirestoreMatchData => {
		return snapshot.data(options) as IFirestoreMatchData;
	},
};

export const playerDataConverter = {
	toFirestore: (playerData: WithFieldValue<IFirestorePlayerData>): DocumentData => {
		return {...playerData};
	},
	fromFirestore: (
		snapshot: QueryDocumentSnapshot,
		options: SnapshotOptions,
	): IFirestorePlayerData => {
		return snapshot.data(options) as IFirestorePlayerData;
	},
};

export async function addMatchesToFirebase(fs: Firestore, data: IFirestoreMatchData[]) {
	const matches = collection(fs, FIRESTORE_MATCH_COLLECTION);
	const addPromises = data.map(async (match) => {
		addDoc(matches, match);
	});

	await Promise.all(addPromises);
}

export async function updateDataFromAddMatch(
	newMatch: IFirestoreMatchData,
	ref: DocumentReference<IFirestorePlayerData>,
) {
	//This assumes that the match has been created
	const docSnap = await getDoc(ref);
	let playerData = docSnap.data();
	if (playerData) {
		playerData.totalMatches[newMatch.playerChar]++;
		if (newMatch.playerWin) {
			playerData.matchupStats[newMatch.playerChar][newMatch.opponentChar]++;
		}

		setDoc(ref, playerData);
	}
}

export async function updateDataFromRemoveMatch(
	oldMatch: IFirestoreMatchData,
	ref: DocumentReference<IFirestorePlayerData>,
) {
	//This assumes that the match has been created
	const docSnap = await getDoc(ref);
	let playerData = docSnap.data();
	if (playerData) {
		playerData.totalMatches[oldMatch.playerChar]--;
		if (oldMatch.playerWin) {
			playerData.matchupStats[oldMatch.playerChar][oldMatch.opponentChar]--;
		}
		setDoc(ref, playerData);
	}
}

// export async function updateUserWinLossFromApi(
// 	fs: Firestore,
// 	matchData: IFirestoreMatchData[],
// 	uid: string,
// ) {
// 	const user = doc(fs, FIRESTORE_USER_COLLECTION, uid);

// 	const userData = useFirestoreDocData(user);

// 	matchData.forEach((match) => {
// 		userData.data[match.playerChar].numMatches++;
// 		match.playerWin ? userData.data[match.playerChar][match.opponentChar]++ : null;
// 	});

// 	userData.data.lastFetchTimestamp = Date.now();
// }
