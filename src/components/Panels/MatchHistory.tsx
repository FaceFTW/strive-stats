import {collection, orderBy, query, where} from 'firebase/firestore';
import {useAuth, useFirebaseApp, useFirestore} from 'reactfire';

export default function MatchHistoryPanel() {
	const app = useFirebaseApp();
	const auth = useAuth();

	const firestore = useFirestore();
	const matchCollection = collection(firestore, 'MatchData');
	const matchQuery = query(
		matchCollection,
		where('playerUID', '==', auth.currentUser?.uid),
		orderBy('matchTime', 'desc'),
	);




	return <div></div>;
}
