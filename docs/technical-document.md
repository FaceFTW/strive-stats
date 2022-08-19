# A Brief Foray into API Reverse Engineering and HTTP Requests

One of the primary features of -STRIVE- stats is that it can directly interact with the official API used by Guilty Gear -STRIVE- (GGST). However, to achieve this functionality, knowledge about the data that the API accepts, and returns is needed to properly map and use the desired data. Given that this API is private (in the sense that no public documentation is available), we must perform some tasks to generate information needed for the features.

It should be noted that there already exist open-source projects and resources dedicated to interfacing with the Guilty Gear -STRIVE- API. I will be referencing those projects and resources throughout this document as the groundwork laid by those projects have been instrumental in understanding where to begin and how to proceed. Tools and references will be hyperlinked as they are discussed.

## Dolphins and Sharks

Since this feature involves interacting with a web API, it is important to know the mechanism used to interact with it: HTTP Requests. The key issue is not how the HTTP request works, but rather what do we send to the API for it to consider as a proper request. For most web APIs, you would need to know the URL to send the request to, the HTTP method the request uses (`GET`, `POST`, etc.), the headers of the request (describes things about the request), and the body of the request if applicable. This information is not easily accessible without some tooling we need to scrape information at lower levels.

The first tool is called [Totsugeki](https://github.com/optix2000/totsugeki) (named after the catchphrase of May’s signature move where she rides a dolphin) is useful as it patches GGST to use a local proxy server that creates a TCP Keep-Alive connection to send the game’s API Requests over. While the primary utility of Totsugeki is for decreasing game load times by reducing the number of individual requests made during startup (which was initially uncovered by /u/TarballX [here](https://www.reddit.com/r/Guiltygear/comments/oaqwo5/analysis_of_network_traffic_at_game_startup/)), it logs all of the requests the proxy receives from GGST, which allows us to understand what data we can retrieve from the API at a higher level.

The second tool is [Wireshark](https://www.wireshark.org/), the leading open-source network analyzer tool. This tool allows us to capture all network packets at an interface-level, which is compounded on top of the various tools to dissect and reconstruct various different network protocol calls. With this in mind, we can cast a net of all traffic going through a network interface while GGST is proxied by Totsugeki, thus giving us all of the information needed about the API.

![Dolphins & Sharks](dolphins_and_sharks.png)

## The Numbers, What do they mean?????

After some parsing through the requests, I found some relevant requests for what I want to do. The first is a request to the server for getting replays:
![An example of a captured HTTP request](wireshark.png)
This request gave me some useful information that we need to send requests to the API:

- The API URL to send the request to (`api/catalog/get_replay`)
- The HTTP version/method used for the request (`HTTP/1.1 POST`)
- The request uses the following headers (which the API might be strict about)
  - `Content-Type: application/x-www-form-urlencoded` - Defines what type of data is in the body of the request
  - `User-Agent: Steam` - Defines the client that sent the request
  - `Cache-Control: no-cache` - Tells the server to not cache the request
- The request has some type of body that is defined by `data=<data here>`

So we have everything needed except the most critical component: the body. I would have been stuck here and dropped this feature if the community hadn't figured out what encoding the body was sent in. [ggst-api-rs](https://github.com/halvnykterist/ggst-api-rs), a wrapper for the GGST API written in Rust and used for the site [Rating Update](https://ratingupdate.info) has already answered that question in the README:

> To collect replays a POST request has to be made to [https://ggst-game.guiltygear.com/api/catalog/get_replay](https://ggst-game.guiltygear.com/api/catalog/get_replay). The body should be of the content type application/x-www-form-urlencoded and contain a single entry with the key data which is hex encoded messagepack. The response is plain messagepack. Rust types are defined for both the request and response with all know fields having readable names.

Given this information, we just need to decode the response with a messagepack decoder (I used [https://msgpack.solder.party](https://msgpack.solder.party)). We can then cross-reference this data with the known values featured in [ggst-api-rs](https://github.com/halvnykterist/ggst-api-rs) and understand the structure of the request and response:

![Connecting the Dots](data%20mapping.png)

## Automating the Process (and Breaking Changes)

The primary concern with the batch import feature is automating the request. With this task, we also need to consider how user-friendly we can make it, ways to prevent pulling redundant data, and how to not "hammer" the API (especially since it is not my own). Rating Update solves this problem by fetching *all* replay data regardless of user and storing it into a database after some ETL (**E**xtraction, **T**ransport, and **L**oading) to be used with the site ([Source](http://ratingupdate.info/about#Updates)), which can become costly and slow if not managed or scaled properly. Since I only want to fetch the data related to the user, it makes more sense to adjust the request to only acquire matches relevant to the player. After some tinkering, I was able to come up with the following code:

```js
const {create} = require('axios');
const {encode, decode} = require('msgpack-lite');
const inspect = require('util');

const client = create({
	baseURL: 'https://ggst-game.guiltygear.com/api/',
	timeout: 2000,
	headers: {
		'User-Agent': 'GGST/Steam',
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
		[1, steamId.toString(), steamId.toString(16), 256, ''],
	]);

	const someId = loginResponse[0][0];
	const striveId = loginResponse[1][1][0];

	let matches = [];
	for (let i = 0; i < 100; i++) {
		const replayResponse = await apiRequest('catalog/get_replay', [
			[striveId, someId, 2, '0.1.4', 3],
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
```

In essence, we first obtain the striveID of the user based on their Steam ID (found on sites such as [SteamDB](https://steamdb.info/)). We then use this to obtain the match data for the user, which is split into pages of 127 matches, with up to 100 pages available for query. This would work and we can break out of the loop earlier based on different conditions (we currently only break if the response has no matches).

However, Arc System Works updated the game, which now uses a different API request set. This means that the request body has changed, but we then hit a different issue: There are parts of the new requests that have unknown purpose and are not easily decipherable:

![Unknown parts of the request](unknownnumbers.png)

Unfortunately, further investigation yielded no new information, so this means that the feature gets the axe due to impossibility with the current architecture. It was fun trying to solve the mysteries of the API, but it is not worth the effort for a feature that could also have broken fairly easily again.
