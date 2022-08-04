//NOTE This only holds helper functions for Firebase Stuff, thus any function should pull a ref or something from somewhere else

import {
	addDoc,
	collection,
	DocumentData,
	Firestore,
	QueryDocumentSnapshot,
	SnapshotOptions,
	WithFieldValue,
} from 'firebase/firestore';

export const FIRESTORE_MATCH_COLLECTION = 'MatchData';
export const FIRESTORE_USER_COLLECTION = 'Users';

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
			totalMatches: number;
			[opponentChar: string]: number;
		};
	};
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

export async function addMatchesToFirebase(fs: Firestore, data: IFirestoreMatchData[]) {
	//TODO
	const matches = collection(fs, FIRESTORE_MATCH_COLLECTION);
	const addPromises = data.map(async (match) => {
		addDoc(matches, match);
	});

	await Promise.all(addPromises);
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
