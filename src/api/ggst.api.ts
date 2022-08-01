/**
 * This code is practically based off of the 'ggst-api-node' library,
 * but I did a full port rather than creating a definition in case I needed to pull other API data
 *
 * Here is the original NodeJS library source: https://github.com/saganthewise/ggst-api-node
 */

import axios from 'axios';
import msgpack from 'msgpack-lite';

export const VERSION = '0.1.2';
export enum EApiPlayer {
	P1 = 1,
	P2 = 2,
}

export enum Floor {
	F1 = 1,
	F2 = 2,
	F3 = 3,
	F4 = 4,
	F5 = 5,
	F6 = 6,
	F7 = 7,
	F8 = 8,
	F9 = 9,
	F10 = 10,
	FCELESTIAL = 99,
}

export enum ApiCharacter {
	SOL = 0,
	KYK = 1,
	MAY = 2,
	AXL = 3,
	CHP = 4,
	POT = 5,
	FAU = 6,
	MLL = 7,
	ZAT = 8,
	RAM = 9,
	LEO = 10,
	NAG = 11,
	GIO = 12,
	ANJ = 13,
	INO = 14,
	GLD = 15,
	JKO = 16,
	COS = 17,
	BKN = 18,
	TST = 19,
}

export type IApiPlayer = {
	striveId: string;
	playerName: string;
	steamId: string;
	steamId16: string;
	floor: number;
};

export type IApiReplay = {
	id: string;
	unknown1: number;
	floor: Floor;
	player1Char: ApiCharacter;
	player2Char: ApiCharacter;
	player1: IApiPlayer;
	player2: IApiPlayer;
	winner: EApiPlayer;
	date: Date;
	unknown2: number;
	views: number;
	unknown3: number;
	likes: number;
};

export enum PLATFORM {
	PC = 3,
	PS = 1,
}

export default class GGSTApi {
	private readonly client;

	constructor() {
		this.client = axios.create({
			baseURL: 'https://ggst-game.guiltygear.com/api/',
			timeout: 2000,
			headers: {
				'User-Agent': 'Steam',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cache-Control': 'no-cache',
			},
			responseType: 'arraybuffer',
		});
	}

	public async apiRequest(url: string, data: any[]) {
		let params = new URLSearchParams({data: msgpack.encode(data).toString('hex')});
		const response = await this.client.post(url, params.toString());
		return msgpack.decode(response.data);
	}

	public userLogin(steamID: number, platform = PLATFORM.PC) {
		return this.apiRequest('/user/login', [
			['', '', 6, VERSION, PLATFORM[platform]],
			[1, steamID.toString(), steamID.toString(16), 256, ''],
		]);
	}

	public async getMatchDataWithSteamId(steamId: number) {
		const loginResponse = await this.apiRequest('user/login', [
			['', '', 2, '0.1.3', 3],
			[1, steamId.toString(), steamId.toString(16), 256, ''],
		]);

		console.log(loginResponse);

		const someId = loginResponse[0][0];
		const striveId = loginResponse[1][1][0];

		for (let i = 0; i < 100; i++) {
			const replayResponse = await this.apiRequest('catalog/get_replay', [
				[striveId, someId, 2, '0.1.3', 3],
				[1, i, 10, [-1, 1, 1, 99, [], -1, -1, 0, 0, 1]],
			]);
		}
	}
}
