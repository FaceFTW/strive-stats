import {addDoc, collection, getFirestore} from 'firebase/firestore';
import {useFirebaseApp} from 'reactfire';
import {FIRESTORE_MATCH_COLLECTION} from './api/firebase.api';
import './App.css';
import AddFAB from './components/FAB/AddFAB';
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
				playerWon: didWin,
				matchFloor: floor,
				matchTime: Date.now(),
				isApiMatch: false,
				uid: '',
			});
		}
	};

	return (
		<div className='App'>
			<MatchHistoryPanel></MatchHistoryPanel>
			<AddFAB handleSubmit={handleSubmit}></AddFAB>
		</div>
	);
}

export default App;
