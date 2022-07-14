import React from 'react';
import {Character, CHARACTER_LIST} from './characters/charlist';
import {CharSelectItem} from './CharSelect';

export default {
	title: 'Character Select Item',
	component: CharSelectItem,
};

const Template = (args: Character) => <CharSelectItem {...args} />;

export const Primary = {
	args: CHARACTER_LIST['SOL'],
};
