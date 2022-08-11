import {Grid} from '@mui/material';
import {getAuth, signInAnonymously} from 'firebase/auth';
import {addDoc, collection, doc, getDoc, getFirestore, setDoc} from 'firebase/firestore';
import {useEffect} from 'react';
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
import TitleBar from '../modules/TitleBar';
import MatchHistoryPanel from './MatchHistory';
import StatsPanel from './Stats';
import React from 'react';

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
			<Grid container spacing={2} mt={2}>
				<Grid item xs={12} sm={6}>
					<MatchHistoryPanel userDataRef={userData} />
				</Grid>
				<Grid item xs={12} sm={6}>
					<StatsPanel userDataRef={userData}></StatsPanel>
				</Grid>
			</Grid>
			<AddFAB handleSubmit={handleSubmit} userDataRef={userData} />
		</div>
	);
}
