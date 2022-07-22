declare interface IApiPlayerData {
	id: number;
	character: string;
	name: string;
}

declare interface IApiMatchData {
	timestamp: number; //Unix Epoch Format
	floor: string;
}

declare enum CHARACTER {
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
