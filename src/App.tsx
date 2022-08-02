import './App.css';
import AddFAB from './components/FAB/AddFAB';
import MatchHistoryPanel from './components/Panels/MatchHistory';

function App() {
	return (
		<div className='App'>
			<MatchHistoryPanel></MatchHistoryPanel>
			<AddFAB handleSubmit={() => {}}></AddFAB>
		</div>
	);
}

export default App;
