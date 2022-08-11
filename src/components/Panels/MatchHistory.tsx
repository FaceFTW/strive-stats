import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from '@mui/material';
import {
	collection,
	deleteDoc,
	doc,
	DocumentReference, getFirestore,
	orderBy,
	query,
	setDoc,
	where
} from 'firebase/firestore';
import React from 'react';
import {useFirebaseApp, useFirestoreCollectionData, useUser} from 'reactfire';
import {
	FIRESTORE_MATCH_COLLECTION,
	IFirestoreMatchData,
	IFirestorePlayerData,
	matchDataConverter,
	updateDataFromAddMatch,
	updateDataFromRemoveMatch
} from '../../api/firebase.api';
import MatchDialogContent from '../modules/MatchDialogContent';
import MatchItem from '../modules/MatchItem';

export interface MatchHistoryProps {
	userDataRef: DocumentReference<IFirestorePlayerData>;
}

export default function MatchHistoryPanel(props: MatchHistoryProps) {
	const app = useFirebaseApp();
	const {status: loginStatus, data: user} = useUser();

	const firestore = getFirestore(app);
	const matchCollection = collection(firestore, 'MatchData').withConverter(matchDataConverter);

	const matchQuery = query(
		matchCollection,
		where('uid', '==', user?.uid || ''),
		orderBy('matchTime', 'desc'),
	);

	const {status, data: matches} = useFirestoreCollectionData(matchQuery, {
		idField: 'id',
	});

	const [editOpen, setEditOpen] = React.useState(false);
	const [editDocId, setEditDocId] = React.useState('');
	const [editPlayerChar, setEditPlayerChar] = React.useState('');
	const [editOpponentChar, setEditOpponentChar] = React.useState('');
	const [editFloor, setEditFloor] = React.useState(0);
	const [editDidWin, setEditDidWin] = React.useState(true);
	const [editReadOnly, setEditReadOnly] = React.useState(false);
	const [editMatchOriginal, setEditMatchOriginal] = React.useState<IFirestoreMatchData>();

	const handleEditOpen = (match: IFirestoreMatchData) => {
		if (match.id) {
			setEditDocId(match.id);
		}
		setEditPlayerChar(match.playerChar);
		setEditOpponentChar(match.opponentChar);
		setEditDidWin(match.playerWin);
		setEditFloor(match.matchFloor);
		match.isApiData ? setEditReadOnly(true) : setEditReadOnly(false);
		setEditMatchOriginal(match);

		setEditOpen(true);
	};

	const handleDocDelete = async () => {
		setEditOpen(false);
		const docRef = await doc(firestore, FIRESTORE_MATCH_COLLECTION, editDocId).withConverter(
			matchDataConverter,
		);

		if (editMatchOriginal) {
			await updateDataFromRemoveMatch(editMatchOriginal, props.userDataRef);
		}
		await deleteDoc(docRef);
	};

	const handleDocUpdate = async (original: IFirestoreMatchData | undefined) => {
		setEditOpen(false);

		if (editMatchOriginal) {
			await updateDataFromRemoveMatch(editMatchOriginal, props.userDataRef);
		}
		const docRef = await doc(firestore, FIRESTORE_MATCH_COLLECTION, editDocId).withConverter(
			matchDataConverter,
		);
		await setDoc(docRef, {
			...original,
			playerChar: editPlayerChar,
			opponentChar: editOpponentChar,
			playerWin: editDidWin,
			matchFloor: editFloor,
		}).then(async () => {
			await updateDataFromAddMatch(
				{
					...original,
					playerChar: editPlayerChar,
					opponentChar: editOpponentChar,
					playerWin: editDidWin,
					matchFloor: editFloor,
				} as IFirestoreMatchData,
				props.userDataRef,
			);
		});
	};

	if (status === 'loading') {
		return <div>Loading...</div>;
	}
	return (
		<div>
			<Stack spacing={2} mt={2} ml={2}>
				{matches.map((match) => (
					<div key={match.id} onClick={() => handleEditOpen(match)}>
						<MatchItem key={match.id} match={match} />
					</div>
				))}
			</Stack>
			<Dialog open={editOpen} onClose={() => setEditOpen(false)}>
				<DialogTitle>Edit Match</DialogTitle>
				<DialogContent>
					<MatchDialogContent
						playerChar={editPlayerChar}
						opponentChar={editOpponentChar}
						didWin={editDidWin}
						floor={editFloor}
						setPlayerChar={setEditPlayerChar}
						setOpponentChar={setEditOpponentChar}
						setDidWin={setEditDidWin}
						setFloor={setEditFloor}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setEditOpen(false)}>Cancel</Button>
					<Button onClick={() => handleDocDelete()} disabled={editReadOnly}>
						Delete
					</Button>
					<Button
						onClick={() => handleDocUpdate(editMatchOriginal)}
						disabled={editReadOnly}
					>
						Update
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
