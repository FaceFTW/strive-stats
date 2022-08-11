export interface Character {
	charCode: string;
	charName: string;
	charAsset: string;
}

export const CHARACTER_LIST: {[code: string]: Character} = {
	SOL: {
		charCode: 'SOL',
		charName: 'Sol Badguy',
		charAsset: 'Face_512_SOL.png',
	},
	ANJ: {
		charCode: 'ANJ',
		charName: 'Anji Mito',
		charAsset: 'Face_512_ANJ.png',
	},
	AXL: {
		charCode: 'AXL',
		charName: 'Axl Low',
		charAsset: 'Face_512_AXL.png',
	},
	BKN: {
		charCode: 'BKN',
		charName: 'Baiken',
		charAsset: 'Face_512_BKN.png',
	},
	CHP: {
		charCode: 'CHP',
		charName: 'Chipp Zanuff',
		charAsset: 'Face_512_CHP.png',
	},
	COS: {
		charCode: 'COS',
		charName: 'Happy Chaos',
		charAsset: 'Face_512_COS.png',
	},
	FAU: {
		charCode: 'FAU',
		charName: 'Faust',
		charAsset: 'Face_512_FAU.png',
	},
	GIO: {
		charCode: 'GIO',
		charName: 'Giovanna',
		charAsset: 'Face_512_GIO.png',
	},
	GLD: {
		charCode: 'GLD',
		charName: 'Goldlewis Dickinson',
		charAsset: 'Face_512_GLD.png',
	},
	INO: {
		charCode: 'INO',
		charName: 'I-No',
		charAsset: 'Face_512_INO.png',
	},
	JKO: {
		charCode: 'JKO',
		charName: 'Jack-O Valentine',
		charAsset: 'Face_512_JKO.png',
	},
	KYK: {
		charCode: 'KYK',
		charName: 'Ky Kiske',
		charAsset: 'Face_512_KYK.png',
	},
	LEO: {
		charCode: 'LEO',
		charName: 'Leo Whitefang',
		charAsset: 'Face_512_LEO.png',
	},
	MAY: {
		charCode: 'MAY',
		charName: 'May',
		charAsset: 'Face_512_MAY.png',
	},
	MLL: {
		charCode: 'MLL',
		charName: 'Millia Rage',
		charAsset: 'Face_512_MLL.png',
	},
	NAG: {
		charCode: 'NAG',
		charName: 'Nagoriyuki',
		charAsset: 'Face_512_NAG.png',
	},
	POT: {
		charCode: 'POT',
		charName: 'Potemkin',
		charAsset: 'Face_512_POT.png',
	},
	RAM: {
		charCode: 'RAM',
		charName: 'Ramlethal Valentine',
		charAsset: 'Face_512_RAM.png',
	},
	TST: {
		charCode: 'TST',
		charName: 'Testament',
		charAsset: 'Face_512_TST.png',
	},
	ZAT: {
		charCode: 'ZAT',
		charName: 'Zato-1',
		charAsset: 'Face_512_ZAT.png',
	},
	BGT: {
		charCode: 'BGT',
		charName: 'Bridget',
		charAsset: 'Face_512_BGT.png',
	},
};

export const CHARACTER_COLORS: {[code: string]: string} = {
	SOL: '#9c3523',
	ANJ: '#0a4e80',
	AXL: '#905b2e',
	BKN: '#fa6760',
	CHP: '#4b4950',
	COS: '#5d8092',
	FAU: '#107fab',
	GIO: '#09bd93',
	GLD: '#c29b4f',
	INO: '#cd4d42',
	JKO: '#f8df8e',
	KYK: '#408dc2',
	LEO: '#9d653d',
	MAY: '#ee9a4e',
	MLL: '#b29768',
	NAG: '#323b3b',
	POT: '#626a4d',
	RAM: '#51504c',
	TST: '#3c3a3a',
	ZAT: '#444d4a',
	BGT: '#799cb8',
};
