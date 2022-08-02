//NOTE This only holds helper functions for Firebase Stuff, thus any function should pull a ref or something from somewhere else

import {addDoc, collection, Firestore} from 'firebase/firestore';
import {IFirestoreMatchData} from '../components/MatchItem/MatchData';

export const FIRESTORE_MATCH_COLLECTION = 'MatchData';
export const FIRESTORE_USER_COLLECTION = 'Users';

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
