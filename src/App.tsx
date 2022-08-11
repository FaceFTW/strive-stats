import {getAuth} from 'firebase/auth';
import {AuthProvider, useFirebaseApp} from 'reactfire';
import './App.css';
import MainPanel from './components/Panels/Main';
import React from 'react';

function App() {
	const app = useFirebaseApp();
	const auth = getAuth(app);

	return (
		<AuthProvider sdk={auth}>
			<MainPanel />
		</AuthProvider>
	);
}

export default App;
