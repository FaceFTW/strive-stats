import {getAuth, signInAnonymously} from 'firebase/auth';
import {addDoc, collection, doc, getDoc, getFirestore} from 'firebase/firestore';
import {useEffect, useMemo} from 'react';
import {useFirebaseApp, useUser} from 'reactfire';
import {
	FIRESTORE_MATCH_COLLECTION, FIRESTORE_USER_COLLECTION,
	playerDataConverter
} from '../../api/firebase.api';
import AddFAB from '../modules/AddFAB';
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

	const userData = useMemo(async () => {
		if (user && user.uid) {
			return await getDoc(
				doc(fs, FIRESTORE_USER_COLLECTION, user.uid).withConverter(playerDataConverter),
			);
		}
		return {};
	}, [fs, user]);

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
			});
		}
	};

	return (
		<div className='App'>
			<TitleBar />
			<MatchHistoryPanel />
			<AddFAB handleSubmit={handleSubmit} />
		</div>
	);
}
