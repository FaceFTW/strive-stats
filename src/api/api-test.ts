/**Tests is a misnomer, rather this is just an easy way
 * for me to see what the API do */

import GGSTApi from './ggst.api';

export default function apiTest() {
	const wrapper = new GGSTApi();

	wrapper.getRcode('FaceFTW').then((data) => {
		console.log(data);
	});
}

apiTest();
