const axios = require('axios');
const msgpack = require('msgpack-lite');
const util = require('util');

const client = axios.create({
	baseURL: 'https://ggst-game.guiltygear.com/api/',
	timeout: 2000,
	headers: {
		'User-Agent': 'Steam',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Cache-Control': 'no-cache',
	},
	responseType: 'arraybuffer',
});

const apiRequest = async (url, data) => {
	let params = new URLSearchParams({data: msgpack.encode(data).toString('hex')});
	const response = await client.post(url, params.toString());
	return msgpack.decode(response.data);
};

const getMatchDataWithSteamId = async (steamId) => {
	const loginResponse = await apiRequest('user/login', [
		['', '', 2, '0.1.3', 3],
		[1, steamId.toString(), steamId.toString(16), 256, ''],
	]);

	const someId = loginResponse[0][0];
	const striveId = loginResponse[1][1][0];

	let matches = [];
	for (let i = 0; i < 100; i++) {
		const replayResponse = await apiRequest('catalog/get_replay', [
			[striveId, someId, 2, '0.1.3', 3],
			[1, i, 10, [-1, 1, 1, 99, [], -1, -1, 0, 0, 1]],
		]);

		if (!replayResponse[1][3][0]) {
			break;
		} else {
			matches = matches.concat(replayResponse[1][3]);
		}
	}

	console.log(util.inspect(matches, {depth: null, showHidden: true, colors: true}));
};

getMatchDataWithSteamId('76561198073721156');
