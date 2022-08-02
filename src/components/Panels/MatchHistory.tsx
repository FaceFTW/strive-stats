import {getAuth} from 'firebase/auth';
import {collection, getFirestore, orderBy, query, where} from 'firebase/firestore';
import {FirebaseAppProvider, useFirebaseApp, useFirestoreCollectionData} from 'reactfire';
import {IFirestoreMatchData} from '../MatchItem/MatchData';
import MatchItem from '../MatchItem/MatchItem';

export default function MatchHistoryPanel() {
	const app = useFirebaseApp();
	const auth = getAuth(app);

	const firestore = getFirestore(app);
	const matchCollection = collection(firestore, 'MatchData');
	const matchQuery = query(matchCollection, where('uid', '==', ''), orderBy('matchTime', 'desc'));

	const {status, data: matches} = useFirestoreCollectionData(matchQuery, {idField: 'id'});

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{matches.map((match) => (
				<MatchItem key={match.id} {...(match as IFirestoreMatchData)} />
			))}
		</div>
	);
}
