import {getAuth, signInAnonymously} from 'firebase/auth';
import {addDoc, collection, doc, getDoc, getFirestore, setDoc} from 'firebase/firestore';
import {useEffect, useMemo} from 'react';
import {useFirebaseApp, useUser} from 'reactfire';
import {
	createDefaultStatStruct,
	createDefaultTotalMatchesStruct,
	FIRESTORE_MATCH_COLLECTION,
	FIRESTORE_USER_COLLECTION,
	matchDataConverter,
	playerDataConverter,
	updateDataFromAddMatch,
} from '../../api/firebase.api';
import AddFAB from '../modules/AddFAB';
import {CHARACTERS} from '../modules/CharSelect';
import TitleBar from '../modules/TitleBar';
import MatchHistoryPanel from './MatchHistory';

export default function MainPanel() {
	const app = useFirebaseApp();
	const fs = getFirestore(app);
	const auth = getAuth(app);

	const {status: loginStatus, data: user} = useUser();
	useEffect(() => {
		if (!user || !user.uid) {
			signInAnonymously(auth);
		}
	}, [user, auth]);

	const userData = doc(fs, FIRESTORE_USER_COLLECTION, user?.uid ?? '0').withConverter(
		playerDataConverter,
	);

	useEffect(() => {
		if (loginStatus === 'success') {
			getDoc(userData).then((doc) => {
				if (!doc.exists()) {
					const defaultStats = createDefaultStatStruct();
					const defaultTotals = createDefaultTotalMatchesStruct();
					setDoc(userData, {
						id: user?.uid ?? '0',
						playerName: '',
						striveId: '',
						lastFetchTimestamp: 0,
						matchupStats: defaultStats,
						totalMatches: defaultTotals,
					});
				}
			});
		}
	});

	const handleSubmit = (
		playerChar: string,
		opponentChar: string,
		floor: number,
		didWin: boolean,
	) => {
		if (playerChar && opponentChar && floor) {
			const matchDataCollection = collection(fs, FIRESTORE_MATCH_COLLECTION);
			addDoc(matchDataCollection, {
				playerChar: playerChar,
				opponentChar: opponentChar,
				playerWin: didWin,
				matchFloor: floor,
				matchTime: Date.now(),
				isApiMatch: false,
				uid: user?.uid,
			}).then(async (matchRef) => {
				const newData = (await getDoc(matchRef.withConverter(matchDataConverter))).data();
				if (newData) await updateDataFromAddMatch(newData, userData);
			});
		}
	};

	return (
		<div className='App'>
			<TitleBar />
			<MatchHistoryPanel userDataRef={userData} />
			<AddFAB handleSubmit={handleSubmit} userDataRef={userData} />
		</div>
	);
}
