import {create} from 'axios';
import {encode, decode} from 'msgpack-lite';
import {inspect} from 'util';

const client = create({
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
	let params = new URLSearchParams({data: encode(data).toString('hex')});
	const response = await client.post(url, params.toString());
	return decode(response.data);
};

const getMatchDataWithSteamId = async (steamId) => {
	const loginResponse = await apiRequest('user/login', [
		['', '', 2, '0.1.4', 3],
		[
			1,
			steamId.toString(),
			steamId.toString(16),
			256,
			'140000007C83CA4A64E74F644431C3060100100124CAF16218000000010000000200000000747AFFEDFF3881370B580F080000001801000098000000040000004431C30601001001E01E150020025C9BAF00A8C0000000000ECAF1628E790D630100020509001100D19017000000D29017000000D39017000000D49017000000D59017000000D69017000000D79017000000D89017000000D82C190000009A38190000001AC11F0000001BC11F0000001CC11F0000001DC11F0000001EC11F0000001FC11F00000020C11F00000000008C794A7908782284B6BEA3AB5078971C65E2F63112B0A78DF2CA9509688EBFD3CD951405793B04E2C8BFF035BE763BBB00EA35DF0AAD2270D9049FB78F373A388F1F873A3EAE85AF9E3C6968A9BF9106FEB2B5B3B6BFDAAD7EFAFEDAED2395F61C3100B4627CEDF37AE08AEB5CC612EFD2F4B6A804DCA1DB0BA197B9332FC92E',
		],
	]);

	console.log(loginResponse);

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

	console.log(inspect(matches, {depth: null, showHidden: true, colors: true}));
};

getMatchDataWithSteamId('76561198073721156');
