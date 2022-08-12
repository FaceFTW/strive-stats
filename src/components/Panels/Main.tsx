import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Fab,
	Grid,
	ThemeProvider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {getAuth, signInAnonymously} from 'firebase/auth';
import {addDoc, collection, doc, getDoc, getFirestore, setDoc} from 'firebase/firestore';
import React, {useEffect} from 'react';
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
import MatchDialogContent from '../modules/MatchDialogContent';
import TitleBar from '../modules/TitleBar';
import MatchHistoryPanel from './MatchHistory';
import StatsPanel from './Stats';
import {appTheme} from '../theme';

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
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
		setPlayerCharValue('');
		setOpponentCharValue('');
		setFloorValue(1);
		setDidWin(true);
	};
	const handleClose = () => setOpen(false);

	const [playerCharValue, setPlayerCharValue] = React.useState('');
	const [opponentCharValue, setOpponentCharValue] = React.useState('');
	const [floorValue, setFloorValue] = React.useState(1);
	const [didWin, setDidWin] = React.useState(true);

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
		<ThemeProvider theme={appTheme}>
			<div className='App'>
				<TitleBar />
				<Grid container spacing={1} mt={2} mx={1}>
					<Grid item xs={12} md={6} p={1}>
						<MatchHistoryPanel userDataRef={userData} />
					</Grid>
					<Grid item xs={12} md={6} p={1}>
						<StatsPanel userDataRef={userData}></StatsPanel>
					</Grid>
				</Grid>
				<Fab
					color='primary'
					sx={{position: 'fixed', bottom: 16, right: 16}}
					onClick={handleClickOpen}
				>
					<AddIcon fontSize='large' />
				</Fab>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Add Match</DialogTitle>
					<Divider />
					<DialogContent>
						<MatchDialogContent
							playerChar={playerCharValue}
							setPlayerChar={setPlayerCharValue}
							opponentChar={opponentCharValue}
							setOpponentChar={setOpponentCharValue}
							floor={floorValue}
							setFloor={setFloorValue}
							didWin={didWin}
							setDidWin={setDidWin}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							onClick={() => {
								handleSubmit(
									playerCharValue,
									opponentCharValue,
									floorValue,
									didWin,
								);
								setOpen(false);
							}}
						>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</ThemeProvider>
	);
}
