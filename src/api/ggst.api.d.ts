declare interface IApiPlayerData {
	id: number;
	character: string;
	name: string;
}

declare interface IApiMatchData {
	timestamp: number; //Unix Epoch Format
	floor: string;
}

declare enum PLAYER {
	P1 = 'Player1',
	P2 = 'Player2',
}

declare enum Floor {
	F1 = 'F1',
	F2 = 'F2',
	F3 = 'F3',
	F4 = 'F4',
	F5 = 'F5',
	F6 = 'F6',
	F7 = 'F7',
	F8 = 'F8',
	F9 = 'F9',
	F10 = 'F10',
	FCELESTIAL = 'Celestial',
}

declare enum Character {
	SOL = 'Sol',
	KYK = 'Ky',
	MAY = 'May',
	AXL = 'Axl',
	CHP = 'Chipp',
	POT = 'Potemkin',
	FAU = 'Faust',
	MLL = 'Millia',
	ZAT = 'Zato',
	RAM = 'Ram',
	LEO = 'Leo',
	NAG = 'Nago',
	GIO = 'Giovanna',
	ANJ = 'Anji',
	INO = 'I-No',
	GLD = 'Goldlewis',
	JKO = 'Jack-O',
	COS = 'Happy-Chaos',
	BKN = 'Baiken',
	TST = 'Testament',
}
