import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {useFirebaseApp} from 'reactfire';
import {FIRESTORE_MATCH_COLLECTION} from './api/firebase.api';
import './App.css';
import AddFAB from './components/modules/AddFAB';
import TitleBar from './components/modules/TitleBar';
import MatchHistoryPanel from './components/Panels/MatchHistory';

function App() {
	const app = useFirebaseApp();

	// const {status: loginStatus, data: user} = useUser();
	const fs = getFirestore(app);

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
				uid: '',
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

export default App;
