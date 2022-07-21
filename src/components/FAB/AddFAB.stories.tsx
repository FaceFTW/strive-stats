import AddFAB, {AddFABProps} from './AddFAB';
import React from 'react';
import '../../App.css';

export default {
	title: 'Floating Action Buttons - Add Single',
	component: AddFAB,
};

const template = (args: AddFABProps) => {
	return <AddFAB {...args}></AddFAB>;
};

// export const Primary = () => {
// 	{
// 		args: {
// 		}
// 	}
// };
