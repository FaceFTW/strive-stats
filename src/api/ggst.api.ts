/**
 * This code is practically based off of the 'ggst-api-node' library,
 * but I did a full port rather than creating a definition in case I needed to pull other API data
 *
 * Here is the original NodeJS library source: https://github.com/saganthewise/ggst-api-node
 */

import axios from 'axios';
import msgpack from 'msgpack-lite';

export const VERSION = '0.1.2';

export const CHARACTERS: {[character: string]: number} = {
	All: -1,
	Sol: 0,
	Ky: 1,
	May: 2,
	Axl: 3,
	Chipp: 4,
	Potemkin: 5,
	Faust: 6,
	Millia: 7,
	Zato: 8,
	Ram: 9,
	Leo: 10,
	Nago: 11,
	Giovanna: 12,
	Anji: 13,
	'I-No': 14,
	Goldlewis: 15,
	'Jack-O': 16,
	'Happy-Chaos': 17,
	Baiken: 18,
	Testament: 19,
};

declare enum PLATFORM {
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

	public apiRequest(url: string, data: any[]) {
		let params = new URLSearchParams({data: msgpack.encode(data).toString('hex')});
		return this.client.post(url, params.toString()).then((response) => {
			return msgpack.decode(response.data);
		});
	}

	public userLogin(steamID: number, platform = PLATFORM.PC) {
		return this.apiRequest('user/login', [
			['', '', 6, VERSION, PLATFORM[platform]],
			[1, steamID.toString(), steamID.toString(16), 256, ''],
		]);
	}

	public getRcode(striveID: string, platform = PLATFORM.PC) {
		return this.apiRequest('/statistics/get', [
			['', '', 6, VERSION, PLATFORM[platform]],
			[striveID, 7, -1, -1, -1, -1],
		]).then((data) => {
			return JSON.parse(data[1][1]);
		});
	}

	public getMatchStats(striveID: string, character = 'All', platform = PLATFORM.PC) {
		return this.apiRequest('/statistics/get', [
			['', '', 6, VERSION, PLATFORM[platform]],
			[striveID, 1, 1, CHARACTERS[character], -1, -1],
		]).then((data) => {
			return JSON.parse(data[1][1]);
		});
	}

	public getSkillStats(striveID: string, character = 'All', platform = PLATFORM.PC) {
		return this.apiRequest('/statistics/get', [
			['', '', 6, VERSION, PLATFORM[platform]],
			[striveID, 2, 1, CHARACTERS[character], -1, -1],
		]).then((data) => {
			return JSON.parse(data[1][1]);
		});
	}
}
