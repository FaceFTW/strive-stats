import './App.css';
import AddFAB from './components/FAB/AddFAB';
import MatchHistoryPanel from './components/Panels/MatchHistory';

function App() {
	const handleSubmit = (
		playerChar: string,
		opponentChar: string,
		floor: number,
		didWin: boolean,
	) => {};

	return (
		<div className='App'>
			<MatchHistoryPanel></MatchHistoryPanel>
			<AddFAB handleSubmit={() => {}}></AddFAB>
		</div>
	);
}

export default App;
